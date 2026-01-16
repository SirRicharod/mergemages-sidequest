<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PostController extends Controller
{
    /**
     * Get all posts (excluding deleted)
     */
    public function index()
    {
        $posts = DB::table('posts')
            ->leftJoin('users as author', 'posts.author_user_id', '=', 'author.user_id')
            ->leftJoin('users as accepter', 'posts.accepted_user_id', '=', 'accepter.user_id')
            ->select(
                'posts.post_id',
                'posts.author_user_id',
                'posts.accepted_user_id',
                'posts.title',
                'posts.body',
                'posts.type',
                'posts.status',
                'posts.bounty_points',
                'posts.urgent',
                'posts.created_at',
                'posts.updated_at',
                'author.name as author_name',
                'author.avatar as author_avatar',
                'accepter.name as accepter_name',
                'accepter.avatar as accepter_avatar',
                // 👇 NIEUW: Telt de comments via een subquery
                DB::raw('(SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.post_id) as comments_count')
            )
            ->whereIn('posts.status', ['created', 'in_progress', 'completed'])
            ->orderBy('posts.created_at', 'desc')
            ->get();

        // Format the response to match frontend expectations
        $formattedPosts = $posts->map(function ($post) {
            $result = [
                'post_id' => $post->post_id,
                'author_user_id' => $post->author_user_id,
                'accepted_user_id' => $post->accepted_user_id,
                'title' => $post->title,
                'body' => $post->body,
                'type' => $post->type,
                'status' => $post->status,
                'bounty_points' => $post->bounty_points,
                'urgent' => $post->urgent,
                'created_at' => $post->created_at,
                'updated_at' => $post->updated_at,
                // 👇 NIEUW: Geef de teller mee aan de frontend
                'comments_count' => $post->comments_count, 
                'author' => [
                    'name' => $post->author_name,
                    'avatar_url' => $post->author_avatar,
                ],
            ];

            // Add accepter info if quest has been accepted
            if ($post->accepted_user_id) {
                $result['accepter'] = [
                    'user_id' => $post->accepted_user_id,
                    'name' => $post->accepter_name,
                    'avatar_url' => $post->accepter_avatar,
                ];
            }

            return $result;
        });

        return response()->json([
            'posts' => $formattedPosts,
        ]);
    }

    /**
     * Create a new post
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'body' => 'required|string',
            'type' => 'required|in:request,offer',
            'bounty_points' => 'required|integer|min:0',
            'boost' => 'boolean',
        ]);

        // Define boost cost
        $boostCost = 200;
        $isUrgent = $validated['boost'] ?? false;
        $totalCost = $validated['bounty_points'] + ($isUrgent ? $boostCost : 0);

        // Check if user has enough XP
        $user = DB::table('users')
            ->where('user_id', $request->user()->user_id)
            ->select('xp_balance')
            ->first();

        if ($user->xp_balance < $totalCost) {
            return response()->json([
                'message' => 'Insufficient XP balance',
                'current_balance' => $user->xp_balance,
                'required' => $totalCost
            ], 400);
        }

        // Deduct XP from user's balance
        DB::table('users')
            ->where('user_id', $request->user()->user_id)
            ->decrement('xp_balance', $totalCost);

        $postId = (string) Str::uuid();

        DB::table('posts')->insert([
            'post_id' => $postId,
            'author_user_id' => $request->user()->user_id,
            'title' => trim(strip_tags($validated['title'])),
            'body' => trim(strip_tags($validated['body'])),
            'type' => $validated['type'],
            'status' => 'created',
            'bounty_points' => $validated['bounty_points'],
            'urgent' => $isUrgent,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $post = DB::table('posts')
            ->leftJoin('users', 'posts.author_user_id', '=', 'users.user_id')
            ->select(
                'posts.post_id',
                'posts.author_user_id',
                'posts.title',
                'posts.body',
                'posts.type',
                'posts.status',
                'posts.bounty_points',
                'posts.urgent',
                'posts.created_at',
                'posts.updated_at',
                'users.name as author_name',
                'users.avatar_url as author_avatar'
            )
            ->where('posts.post_id', $postId)
            ->first();

        // Get updated XP balance
        $updatedUser = DB::table('users')
            ->where('user_id', $request->user()->user_id)
            ->select('xp_balance')
            ->first();

        return response()->json([
            'message' => 'Post created successfully',
            'post' => [
                'post_id' => $post->post_id,
                'author_user_id' => $post->author_user_id,
                'title' => $post->title,
                'body' => $post->body,
                'type' => $post->type,
                'status' => $post->status,
                'bounty_points' => $post->bounty_points,
                'urgent' => $post->urgent,
                'created_at' => $post->created_at,
                'updated_at' => $post->updated_at,
                // Bij een nieuwe post zijn er 0 comments
                'comments_count' => 0, 
                'author' => [
                    'name' => $post->author_name,
                    'avatar_url' => $post->author_avatar,
                ],
            ],
            'xp_balance' => $updatedUser->xp_balance
        ], 201);
    }

    /**
     * Update post status
     */
    public function updateStatus(Request $request, $postId)
    {
        $validated = $request->validate([
            'status' => 'required|in:created,in_progress,completed,deleted',
        ]);

        $updated = DB::table('posts')
            ->where('post_id', $postId)
            ->update([
                'status' => $validated['status'],
                'updated_at' => now(),
            ]);

        if (!$updated) {
            return response()->json([
                'message' => 'Post not found',
            ], 404);
        }

        return response()->json([
            'message' => 'Post status updated successfully',
        ]);
    }

    /**
     * Accept a quest (post)
     * - Users can only accept quests from other users (not their own)
     * - Status changes from 'created' to 'in_progress'
     * - Accepted user is recorded
     */
    public function acceptQuest(Request $request, $postId)
    {
        $userId = $request->user()->user_id;

        // Get the post
        $post = DB::table('posts')
            ->where('post_id', $postId)
            ->first();

        if (!$post) {
            return response()->json([
                'message' => 'Quest not found',
            ], 404);
        }

        // Check if user is trying to accept their own quest
        if ($post->author_user_id === $userId) {
            return response()->json([
                'message' => 'You cannot accept your own quest',
            ], 403);
        }

        // Check if quest is available (status must be 'created')
        if ($post->status !== 'created') {
            return response()->json([
                'message' => 'This quest is not available for acceptance',
            ], 400);
        }

        // Check if quest is already accepted
        if ($post->accepted_user_id !== null) {
            return response()->json([
                'message' => 'This quest has already been accepted by another user',
            ], 400);
        }

        // Update the post with accepted user and change status to in_progress
        DB::table('posts')
            ->where('post_id', $postId)
            ->update([
                'accepted_user_id' => $userId,
                'status' => 'in_progress',
                'updated_at' => now(),
            ]);

        return response()->json([
            'message' => 'Quest accepted successfully',
            'quest' => [
                'post_id' => $post->post_id,
                'status' => 'in_progress',
                'accepted_user_id' => $userId,
            ],
        ]);
    }

    /**
     * Un-accept/Cancel a quest
     * - Only the user who accepted the quest can cancel it
     * - Quest must be in 'in_progress' status
     * - Changes status back to 'created' and removes accepted_user_id
     */
    public function cancelQuest(Request $request, $postId)
    {
        $userId = $request->user()->user_id;

        // Get the post
        $post = DB::table('posts')
            ->where('post_id', $postId)
            ->first();

        if (!$post) {
            return response()->json([
                'message' => 'Quest not found',
            ], 404);
        }

        // Check if user is the one who accepted it
        if ($post->accepted_user_id !== $userId) {
            return response()->json([
                'message' => 'Only the user who accepted this quest can cancel it',
            ], 403);
        }

        // Check if quest is in progress
        if ($post->status !== 'in_progress') {
            return response()->json([
                'message' => 'Quest must be in progress to be cancelled',
            ], 400);
        }

        // Reset the quest to created status
        DB::table('posts')
            ->where('post_id', $postId)
            ->update([
                'accepted_user_id' => null,
                'status' => 'created',
                'updated_at' => now(),
            ]);

        return response()->json([
            'message' => 'Quest cancelled successfully',
            'quest' => [
                'post_id' => $post->post_id,
                'status' => 'created',
            ],
        ]);
    }

    /**
     * Complete a quest (post)
     * - Only the quest creator can mark it as completed
     * - Awards XP to the user who accepted the quest
     * - Status changes to 'completed'
     */
    public function completeQuest(Request $request, $postId)
    {
        $userId = $request->user()->user_id;

        // Get the post
        $post = DB::table('posts')
            ->where('post_id', $postId)
            ->first();

        if (!$post) {
            return response()->json([
                'message' => 'Quest not found',
            ], 404);
        }

        // Check if user is the creator
        if ($post->author_user_id !== $userId) {
            return response()->json([
                'message' => 'Only the quest creator can mark it as completed',
            ], 403);
        }

        // Check if quest is in progress
        if ($post->status !== 'in_progress') {
            return response()->json([
                'message' => 'Quest must be in progress to be completed',
            ], 400);
        }

        // Check if someone accepted the quest
        if ($post->accepted_user_id === null) {
            return response()->json([
                'message' => 'No one has accepted this quest yet',
            ], 400);
        }

        // Update quest status to completed
        DB::table('posts')
            ->where('post_id', $postId)
            ->update([
                'status' => 'completed',
                'updated_at' => now(),
            ]);

        // Award XP to the user who accepted the quest
        DB::table('users')
            ->where('user_id', $post->accepted_user_id)
            ->increment('xp_balance', $post->bounty_points);

        // Get the updated XP balance for response
        $acceptedUser = DB::table('users')
            ->where('user_id', $post->accepted_user_id)
            ->select('xp_balance', 'name')
            ->first();

        return response()->json([
            'message' => 'Quest completed successfully',
            'quest' => [
                'post_id' => $post->post_id,
                'status' => 'completed',
                'bounty_points' => $post->bounty_points,
            ],
            'awarded_to' => [
                'user_id' => $post->accepted_user_id,
                'name' => $acceptedUser->name,
                'new_xp_balance' => $acceptedUser->xp_balance,
            ],
        ]);
    }

    /**
     * Delete a quest (post) - soft delete by changing status to 'deleted'
     * - Only the quest creator can delete it
     * - Cannot delete quests that are in progress or completed
     */
    public function deleteQuest(Request $request, $postId)
    {
        $userId = $request->user()->user_id;

        // Get the post
        $post = DB::table('posts')
            ->where('post_id', $postId)
            ->first();

        if (!$post) {
            return response()->json([
                'message' => 'Quest not found',
            ], 404);
        }

        // Check if user is the creator
        if ($post->author_user_id !== $userId) {
            return response()->json([
                'message' => 'Only the quest creator can delete it',
            ], 403);
        }

        // Check if quest can be deleted (only if status is 'created')
        if ($post->status !== 'created') {
            return response()->json([
                'message' => 'Cannot delete a quest that has been accepted or completed',
            ], 400);
        }

        // Soft delete by updating status to 'deleted'
        DB::table('posts')
            ->where('post_id', $postId)
            ->update([
                'status' => 'deleted',
                'updated_at' => now(),
            ]);

        return response()->json([
            'message' => 'Quest deleted successfully',
        ]);
    }
}

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
                'posts.created_at',
                'posts.updated_at',
                'author.name as author_name',
                'author.avatar as author_avatar',
                'accepter.user_id as accepter_user_id',
                'accepter.name as accepter_name',
                'accepter.avatar as accepter_avatar'
            )
            ->whereIn('posts.status', ['created', 'in_progress', 'completed'])
            ->orderBy('posts.created_at', 'desc')
            ->get();

        // Format the response to match frontend expectations
        $formattedPosts = $posts->map(function ($post) {
            return [
                'post_id' => $post->post_id,
                'author_user_id' => $post->author_user_id,
                'accepted_user_id' => $post->accepted_user_id ?? null,
                'title' => $post->title,
                'body' => $post->body,
                'type' => $post->type,
                'status' => $post->status,
                'bounty_points' => $post->bounty_points,
                'created_at' => $post->created_at,
                'updated_at' => $post->updated_at,
                    'author' => [
                    'name' => $post->author_name,
                    'avatar_url' => $post->author_avatar ? asset('storage/' . $post->author_avatar) : null,
                ],
                'accepter' => $post->accepter_user_id ? [
                    'user_id' => $post->accepter_user_id,
                    'name' => $post->accepter_name,
                    'avatar_url' => $post->accepter_avatar ? asset('storage/' . $post->accepter_avatar) : null,
                ] : null,
            ];
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
        ]);

        // Check if user has enough XP
        $user = DB::table('users')
            ->where('user_id', $request->user()->user_id)
            ->select('xp_balance')
            ->first();

        if ($user->xp_balance < $validated['bounty_points']) {
            return response()->json([
                'message' => 'Insufficient XP balance',
                'current_balance' => $user->xp_balance,
                'required' => $validated['bounty_points']
            ], 400);
        }

        // Deduct XP from user's balance
        DB::table('users')
            ->where('user_id', $request->user()->user_id)
            ->decrement('xp_balance', $validated['bounty_points']);

        $postId = (string) Str::uuid();

        DB::table('posts')->insert([
            'post_id' => $postId,
            'author_user_id' => $request->user()->user_id,
            'title' => trim(strip_tags($validated['title'])),
            'body' => trim(strip_tags($validated['body'])),
            'type' => $validated['type'],
            'status' => 'created',
            'bounty_points' => $validated['bounty_points'],
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
                'posts.created_at',
                'posts.updated_at',
                'users.name as author_name',
                'users.avatar as author_avatar'
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
                'created_at' => $post->created_at,
                'updated_at' => $post->updated_at,
                'author' => [
                    'name' => $post->author_name,
                    'avatar_url' => $post->author_avatar ? asset('storage/' . $post->author_avatar) : null,
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
     * Soft-delete a post. Only the author can delete a post and only when it's still 'created'.
     */
    public function deleteQuest(Request $request, $postId)
    {
        $post = DB::table('posts')->where('post_id', $postId)->first();

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        // Only the author may delete their post
        if ($post->author_user_id !== $request->user()->user_id) {
            return response()->json(['message' => 'Only the quest creator can delete this post'], 403);
        }

        // Only allow deleting posts that haven't been accepted or completed
        if ($post->status !== 'created') {
            return response()->json(['message' => 'Cannot delete a quest that has been accepted or completed'], 400);
        }

        $updated = DB::table('posts')
            ->where('post_id', $postId)
            ->update([
                'status' => 'deleted',
                'updated_at' => now(),
            ]);

        if (!$updated) {
            return response()->json(['message' => 'Failed to delete post'], 500);
        }

        return response()->json(['message' => 'Post deleted successfully']);
    }

    /**
     * Accept a quest (mark in_progress and set accepter)
     */
    public function acceptQuest(Request $request, $postId)
    {
        $post = DB::table('posts')->where('post_id', $postId)->first();

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        if ($post->author_user_id === $request->user()->user_id) {
            return response()->json(['message' => 'You cannot accept your own quest'], 400);
        }

        if ($post->status !== 'created' || $post->accepted_user_id) {
            return response()->json(['message' => 'Quest is not available to accept'], 400);
        }

        DB::table('posts')
            ->where('post_id', $postId)
            ->update([
                'accepted_user_id' => $request->user()->user_id,
                'status' => 'in_progress',
                'updated_at' => now(),
            ]);

        $postRow = DB::table('posts')
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
                'posts.created_at',
                'posts.updated_at',
                'author.name as author_name',
                'author.avatar as author_avatar',
                'accepter.user_id as accepter_user_id',
                'accepter.name as accepter_name',
                'accepter.avatar as accepter_avatar'
            )
            ->where('posts.post_id', $postId)
            ->first();

        $formatted = [
            'post_id' => $postRow->post_id,
            'author_user_id' => $postRow->author_user_id,
            'accepted_user_id' => $postRow->accepted_user_id ?? null,
            'title' => $postRow->title,
            'body' => $postRow->body,
            'type' => $postRow->type,
            'status' => $postRow->status,
            'bounty_points' => $postRow->bounty_points,
            'created_at' => $postRow->created_at,
            'updated_at' => $postRow->updated_at,
            'author' => [
                'name' => $postRow->author_name,
                'avatar_url' => $postRow->author_avatar ? asset('storage/' . $postRow->author_avatar) : null,
            ],
            'accepter' => $postRow->accepter_user_id ? [
                'user_id' => $postRow->accepter_user_id,
                'name' => $postRow->accepter_name,
                'avatar_url' => $postRow->accepter_avatar ? asset('storage/' . $postRow->accepter_avatar) : null,
            ] : null,
        ];

        return response()->json([
            'message' => 'Quest accepted',
            'post' => $formatted,
        ]);
    }

    /**
     * Cancel (un-accept) a quest. Only the accepter may cancel.
     */
    public function cancelQuest(Request $request, $postId)
    {
        $post = DB::table('posts')->where('post_id', $postId)->first();

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        if ($post->accepted_user_id !== $request->user()->user_id) {
            return response()->json(['message' => 'Only the accepter may cancel this quest'], 403);
        }

        if ($post->status !== 'in_progress') {
            return response()->json(['message' => 'Quest is not in progress'], 400);
        }

        DB::table('posts')
            ->where('post_id', $postId)
            ->update([
                'accepted_user_id' => null,
                'status' => 'created',
                'updated_at' => now(),
            ]);

        $postRow = DB::table('posts')
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
                'posts.created_at',
                'posts.updated_at',
                'author.name as author_name',
                'author.avatar as author_avatar',
                'accepter.user_id as accepter_user_id',
                'accepter.name as accepter_name',
                'accepter.avatar as accepter_avatar'
            )
            ->where('posts.post_id', $postId)
            ->first();

        $formatted = [
            'post_id' => $postRow->post_id,
            'author_user_id' => $postRow->author_user_id,
            'accepted_user_id' => $postRow->accepted_user_id ?? null,
            'title' => $postRow->title,
            'body' => $postRow->body,
            'type' => $postRow->type,
            'status' => $postRow->status,
            'bounty_points' => $postRow->bounty_points,
            'created_at' => $postRow->created_at,
            'updated_at' => $postRow->updated_at,
            'author' => [
                'name' => $postRow->author_name,
                'avatar_url' => $postRow->author_avatar ? asset('storage/' . $postRow->author_avatar) : null,
            ],
            'accepter' => $postRow->accepter_user_id ? [
                'user_id' => $postRow->accepter_user_id,
                'name' => $postRow->accepter_name,
                'avatar_url' => $postRow->accepter_avatar ? asset('storage/' . $postRow->accepter_avatar) : null,
            ] : null,
        ];

        return response()->json(['message' => 'Quest unaccepted', 'post' => $formatted]);
    }

    /**
     * Complete a quest (creator only) and award bounty to accepter
     */
    public function completeQuest(Request $request, $postId)
    {
        $post = DB::table('posts')->where('post_id', $postId)->first();

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        if ($post->author_user_id !== $request->user()->user_id) {
            return response()->json(['message' => 'Only the quest creator can complete this quest'], 403);
        }

        if ($post->status !== 'in_progress' || !$post->accepted_user_id) {
            return response()->json(['message' => 'Quest is not in progress or has no accepter'], 400);
        }

        // Award bounty to accepter
        DB::table('users')
            ->where('user_id', $post->accepted_user_id)
            ->increment('xp_balance', $post->bounty_points);

        DB::table('posts')
            ->where('post_id', $postId)
            ->update([
                'status' => 'completed',
                'updated_at' => now(),
            ]);

        $awardedToRow = DB::table('users')
            ->where('user_id', $post->accepted_user_id)
            ->select('user_id', 'name', 'xp_balance', 'avatar')
            ->first();

        $awardedTo = $awardedToRow ? [
            'user_id' => $awardedToRow->user_id,
            'name' => $awardedToRow->name,
            'xp_balance' => $awardedToRow->xp_balance,
            'avatar_url' => $awardedToRow->avatar ? asset('storage/' . $awardedToRow->avatar) : null,
        ] : null;

        $postRow = DB::table('posts')
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
                'posts.created_at',
                'posts.updated_at',
                'author.name as author_name',
                'author.avatar as author_avatar',
                'accepter.user_id as accepter_user_id',
                'accepter.name as accepter_name',
                'accepter.avatar_url as accepter_avatar'
            )
            ->where('posts.post_id', $postId)
            ->first();

        $formatted = [
            'post_id' => $postRow->post_id,
            'author_user_id' => $postRow->author_user_id,
            'accepted_user_id' => $postRow->accepted_user_id ?? null,
            'title' => $postRow->title,
            'body' => $postRow->body,
            'type' => $postRow->type,
            'status' => $postRow->status,
            'bounty_points' => $postRow->bounty_points,
            'created_at' => $postRow->created_at,
            'updated_at' => $postRow->updated_at,
            'author' => [
                'name' => $postRow->author_name,
                'avatar_url' => $postRow->author_avatar ? asset('storage/' . $postRow->author_avatar) : null,
            ],
            'accepter' => $postRow->accepter_user_id ? [
                'user_id' => $postRow->accepter_user_id,
                'name' => $postRow->accepter_name,
                'avatar_url' => $postRow->accepter_avatar ? asset('storage/' . $postRow->accepter_avatar) : null,
            ] : null,
        ];

        return response()->json([
            'message' => 'Quest completed',
            'awarded_to' => $awardedTo,
            'post' => $formatted,
        ]);
    }
}

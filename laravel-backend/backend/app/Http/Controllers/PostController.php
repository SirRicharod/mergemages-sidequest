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
            ->leftJoin('users', 'posts.author_user_id', '=', 'users.user_id')
            ->select(
                'posts.post_id',
                'posts.author_user_id',
                'posts.title',
                'posts.body',                'posts.type',                'posts.status',
                'posts.bounty_points',
                'posts.created_at',
                'posts.updated_at',
                'users.name as author_name',
                'users.avatar_url as author_avatar'
            )
            ->whereIn('posts.status', ['created', 'in_progress', 'completed'])
            ->orderBy('posts.created_at', 'desc')
            ->get();

        // Format the response to match frontend expectations
        $formattedPosts = $posts->map(function ($post) {
            return [
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
                    'avatar_url' => $post->author_avatar,
                ],
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
                'users.avatar_url as author_avatar'
            )
            ->where('posts.post_id', $postId)
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
                    'avatar_url' => $post->author_avatar,
                ],
            ],
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
}

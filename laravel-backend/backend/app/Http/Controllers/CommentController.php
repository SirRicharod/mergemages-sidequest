<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comment;

class CommentController extends Controller
{
    // 1. Haal alle comments op voor een specifieke post
    public function index($postId)
    {
        $comments = Comment::where('post_id', $postId)
            ->with('user') // Haal direct de gegevens van de schrijver erbij
            ->orderBy('created_at', 'asc') // Oudste eerst
            ->get();

        // Zorg dat de avatar-linkjes werken
        $comments->transform(function ($comment) {
            if ($comment->user) {
                $comment->user->avatar_url = $comment->user->avatar 
                    ? asset('storage/' . $comment->user->avatar) 
                    : null;
            }
            return $comment;
        });

        return response()->json($comments);
    }

    // 2. Plaats een nieuwe comment
    public function store(Request $request, $postId)
    {
        // Validatie: er moet wel tekst zijn
        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        // Maak de comment aan
        $comment = Comment::create([
            'post_id' => $postId,
            'user_id' => $request->user()->user_id,
            'content' => $request->content,
        ]);

        // Haal de user-info erbij om terug te sturen naar de frontend
        $comment->load('user');
        
        if ($comment->user) {
            $comment->user->avatar_url = $comment->user->avatar 
                ? asset('storage/' . $comment->user->avatar) 
                : null;
        }

        return response()->json($comment, 201);
    }
}
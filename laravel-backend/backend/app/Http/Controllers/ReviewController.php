<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    // 1. NIEUW: Haal alle reviews op (Lost de 'undefined method index' fout op)
    public function index()
    {
        $reviews = Review::orderBy('created_at', 'desc')->get();
        return response()->json($reviews);
    }

    // 2. HERSTELD: Reviews voor de ingelogde gebruiker (Voor het profiel)
    public function userReviews(Request $request)
    {
        $reviews = Review::where('target_user_id', Auth::id())
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json($reviews);
    }

    // 3. BESTAAND: Opslaan van een review
    public function store(Request $request)
    {
        // Validatie
        $validated = $request->validate([
            'target_user_id' => 'required|exists:users,user_id', // UUID check
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        // Review aanmaken
        $review = Review::create([
            'reviewer_id' => Auth::id(), // Pakt automatisch jouw UUID
            'target_user_id' => $validated['target_user_id'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return response()->json([
            'message' => 'Review succesvol geplaatst!',
            'review' => $review
        ], 201);
    }
}
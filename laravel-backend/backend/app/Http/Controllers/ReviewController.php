<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    // 1. Alle reviews ophalen (voor de algemene Feed)
    public function index()
    {
        $reviews = Review::orderBy('created_at', 'desc')->get();
        return response()->json($reviews);
    }

    // 2. Reviews voor de ingelogde gebruiker (Mijn Profiel)
    public function userReviews(Request $request)
    {
        $reviews = Review::where('target_user_id', Auth::id())
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json($reviews);
    }

    // 3. 👇 NIEUW: Reviews ophalen van een SPECIFIEKE gebruiker (Ander Profiel)
    public function show($id)
    {
        // Zoek reviews waar 'target_user_id' gelijk is aan het ID uit de URL
        $reviews = Review::where('target_user_id', $id)
                        ->orderBy('created_at', 'desc')
                        ->get();

        return response()->json($reviews);
    }

    // 4. Een nieuwe review opslaan
    public function store(Request $request)
    {
        // Validatie
        $validated = $request->validate([
            'target_user_id' => 'required|exists:users,user_id', // Check of gebruiker bestaat
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        // Review aanmaken
        $review = Review::create([
            'reviewer_id' => Auth::id(), // Jij bent de schrijver
            'target_user_id' => $validated['target_user_id'], // De ander is de ontvanger
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
        ]);

        return response()->json([
            'message' => 'Review succesvol geplaatst!',
            'review' => $review
        ], 201);
    }
}
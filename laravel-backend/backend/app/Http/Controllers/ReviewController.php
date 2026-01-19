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
        $reviews = Review::with('reviewer')->orderBy('created_at', 'desc')->get();
        
        // Transform avatar paths to full URLs
        $reviews->transform(function($review) {
            if ($review->reviewer) {
                $review->reviewer->avatar_url = $review->reviewer->avatar 
                    ? asset('storage/' . $review->reviewer->avatar) 
                    : null;
            }
            return $review;
        });
        
        return response()->json($reviews);
    }

    // 2. Reviews voor de ingelogde gebruiker (Mijn Profiel)
    public function userReviews(Request $request)
    {
        $reviews = Review::with('reviewer')
                        ->where('target_user_id', Auth::id())
                        ->orderBy('created_at', 'desc')
                        ->get();

        // Transform avatar paths to full URLs
        $reviews->transform(function($review) {
            if ($review->reviewer) {
                $review->reviewer->avatar_url = $review->reviewer->avatar 
                    ? asset('storage/' . $review->reviewer->avatar) 
                    : null;
            }
            return $review;
        });

        return response()->json($reviews);
    }

    // 3. 👇 NIEUW: Reviews ophalen van een SPECIFIEKE gebruiker (Ander Profiel)
    public function show($id)
    {
        // Zoek reviews waar 'target_user_id' gelijk is aan het ID uit de URL
        $reviews = Review::with('reviewer')
                        ->where('target_user_id', $id)
                        ->orderBy('created_at', 'desc')
                        ->get();

        // Transform avatar paths to full URLs
        $reviews->transform(function($review) {
            if ($review->reviewer) {
                $review->reviewer->avatar_url = $review->reviewer->avatar 
                    ? asset('storage/' . $review->reviewer->avatar) 
                    : null;
            }
            return $review;
        });

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
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // Nodig voor het opslaan van bestanden
use App\Models\User; // Nodig om de gebruiker te vinden

class UserController extends Controller
{
    /**
     * Upload en update de avatar van de gebruiker.
     */
    public function uploadAvatar(Request $request)
    {
        // 1. Validatie: is het wel een plaatje?
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
        ]);

        // 2. Haal de gebruiker op (voor nu de eerste, later de ingelogde user)
        $user = User::first(); 

        // 3. Sla het bestand op
        if ($request->file('avatar')) {
            // Oude foto verwijderen als die er is (houdt de map schoon)
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Opslaan in de map 'avatars' en pad onthouden
            $path = $request->file('avatar')->store('avatars', 'public');
            
            // 4. Update de database
            $user->avatar = $path;
            $user->save();

            return response()->json([
                'message' => 'Avatar succesvol geüpload!',
                'avatar_url' => asset('storage/' . $path)
            ]);
        }

        return response()->json(['message' => 'Geen bestand ontvangen'], 400);
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
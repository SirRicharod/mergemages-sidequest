<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Upload en update de avatar van de gebruiker.
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = $request->user(); 

        if ($request->file('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $path = $request->file('avatar')->store('avatars', 'public');
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
     * NIEUW: Zoek gebruikers op naam voor de search button.
     */
    /* Search functionality removed — feature deprecated */

    /**
     * Haal een specifiek profiel op via user_id.
     */
    public function show(string $id)
{
    // We gebruiken 'with' om de reviews én de gegevens van de schrijver (reviewer) op te halen
    $user = User::with(['reviews.reviewer']) 
        ->where('user_id', $id)
        ->firstOrFail();

    // Maak de avatar URL compleet
    $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;
    
    // Remove the internal avatar path from response
    $userData = $user->toArray();
    unset($userData['avatar']);

    // We sturen de gebruiker terug, Laravel plakt de reviews er automatisch bij in het JSON-object
    return response()->json($userData);
}
}
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
        // 1. Validatie
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
        ]);

        // 2. Haal de INGELOGDE gebruiker op (Dit is veiliger dan User::first())
        $user = $request->user(); 

        // 3. Sla het bestand op
        if ($request->file('avatar')) {
            // Oude foto verwijderen als die er is
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Opslaan in de map 'avatars'
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
     * Haal een specifiek profiel op via ID (voor openbare profielen)
     */
    public function show(string $id)
    {
        // 1. Zoek de gebruiker (of geef 404 error als hij niet bestaat)
        $user = User::findOrFail($id);

        // 2. Maak de avatar URL compleet
        $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;

        // 3. Stuur terug
        return response()->json($user);
    }

    // ... De overige lege functies (index, store, update, destroy) mag je laten staan of weghalen ...
    public function index() {}
    public function store(Request $request) {}
    public function update(Request $request, string $id) {}
    public function destroy(string $id) {}
}
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
    public function search(Request $request)
    {
        $query = $request->query('query');
        
        // We zoeken in de bestaande users tabel op naam
        $users = User::where('name', 'LIKE', "%{$query}%")
            ->select('user_id', 'name', 'avatar') // Alleen de nodige info voor de zoeklijst
            ->limit(5)
            ->get();

        // Voeg voor elk resultaat de volledige avatar URL toe
        $users->transform(function($user) {
            $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;
            return $user;
        });

        return response()->json($users);
    }

    /**
     * Haal een specifiek profiel op via user_id.
     */
    public function show(string $id)
    {
        // We zoeken specifiek op 'user_id' omdat jouw database UUIDs gebruikt
        $user = User::where('user_id', $id)->firstOrFail();

        // Maak de avatar URL compleet
        $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;

        return response()->json($user);
    }

    public function index() {}
    public function store(Request $request) {}
    public function update(Request $request, string $id) {}
    public function destroy(string $id) {}
}
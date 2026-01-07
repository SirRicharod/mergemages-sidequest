<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| API Routes - Educational Demo
|--------------------------------------------------------------------------
|
| No controllers here! Everything is explicit so you can see
| exactly what's happening. Perfect for learning! 📚
|
*/

// ==========================================
// PUBLIC ROUTES (anyone can access these)
// ==========================================

/**
 * GET /api/users
 * Get all users (public endpoint)
 */
Route::get('/users', function () {
    $users = User::select('user_id', 'name', 'email', 'bio', 'avatar_url', 'birth_date', 'created_at')->get();

    return response()->json([
        'users' => $users,
    ]);
});

/**
 * POST /api/register
 * Create a new user account
 */
Route::post('/register', function (Request $request) {
    // Step 1: Validate the incoming data
    $validated = $request->validate([
        'name' => 'required|string|max:120|regex:/^[\p{L}\s.\-\']+$/u',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
    ]);

    // Step 2: Sanitize inputs
    $sanitizedName = trim(strip_tags($validated['name']));
    $sanitizedEmail = trim(strtolower($validated['email']));

    // Step 3: Create the user (password is automatically hashed!)
    $user = User::create([
        'name' => $sanitizedName,
        'email' => $sanitizedEmail,
        'password_hash' => Hash::make($validated['password']),
    ]);

    // Step 3: Return a nice JSON response
    return response()->json([
        'message' => 'User registered successfully',
        'user' => [
            'id' => $user->user_id,
            'name' => $user->name,
            'email' => $user->email,
        ],
    ], 201);  // 201 = "Created" status code
});

/**
 * POST /api/login
 * Authenticate and get a token
 */
Route::post('/login', function (Request $request) {
    // Step 1: Validate
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    // Step 2: Sanitize email input
    $sanitizedEmail = trim(strtolower($validated['email']));

    // Step 3: Find the user
    $user = User::where('email', $sanitizedEmail)->first();

    // Step 3: Check credentials
    if (!$user || !Hash::check($validated['password'], $user->password_hash)) {
        return response()->json([
            'message' => 'Invalid credentials',
        ], 401);  // 401 = "Unauthorized"
    }

    // Step 4: Create a token! 🎫
    // This is the magic line - Sanctum creates a token for this user
    $token = $user->createToken('auth_token')->plainTextToken;

    // Step 5: Send it back
    return response()->json([
        'message' => 'Login successful',
        'token' => $token,  // 👈 The frontend will save this
        'user' => [
            'id' => $user->user_id,
            'name' => $user->name,
            'email' => $user->email,
        ],
    ]);
});

// ==========================================
// PROTECTED ROUTES (token required! 🔒)
// ==========================================

Route::middleware('auth:sanctum')->group(function () {

    /**
     * POST /api/logout
     * Invalidate the current token
     */
    Route::post('/logout', function (Request $request) {
        // Delete the token that was used for this request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    });

    /**
     * GET /api/profile
     * Get current authenticated user profile
     */
    Route::get('/profile', function (Request $request) {
        return response()->json([
            'user' => $request->user(),
        ]);
    });
});
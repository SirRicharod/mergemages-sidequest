<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController; 

/*
|--------------------------------------------------------------------------
| API Routes - Educational Demo
|--------------------------------------------------------------------------
*/

// ==========================================
// PUBLIC ROUTES (anyone can access these)
// ==========================================

/**
 * GET /api/posts
 * Get all posts (excluding deleted)
 */
Route::get('/posts', [PostController::class, 'index']);

/**
 * GET /api/users
 * Get all users (public endpoint)
 */
Route::get('/users', function () {
    $users = User::select('user_id as id', 'name', 'email', 'bio', 'avatar_url', 'birth_date', 'created_at')->get();

    return response()->json([
        'users' => $users,
    ]);
});

/**
 * POST /api/register
 * Create a new user account
 */
Route::post('/register', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:120',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
    ]);

    $sanitizedName = trim(strip_tags($validated['name']));
    $sanitizedEmail = trim(strtolower($validated['email']));

    $user = User::create([
        'name' => $sanitizedName,
        'email' => $sanitizedEmail,
        'password_hash' => Hash::make($validated['password']),
    ]);

    return response()->json([
        'message' => 'User registered successfully',
        'user' => $user,
    ], 201); 
});

/**
 * POST /api/login
 * Authenticate and get a token
 */
Route::post('/login', function (Request $request) {
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $sanitizedEmail = trim(strtolower($validated['email']));
    $user = User::where('email', $sanitizedEmail)->first();

    if (!$user || !Hash::check($validated['password'], $user->password_hash)) {
        return response()->json([
            'message' => 'Invalid credentials',
        ], 401); 
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'token' => $token, 
        'user' => $user,
    ]);
});

// ==========================================
// PROTECTED ROUTES (token required! 🔒)
// ==========================================

Route::middleware('auth:sanctum')->group(function () {

    /**
     * GET /api/reviews
     * Haal alle reviews op (voor de Feed)
     */
    Route::get('/reviews', [ReviewController::class, 'index']); 

    /**
     * GET /api/user/reviews
     * Haal reviews voor de ingelogde gebruiker op (voor Profiel)
     */
    Route::get('/user/reviews', [ReviewController::class, 'userReviews']);

    /**
     * POST /api/posts
     * Create a new post
     */
    Route::post('/posts', [PostController::class, 'store']);

    /**
     * PATCH /api/posts/{postId}/status
     * Update post status
     */
    Route::patch('/posts/{postId}/status', [PostController::class, 'updateStatus']);

    /**
     * POST /api/reviews
     * Plaats een nieuwe review
     */
    Route::post('/reviews', [ReviewController::class, 'store']); 

    /**
     * POST /api/user/avatar
     * Upload een profielfoto
     */
    Route::post('/user/avatar', [UserController::class, 'uploadAvatar']);

    /**
     * POST /api/logout
     */
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    });

    /**
     * GET /api/profile
     * Haalt de ingelogde gebruiker op EN maakt de avatar link compleet
     */
    Route::get('/profile', function (Request $request) {
        $user = $request->user();
        
        // Maak volledige URL van avatar
        $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;
        
        return response()->json(['user' => $user]);
    });
});
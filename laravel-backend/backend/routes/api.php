<?php
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
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

Route::get('/posts', [PostController::class, 'index']);

Route::get('/users', function () {
    $users = User::select('user_id as id', 'name', 'email', 'bio', 'avatar', 'birth_date', 'created_at')->get();
    
    // Transform avatar paths to full URLs
    $users->transform(function($user) {
        $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;
        unset($user->avatar); // Remove the internal path from response
        return $user;
    });
    
    return response()->json(['users' => $users]);
});

Route::post('/register', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:120',
        'email' => 'required|string|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
    ]);

    $sanitizedName = trim(strip_tags($validated['name']));
    $sanitizedEmail = trim(strtolower($validated['email']));

    if (!filter_var($sanitizedEmail, FILTER_VALIDATE_EMAIL)) {
        return response()->json(['message' => 'Invalid email format'], 422);
    }

    $user = User::create([
        'name' => $sanitizedName,
        'email' => $sanitizedEmail,
        'password_hash' => Hash::make($validated['password']),
    ]);

    return response()->json([
        'message' => 'User registered successfully',
        'user' => [
            'user_id' => $user->user_id,
            'name' => $user->name,
            'email' => $user->email,
            'xp_balance' => $user->xp_balance,
        ],
    ], 201); 
});

Route::post('/login', function (Request $request) {
    $validated = $request->validate([
        'email' => 'required|string',
        'password' => 'required',
    ]);

    $sanitizedEmail = trim(strtolower($validated['email']));

    if (!filter_var($sanitizedEmail, FILTER_VALIDATE_EMAIL)) {
        return response()->json(['message' => 'Invalid email format'], 422);
    }

    $user = User::where('email', $sanitizedEmail)->first();

    if (!$user || !Hash::check($validated['password'], $user->password_hash)) {
        return response()->json(['message' => 'Invalid credentials'], 401); 
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Login successful',
        'token' => $token, 
        'user' => [
            'user_id' => $user->user_id,
            'name' => $user->name,
            'email' => $user->email,
            'xp_balance' => $user->xp_balance,
        ],
    ]);
});

// ==========================================
// PROTECTED ROUTES (token required! 🔒)
// ==========================================
// ==========================================
// PROTECTED ROUTES (token required! 🔒)
// ==========================================

Route::middleware('auth:sanctum')->group(function () {

    // --- POSTS ---
    Route::post('/posts', [PostController::class, 'store']);
    Route::patch('/posts/{postId}/status', [PostController::class, 'updateStatus']);
    Route::post('/posts/{postId}/accept', [PostController::class, 'acceptQuest']);
    Route::post('/posts/{postId}/cancel', [PostController::class, 'cancelQuest']);
    Route::post('/posts/{postId}/complete', [PostController::class, 'completeQuest']);
    Route::delete('/posts/{postId}', [PostController::class, 'deleteQuest']);

    // --- USERS & PROFIEL ---
    Route::post('/user/avatar', [UserController::class, 'uploadAvatar']);
    Route::get('/users/{id}', [UserController::class, 'show']);

    // --- LOGOUT ---
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }); // <--- DEZE HAAKJES SLUITEN DE LOGOUT FUNCTIE AF

    // --- PROFILE ---
    Route::get('/profile', function (Request $request) {
        $user = $request->user();
        $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;
        
        return response()->json([
            'user' => [
                'user_id' => $user->user_id,
                'name' => $user->name,
                'email' => $user->email,
                'xp_balance' => $user->xp_balance,
                'avatar_url' => $user->avatar_url,
            ]
        ]);
    });
});
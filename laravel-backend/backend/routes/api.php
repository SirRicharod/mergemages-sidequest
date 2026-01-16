<?php
use App\Http\Controllers\CommentController;
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

Route::get('/posts', [PostController::class, 'index']);

Route::get('/users', function () {
    $users = User::select('user_id as id', 'name', 'email', 'bio', 'avatar_url', 'birth_date', 'created_at')->get();
    return response()->json(['users' => $users]);
});

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
        'user' => [
            'user_id' => $user->user_id,
            'name' => $user->name,
            'email' => $user->email,
            'xp_balance' => $user->xp_balance,
            'weekly_xp_allowance' => $user->weekly_xp_allowance,
        ],
    ], 201); 
});

Route::post('/login', function (Request $request) {
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    $sanitizedEmail = trim(strtolower($validated['email']));
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
            'weekly_xp_allowance' => $user->weekly_xp_allowance,
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

    // --- REVIEWS ---
    Route::get('/reviews', [ReviewController::class, 'index']); 
    Route::get('/user/reviews', [ReviewController::class, 'userReviews']);
    Route::get('/reviews/{id}', [ReviewController::class, 'show']);
    Route::post('/reviews', [ReviewController::class, 'store']); 

    // --- POSTS ---
    Route::post('/posts', [PostController::class, 'store']);
    Route::patch('/posts/{postId}/status', [PostController::class, 'updateStatus']);
    Route::post('/posts/{postId}/accept', [PostController::class, 'acceptQuest']);
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

    // --- COMMENTS ROUTES (Nu staan ze op de juiste plek!) ---
    Route::get('/posts/{postId}/comments', [CommentController::class, 'index']);
    Route::post('/posts/{postId}/comments', [CommentController::class, 'store']);

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
                'weekly_xp_allowance' => $user->weekly_xp_allowance,
                'avatar_url' => $user->avatar_url,
            ]
        ]);
    });
});
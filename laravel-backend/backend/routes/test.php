<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/test-schema', function () {
    $userColumns = DB::select('DESCRIBE users');
    $tokenColumns = DB::select('DESCRIBE personal_access_tokens');
    
    return response()->json([
        'users' => $userColumns,
        'personal_access_tokens' => $tokenColumns
    ]);
});

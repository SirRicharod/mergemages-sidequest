<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$users = DB::table('users')->whereNotNull('avatar')->get(['name', 'email', 'avatar']);

foreach($users as $user) {
    echo $user->name . " (" . $user->email . "): " . $user->avatar . "\n";
    $fullPath = __DIR__ . '/storage/app/public/' . $user->avatar;
    echo "  File exists: " . (file_exists($fullPath) ? "YES" : "NO") . "\n\n";
}

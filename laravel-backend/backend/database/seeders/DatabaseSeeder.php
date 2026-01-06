<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create a test user with known credentials
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            // Password will be 'password' (Laravel's default factory)
        ]);

        // Create 10 random users for fun
        User::factory(10)->create();
    }
}
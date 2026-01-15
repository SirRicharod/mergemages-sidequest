<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quest_assignments', function (Blueprint $table) {
            $table->id();
            // Users FK (users.user_id is your PK)
            $table->unsignedBigInteger('user_id');
            // Posts PK is a UUID string (posts.post_id)
            $table->string('post_id');
            $table->timestamps();

            // Prevent duplicate assignments
            $table->unique(['user_id', 'post_id']);

            // Foreign key to users
            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->cascadeOnDelete();

            // Optional: index for faster queries
            $table->index('user_id');
            $table->index('post_id');

            // Optional: if you want FK-like checks to posts.post_id, you can’t use foreignId for string.
            // If your posts.post_id is a string and supported by your DB engine, you can add a check constraint manually
            // or rely on application-level checks. Most teams keep this as an index only:
            // $table->foreign('post_id')->references('post_id')->on('posts')->cascadeOnDelete();
            // Note: This may fail if posts.post_id is not defined as a key and/or engines differ. Use with caution.
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quest_assignments');
    }
};

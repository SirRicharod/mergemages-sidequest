<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    // This migration creates the 'posts', 'comments', and 'reviews' tables for the application.
    public function up(): void
    // 
    { 
        Schema::create('posts', function (Blueprint $table) {
            $table->uuid('post_id')->primary(); // Unique identifier for each post, using UUID for better scalability and security.
            $table->uuid('author_user_id')->nullable(); // Reference to the user who created the post, allowing null for deleted users.
            $table->uuid('accepted_user_id')->nullable(); // Reference to the user who accepted the post, allowing null for unaccepted posts.
            $table->string('title', 200); // Title of the post, limited to 200 characters for concise display.
            $table->text('body'); // Main content of the post, allowing for longer text.
            $table->enum('type', ['request', 'offer'])->default('request'); // Type of post, either a request for help or an offer to help, defaulting to 'request'.
            $table->enum('status', ['created', 'in_progress', 'completed', 'deleted'])->default('created'); // Status of the post, tracking its lifecycle from creation to completion or deletion, defaulting to 'created'.
            $table->integer('bounty_points')->default(0); // Bounty points associated with the post, defaulting to 0, which can be used as an incentive for users to accept and complete the post.
            $table->boolean('urgent')->default(false); // Flag to indicate if the post is urgent, defaulting to false, which can help users prioritize their responses.
            $table->timestamps(); // Automatically manage created_at and updated_at timestamps for the post.

            $table->foreign('author_user_id')->references('user_id')->on('users')->nullOnDelete();
            $table->foreign('accepted_user_id')->references('user_id')->on('users')->nullOnDelete();
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->uuid('post_id');
            $table->uuid('user_id');
            $table->text('body');
            $table->timestamps();

            $table->foreign('post_id')->references('post_id')->on('posts')->cascadeOnDelete();
            $table->foreign('user_id')->references('user_id')->on('users')->cascadeOnDelete();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('reviewer_id');
            $table->uuid('target_user_id');
            $table->integer('rating');
            $table->text('comment')->nullable();
            $table->timestamps();

            $table->foreign('reviewer_id')->references('user_id')->on('users')->cascadeOnDelete();
            $table->foreign('target_user_id')->references('user_id')->on('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('posts');
    }
};

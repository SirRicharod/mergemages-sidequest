<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->uuid('post_id')->primary();
            $table->uuid('author_user_id')->nullable();
            $table->uuid('accepted_user_id')->nullable();
            $table->string('title', 200);
            $table->text('body');
            $table->enum('type', ['request', 'offer'])->default('request');
            $table->enum('status', ['created', 'in_progress', 'completed', 'deleted'])->default('created');
            $table->integer('bounty_points')->default(0);
            $table->boolean('urgent')->default(false);
            $table->timestamps();

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

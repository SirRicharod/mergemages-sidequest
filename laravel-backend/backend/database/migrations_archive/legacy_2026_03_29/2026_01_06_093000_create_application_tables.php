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
        // Disable foreign key constraints temporarily
        Schema::disableForeignKeyConstraints();

        // Drop existing users table if it exists
        Schema::dropIfExists('users');

        // Re-enable foreign key constraints
        Schema::enableForeignKeyConstraints();

        // Users table
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('user_id')->primary();
            $table->string('name', 120);
            $table->date('birth_date')->nullable();
            $table->string('email')->unique();
            $table->text('password_hash');
            $table->text('bio')->nullable();
            $table->text('avatar_url')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });

        // Posts table
        Schema::create('posts', function (Blueprint $table) {
            $table->uuid('post_id')->primary();
            $table->uuid('author_user_id')->nullable();
            $table->string('title', 200);
            $table->text('body');
            $table->enum('status', ['open', 'resolved'])->default('open');
            $table->integer('bounty_points')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('author_user_id')->references('user_id')->on('users')->onDelete('set null');
        });

        // Comments table
        Schema::create('comments', function (Blueprint $table) {
            $table->uuid('comment_id')->primary();
            $table->uuid('post_id');
            $table->uuid('author_user_id')->nullable();
            $table->text('body');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('post_id')->references('post_id')->on('posts')->onDelete('cascade');
            $table->foreign('author_user_id')->references('user_id')->on('users')->onDelete('set null');
        });

        // Help sessions table
        Schema::create('help_sessions', function (Blueprint $table) {
            $table->uuid('session_id')->primary();
            $table->uuid('requester_user_id')->nullable();
            $table->uuid('helper_user_id')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->integer('duration_min')->nullable();
            $table->text('outcome_summary')->nullable();
            $table->integer('rating')->nullable();

            $table->foreign('requester_user_id')->references('user_id')->on('users')->onDelete('set null');
            $table->foreign('helper_user_id')->references('user_id')->on('users')->onDelete('set null');
        });

        // Points ledger table
        Schema::create('points_ledger', function (Blueprint $table) {
            $table->uuid('ledger_id')->primary();
            $table->uuid('user_id');
            $table->integer('delta_points');
            $table->text('reason');
            $table->uuid('reference_id')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('points_ledger');
        Schema::dropIfExists('help_sessions');
        Schema::dropIfExists('comments');
        Schema::dropIfExists('posts');
        Schema::dropIfExists('users');
    }
};

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
        Schema::create('reviews', function (Blueprint $table) {
            // We gebruiken hier ook UUID als primary key, voor consistentie
            $table->uuid('id')->primary();
            
            // 1. De kolommen moeten UUID zijn (want jouw users tabel is dat ook)
            $table->uuid('reviewer_id');
            $table->uuid('target_user_id');
            
            // 2. De inhoud
            $table->integer('rating');
            $table->text('comment')->nullable();
            $table->timestamps();

            // 3. De koppelingen (Let op: references 'user_id' ipv 'id')
            $table->foreign('reviewer_id')->references('user_id')->on('users')->onDelete('cascade');
            $table->foreign('target_user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
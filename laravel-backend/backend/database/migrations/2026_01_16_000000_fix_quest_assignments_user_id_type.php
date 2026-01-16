<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Drop the old quest_assignments table and recreate with correct types
        Schema::disableForeignKeyConstraints();
        Schema::dropIfExists('quest_assignments');
        Schema::enableForeignKeyConstraints();

        // Recreate with UUID user_id
        Schema::create('quest_assignments', function (Blueprint $table) {
            $table->id();
            // Users FK (users.user_id is a UUID)
            $table->uuid('user_id');
            // Posts PK is a UUID (posts.post_id)
            $table->uuid('post_id');
            $table->timestamps();

            // Prevent duplicate assignments
            $table->unique(['user_id', 'post_id']);

            // Foreign keys
            $table->foreign('user_id')
                ->references('user_id')
                ->on('users')
                ->cascadeOnDelete();

            // Indices
            $table->index('user_id');
            $table->index('post_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quest_assignments');
    }
};

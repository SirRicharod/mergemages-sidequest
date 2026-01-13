<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update the status column to use the new enum values
        DB::statement("ALTER TABLE posts MODIFY COLUMN status ENUM('created', 'in_progress', 'completed', 'deleted') NOT NULL DEFAULT 'created'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert to the old enum values
        DB::statement("ALTER TABLE posts MODIFY COLUMN status ENUM('open', 'resolved') NOT NULL DEFAULT 'open'");
    }
};

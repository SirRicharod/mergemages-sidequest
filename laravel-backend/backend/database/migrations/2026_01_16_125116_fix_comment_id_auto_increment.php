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
        // Use raw SQL to modify the comment_id to be auto-increment
        DB::statement('ALTER TABLE comments MODIFY comment_id BIGINT UNSIGNED AUTO_INCREMENT');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove auto-increment if rolling back
        DB::statement('ALTER TABLE comments MODIFY comment_id BIGINT UNSIGNED');
    }
};

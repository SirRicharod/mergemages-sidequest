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
        Schema::table('comments', function (Blueprint $table) {
            // Remove foreign key and column for author_user_id if it exists
            if (Schema::hasColumn('comments', 'author_user_id')) {
                $table->dropForeign(['author_user_id']);
                $table->dropColumn('author_user_id');
            }
            
            // Add updated_at column if it doesn't exist
            if (!Schema::hasColumn('comments', 'updated_at')) {
                $table->timestamp('updated_at')->nullable()->after('created_at');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            // Restore author_user_id if rolling back
            if (!Schema::hasColumn('comments', 'author_user_id')) {
                $table->string('author_user_id')->nullable()->after('user_id');
            }
            
            // Remove updated_at if rolling back
            if (Schema::hasColumn('comments', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });
    }
};

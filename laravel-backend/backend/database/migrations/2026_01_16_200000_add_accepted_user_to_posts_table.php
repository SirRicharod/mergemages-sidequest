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
        Schema::table('posts', function (Blueprint $table) {
            // Add accepted_user_id to track who accepted the quest
            $table->uuid('accepted_user_id')->nullable()->after('author_user_id');
            
            // Add foreign key constraint
            $table->foreign('accepted_user_id')
                ->references('user_id')
                ->on('users')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['accepted_user_id']);
            $table->dropColumn('accepted_user_id');
        });
    }
};

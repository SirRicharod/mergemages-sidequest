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
        if (Schema::hasTable('users') && !Schema::hasColumn('users', 'xp_balance')) {
            Schema::table('users', function (Blueprint $table) {
                $table->integer('xp_balance')->default(1000)->after('avatar_url');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'xp_balance')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn(['xp_balance']);
            });
        }
    }
};

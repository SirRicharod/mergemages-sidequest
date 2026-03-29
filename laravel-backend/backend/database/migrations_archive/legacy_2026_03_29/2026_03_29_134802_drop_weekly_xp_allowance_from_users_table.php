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
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'weekly_xp_allowance')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('weekly_xp_allowance');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('users') && !Schema::hasColumn('users', 'weekly_xp_allowance')) {
            Schema::table('users', function (Blueprint $table) {
                $table->integer('weekly_xp_allowance')->default(1000)->after('xp_balance');
            });
        }
    }
};

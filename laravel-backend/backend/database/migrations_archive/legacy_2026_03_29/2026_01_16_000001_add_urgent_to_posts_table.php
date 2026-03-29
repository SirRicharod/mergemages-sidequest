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
        if (Schema::hasTable('posts') && !Schema::hasColumn('posts', 'urgent')) {
            Schema::table('posts', function (Blueprint $table) {
                $table->boolean('urgent')->default(false)->after('bounty_points');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('posts') && Schema::hasColumn('posts', 'urgent')) {
            Schema::table('posts', function (Blueprint $table) {
                $table->dropColumn('urgent');
            });
        }
    }
};

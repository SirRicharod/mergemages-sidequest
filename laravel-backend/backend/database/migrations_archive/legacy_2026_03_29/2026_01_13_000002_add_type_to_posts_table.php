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
        if (Schema::hasTable('posts') && !Schema::hasColumn('posts', 'type')) {
            Schema::table('posts', function (Blueprint $table) {
                $table->enum('type', ['request', 'offer'])->default('request')->after('body');
            });
        }

        if (Schema::hasTable('posts') && Schema::hasColumn('posts', 'type')) {
            // Set existing posts to 'request' type
            DB::table('posts')->whereNull('type')->update(['type' => 'request']);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('posts') && Schema::hasColumn('posts', 'type')) {
            Schema::table('posts', function (Blueprint $table) {
                $table->dropColumn('type');
            });
        }
    }
};

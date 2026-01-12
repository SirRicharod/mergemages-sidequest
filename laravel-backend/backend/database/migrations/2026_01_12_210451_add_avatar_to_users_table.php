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
        Schema::table('users', function (Blueprint $table) {
            // Hier maken we de kolom 'avatar' aan.
            // 'nullable' betekent dat het niet verplicht is (je hoeft geen foto te hebben).
            // 'after' zorgt dat hij netjes achter je email adres komt te staan.
            $table->string('avatar')->nullable()->after('email');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Als we spijt krijgen, kunnen we de kolom weer verwijderen
            $table->dropColumn('avatar');
        });
    }
};

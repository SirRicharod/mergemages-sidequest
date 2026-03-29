<?php

use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Intentionally left as a no-op.
        // This legacy migration previously attempted a raw ALTER on `comment_id`,
        // which is not safe across environments/schemas.
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Intentionally left as a no-op.
    }
};

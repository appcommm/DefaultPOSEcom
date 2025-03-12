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
        Schema::table('customers', function (Blueprint $table) {
            $table->dropUnique('customers_email_unique');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->string('email')->nullable()->change();
            $table->text('address')->nullable()->change();

            $table->unique('email', 'customers_email_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropUnique('customers_email_unique');
        });

        Schema::table('customers', function (Blueprint $table) {
            $table->string('email')->nullable(false)->change();
            $table->text('address')->nullable(false)->change();

            $table->unique('email', 'customers_email_unique');
        });
    }
};

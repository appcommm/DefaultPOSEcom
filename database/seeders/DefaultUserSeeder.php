<?php

namespace Database\Seeders;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DefaultUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $input = [
            'first_name' => 'admin',
            'email' => 'ecom_4dm!n24@gmail.com',
            'email_verified_at' => Carbon::now(),
            'password' => Hash::make('s5gefzuFZ3JyUw=='),
        ];
        $user = User::create($input);
        /** @var Role $adminRole */
        $adminRole = Role::whereName('admin')->first();
        if ($user) {
            $user->assignRole($adminRole);
        }
    }
}

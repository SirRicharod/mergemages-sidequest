<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids;

    // ⚙️ BELANGRIJKE CONFIGURATIE VOOR UUIDs & USER_ID
    protected $primaryKey = 'user_id'; // Wij gebruiken user_id, niet id
    public $incrementing = false;      // Het is geen optellend nummer
    protected $keyType = 'string';     // Het is tekst (UUID)

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',        // Belangrijk! Anders kan Laravel de ID niet opslaan
        'name',
        'email',
        'password_hash',  // Komt overeen met je database kolom
        'bio',
        'avatar',         // Dit is de bestandsnaam in de database
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password_hash',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    
    // Omdat Laravel standaard zoekt naar 'password', verwijzen we hier naar 'password_hash'
    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}
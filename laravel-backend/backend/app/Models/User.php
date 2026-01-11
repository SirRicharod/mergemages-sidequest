<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // <--- 1. Deze importeren

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasUuids; // <--- 2. HasUuids aanzetten

    // --- 3. HIER FIXEN WE DE FOUTMELDING ---
    protected $primaryKey = 'user_id'; // De naam van je ID kolom
    public $incrementing = false;      // Het is geen optellend nummer
    protected $keyType = 'string';     // Het is tekst (UUID)
    // ---------------------------------------

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password_hash', // Let op: In jouw database heet dit password_hash, niet password
        'bio',
        'avatar_url',
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
        // 'password' => 'hashed', // Deze mag weg omdat we password_hash gebruiken
    ];
    
    // Omdat Laravel standaard 'password' verwacht voor inloggen, moeten we dit ook even zeggen:
    public function getAuthPassword()
    {
        return $this->password_hash;
    }
}
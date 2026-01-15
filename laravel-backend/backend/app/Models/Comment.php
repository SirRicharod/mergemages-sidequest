<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;
    protected $fillable = ['post_id', 'user_id', 'content'];

    // Relatie met de user
    public function user()
    {
        // We koppelen 'user_id' van de comment aan 'user_id' van de user
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}
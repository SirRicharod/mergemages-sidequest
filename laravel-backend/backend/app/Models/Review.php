<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids; // Deze hebben we nodig voor UUIDs

class Review extends Model
{
    use HasFactory, HasUuids; // Activeer de UUID magie

    // Welke velden mogen we invullen?
    protected $fillable = [
        'reviewer_id',
        'target_user_id',
        'rating',
        'comment'
    ];

    // Relatie: Een review hoort bij een schrijver
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id', 'user_id');
    }

    // Relatie: Een review is voor iemand bedoeld
    public function targetUser()
    {
        return $this->belongsTo(User::class, 'target_user_id', 'user_id');
    }
}
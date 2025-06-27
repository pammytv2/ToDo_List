<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Todo extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'text',
        'completed',
        'completed_by',
        'completed_at',
        'in_progress',
        'in_progress_by',
        'in_progress_at',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'completed_at' => 'datetime',
        'in_progress' => 'boolean',
        'in_progress_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function completedByUser()
    {
        return $this->belongsTo(User::class, 'completed_by');
    }

    public function inProgressByUser()
    {
        return $this->belongsTo(User::class, 'in_progress_by');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
}
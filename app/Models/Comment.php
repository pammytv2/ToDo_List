<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'todo_id',
        'user_id',
        'text',
        'image_path',
    ];

    public function todo()
    {
        return $this->belongsTo(Todo::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    // App\Models\Comment.php

    public function images()
    {
        return $this->hasMany(CommentImage::class);
    }
}

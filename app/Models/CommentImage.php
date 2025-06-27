<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CommentImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'comment_id',
        'path',
    ];

    public function comment()
    {
        return $this->belongsTo(Comment::class);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;



class CommentController extends Controller
{
    public function store(Request $request)
{
    $request->validate([
        'todo_id' => 'required|exists:todos,id',
        'text' => 'nullable|string|max:1000',
        'images.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    $comment = Comment::create([
        'todo_id' => $request->todo_id,
        'user_id' => Auth::id(),
        'text' => $request->text ?? '',
    ]);

    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            $path = $image->store('comments', 'public');
            $comment->images()->create(['path' => $path]);
        }
    }

    $comment->load('user', 'images');

    return response()->json(['comment' => $comment], 201);
}


    public function update(Request $request, Comment $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'ไม่มีสิทธิ์'], 403);
        }

        $request->validate(['text' => 'required|string']);

        $comment->text = $request->text;
        $comment->load('user');
        $comment->save();

        return response()->json(['comment' => $comment]);
    }

    public function destroy(Comment $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'ไม่มีสิทธิ์ลบ'], 403);
        }

        $comment->delete();
        return response()->json(['message' => 'ลบความคิดเห็นเรียบร้อย']);
    }
}

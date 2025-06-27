<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class TodoController extends Controller
{
    public function index()
    {

        $todos = Todo::with(['comments.user', 'completedByUser', 'comments.images', 'inProgressByUser',])
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['todos' => $todos]);
    }
    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'text' => 'required|string|max:255',
        ]);

        try {

            if (config('app.debug')) {
                Log::info('🧪 Auth check', ['check' => Auth::check()]);
                Log::info('🧪 Auth id', ['id' => Auth::id()]);
                Log::info('🧪 Auth user', ['user' => Auth::user()]);
            }

            $todo = Todo::create([
                'user_id' => Auth::id(),
                'text' => $request->text,
            ]);

            return response()->json(['todo' => $todo], 201);
        } catch (\Exception $e) {
            Log::error('Error creating todo: ' . $e->getMessage());
            return response()->json(['message' => 'Server Error'], 500);
        }
    }

    public function show($id)
    {
        $todo = Todo::with('comments')->findOrFail($id);

        // ตรวจสอบสิทธิ์การเข้าถึง
        if ($todo->user_id !== Auth::id()) {
            return response()->json(['message' => 'คุณไม่มีสิทธิ์เข้าถึง'], 403);
        }

        return response()->json(['todo' => $todo]);
    }

    public function update(Request $request, $id)
    {
        $todo = Todo::findOrFail($id);

        // ตรวจสอบสิทธิ์การแก้ไข
        if ($todo->user_id !== Auth::id()) {
            return response()->json(['message' => 'คุณไม่มีสิทธิ์แก้ไข'], 403);
        }

        $request->validate([
            'text' => 'required|string|max:255',
        ]);

        $todo->update([
            'text' => $request->text,
        ]);

        return response()->json(['todo' => $todo]);
    }

    public function destroy($id)
    {
        $todo = Todo::findOrFail($id);


        if ($todo->user_id !== Auth::id()) {
            return response()->json(['message' => 'คุณไม่มีสิทธิ์ลบ'], 403);
        }

        $todo->delete();
        return response()->json(['message' => 'ลบงานแล้ว']);
    }

    public function complete($id)
    {
        try {
            $todo = Todo::findOrFail($id);

            if ($todo->completed) {
                return response()->json(['message' => 'งานนี้ทำเสร็จแล้ว'], 400);
            }


            if ($todo->in_progress) {
                $todo->in_progress = false;
                $todo->in_progress_by = null;
                $todo->in_progress_at = null;
            }

            $todo->completed = true;
            $todo->completed_by = Auth::id();
            $todo->completed_at = now();
            $todo->save();

            $todo->load('completedByUser');

            return response()->json([
                'message' => 'ทำเครื่องหมายว่างานเสร็จแล้ว',
                'todo' => $todo,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Server Error'], 500);
        }
    }

    public function uncomplete($id)
    {
        $todo = Todo::findOrFail($id);

        if (!$todo->completed) {
            return response()->json(['message' => 'งานนี้ยังไม่ได้ทำเสร็จ'], 400);
        }

        $todo->update([
            'completed' => false,
            'completed_by' => null,
            'completed_at' => null,
        ]);

        return response()->json([
            'message' => 'ยกเลิกการทำเครื่องหมายเสร็จแล้ว',
            'todo' => $todo
        ]);
    }


    public function markInProgress($id)
    {
        $todo = Todo::findOrFail($id);

        if ($todo->in_progress) {
            return response()->json(['message' => 'งานนี้กำลังถูกทำอยู่แล้ว'], 400);
        }

        $todo->update([
            'in_progress' => true,
            'in_progress_by' => Auth::id(),
            'in_progress_at' => now(),
        ]);

        $todo->load('inProgressByUser');

        return response()->json([
            'message' => 'กำหนดสถานะงานเป็นกำลังทำ',
            'todo' => $todo,
        ]);
    }


    public function unmarkInProgress($id)
    {
        $todo = Todo::findOrFail($id);

        if (!$todo->in_progress) {
            return response()->json(['message' => 'งานนี้ยังไม่ได้ถูกกำหนดว่า "กำลังทำ"'], 400);
        }

        $todo->update([
            'in_progress' => false,
            'in_progress_by' => null,
            'in_progress_at' => null,
        ]);

        return response()->json([
            'message' => 'ยกเลิกสถานะกำลังทำของงานนี้แล้ว',
            'todo' => $todo
        ]);
    }
}

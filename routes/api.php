<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\TodoController;

// routes login register 
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // routes todo
    Route::get('/todo', [TodoController::class, 'index']);
    Route::post('/todo', [TodoController::class, 'store']);
    Route::delete('/todo/{id}', [TodoController::class, 'destroy']);

    
    Route::post('/todo/{id}/complete', [TodoController::class, 'complete']);
    Route::post('/todo/{id}/uncomplete', [TodoController::class, 'uncomplete']);

    Route::post('/todo/{id}/in-progress', [TodoController::class, 'markInProgress']);
    Route::post('/todo/{id}/in-progress/unmark', [TodoController::class, 'unmarkInProgress']);


    // routes comments
    Route::post('/comments', [CommentController::class, 'store']);
    Route::put('/comments/{comment}', [CommentController::class, 'update']);
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);
});

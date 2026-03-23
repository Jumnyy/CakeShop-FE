<?php

namespace App\Http\Controllers;
use App\Models\Post;

use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $query = Post::query();

        if ($request->has('topic_id')) {
            $query->where('topic_id', $request->topic_id);
        }
        if ($request->has('post_type')) {
            $query->where('post_type', $request->post_type);
        }

        $posts = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'data' => $posts,
            'message' => 'Lấy danh sách bài viết thành công',
        ]);
    }

    public function store(Request $request)
    {
        $post = Post::create($request->all());

        return response()->json([
            'status' => true,
            'data' => $post,
            'message' => 'Tạo bài viết thành công',
        ], 201);
    }

    public function show($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bài viết',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $post,
        ]);
    }

    public function update(Request $request, $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bài viết',
            ], 404);
        }

        $post->update($request->all());

        return response()->json([
            'status' => true,
            'data' => $post,
            'message' => 'Cập nhật bài viết thành công',
        ]);
    }

    public function destroy($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy bài viết',
            ], 404);
        }

        $post->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa bài viết thành công',
        ]);
    }
}

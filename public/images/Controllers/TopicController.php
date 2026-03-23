<?php

namespace App\Http\Controllers;
use App\Models\Topic;

use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function index()
    {
        $topics = Topic::orderBy('sort_order')->get();

        return response()->json([
            'status' => true,
            'data' => $topics,
            'message' => 'Lấy danh sách chủ đề thành công',
        ]);
    }

    public function store(Request $request)
    {
        $topic = Topic::create($request->all());

        return response()->json([
            'status' => true,
            'data' => $topic,
            'message' => 'Tạo chủ đề thành công',
        ], 201);
    }

    public function show($id)
    {
        $topic = Topic::find($id);

        if (!$topic) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy chủ đề',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $topic,
        ]);
    }

    public function update(Request $request, $id)
    {
        $topic = Topic::find($id);

        if (!$topic) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy chủ đề',
            ], 404);
        }

        $topic->update($request->all());

        return response()->json([
            'status' => true,
            'data' => $topic,
            'message' => 'Cập nhật chủ đề thành công',
        ]);
    }

    public function destroy($id)
    {
        $topic = Topic::find($id);

        if (!$topic) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy chủ đề',
            ], 404);
        }

        $topic->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa chủ đề thành công',
        ]);
    }
}

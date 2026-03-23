<?php

namespace App\Http\Controllers;
use App\Models\Banner;

use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $query = Banner::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }
        $barner = $query->orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => true,
            'data' => $barner,
            'message' => 'Lấy danh sách banner thành công',
        ]);
    }

    public function store(Request $request)
    {
        $barner = Banner::create($request->all());

        return response()->json([
            'status' => true,
            'data' => $barner,
            'message' => 'Tạo banner thành công',
        ], 201);
    }

    public function show($id)
    {
        $barner = Banner::find($id);

        if (!$barner) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy banner',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $barner,
        ]);
    }

    public function update(Request $request, $id)
    {
        $barner = Banner::find($id);

        if (!$barner) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy banner',
            ], 404);
        }

        $barner->update($request->all());

        return response()->json([
            'status' => true,
            'data' => $barner,
            'message' => 'Cập nhật banner thành công',
        ]);
    }

    public function destroy($id)
    {
        $barner = Banner::find($id);

        if (!$barner) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy banner',
            ], 404);
        }

        $barner->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa banner thành công',
        ]);
    }
}

<?php

namespace App\Http\Controllers;
use App\Models\Promotion;

use Illuminate\Http\Request;

class PromotionController extends Controller
{
     public function index(Request $request)
    {
        $query = Promotion::query();

        // Tìm kiếm theo tên hoặc mã
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('code', 'like', '%' . $request->search . '%');
        }

        $promotions = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'data' => $promotions,
            'message' => 'Lấy danh sách khuyến mãi thành công',
        ]);
    }

    public function store(Request $request)
    {
        $promotion = Promotion::create($request->all());

        return response()->json([
            'status' => true,
            'data' => $promotion,
            'message' => 'Tạo khuyến mãi thành công',
        ], 201);
    }

    public function show($id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy khuyến mãi',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $promotion,
        ]);
    }

    public function update(Request $request, $id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy khuyến mãi',
            ], 404);
        }

        $promotion->update($request->all());

        return response()->json([
            'status' => true,
            'data' => $promotion,
            'message' => 'Cập nhật khuyến mãi thành công',
        ]);
    }

    public function destroy($id)
    {
        $promotion = Promotion::find($id);

        if (!$promotion) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy khuyến mãi',
            ], 404);
        }

        $promotion->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa khuyến mãi thành công',
        ]);
    }
}

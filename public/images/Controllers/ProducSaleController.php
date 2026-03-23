<?php

namespace App\Http\Controllers;
use App\Models\ProductSale;

use Illuminate\Http\Request;

class ProducSaleController extends Controller
{
    public function index(Request $request)
    {
        $query = ProductSale::query();

        if ($request->has('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        $sales = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'data' => $sales,
            'message' => 'Lấy danh sách khuyến mãi thành công',
        ]);
    }

    public function store(Request $request)
    {
        $sale = ProductSale::create($request->all());

        return response()->json([
            'status' => true,
            'data' => $sale,
            'message' => 'Tạo khuyến mãi thành công',
        ], 201);
    }

    public function show($id)
    {
        $sale = ProductSale::find($id);

        if (!$sale) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy khuyến mãi',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $sale,
        ]);
    }

    public function update(Request $request, $id)
    {
        $sale = ProductSale::find($id);

        if (!$sale) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy khuyến mãi',
            ], 404);
        }

        $sale->update($request->all());

        return response()->json([
            'status' => true,
            'data' => $sale,
            'message' => 'Cập nhật khuyến mãi thành công',
        ]);
    }

    public function destroy($id)
    {
        $sale = ProductSale::find($id);

        if (!$sale) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy khuyến mãi',
            ], 404);
        }

        $sale->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa khuyến mãi thành công',
        ]);
    }
}

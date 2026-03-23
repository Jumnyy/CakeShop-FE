<?php

namespace App\Http\Controllers;
use App\Models\Order;

use Illuminate\Http\Request;

class OrderController extends Controller
{
     public function index(Request $request)
    {
        $query = Order::query();

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'data' => $orders,
            'message' => 'Lấy danh sách đơn hàng thành công',
        ]);
    }

    public function store(Request $request)
    {
        $order = Order::create($request->all());

        return response()->json([
            'status' => true,
            'data' => $order,
            'message' => 'Tạo đơn hàng thành công',
        ], 201);
    }

    public function show($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy đơn hàng',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $order,
        ]);
    }

    public function update(Request $request, $id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy đơn hàng',
            ], 404);
        }

        $order->update($request->all());

        return response()->json([
            'status' => true,
            'data' => $order,
            'message' => 'Cập nhật đơn hàng thành công',
        ]);
    }

    public function destroy($id)
    {
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy đơn hàng',
            ], 404);
        }

        $order->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa đơn hàng thành công',
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Menu;

class MenuController extends Controller
{
     public function index(Request $request)
    {
        $query = Menu::query();

        if ($request->has('position')) {
            $query->where('position', $request->position);
        }

        $menus = $query->orderBy('sort_order')->get();

        return response()->json([
            'status' => true,
            'data' => $menus,
            'message' => 'Lấy danh sách menu thành công',
        ]);
    }

    public function store(Request $request)
    {
        $menu = Menu::create($request->all());

        return response()->json([
            'status' => true,
            'data' => $menu,
            'message' => 'Tạo menu thành công',
        ], 201);
    }

    public function show($id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy menu',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $menu,
        ]);
    }

    public function update(Request $request, $id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy menu',
            ], 404);
        }

        $menu->update($request->all());

        return response()->json([
            'status' => true,
            'data' => $menu,
            'message' => 'Cập nhật menu thành công',
        ]);
    }

    public function destroy($id)
    {
        $menu = Menu::find($id);

        if (!$menu) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy menu',
            ], 404);
        }

        $menu->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa menu thành công',
        ]);
    }
}

<?php

namespace App\Http\Controllers;
use App\Models\Setting;

use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $Setting = Setting::all();

        return response()->json([
            'status' => true,
            'data' => $Setting,
            'message' => 'Lấy cấu hình thành công',
        ]);
    }

    public function store(Request $request)
    {
        $Setting = Setting::create($request->all());

        return response()->json([
            'status' => true,
            'data' => $Setting,
            'message' => 'Tạo cấu hình thành công',
        ], 201);
    }

    public function show($id)
    {
        $Setting = Setting::find($id);

        if (!$Setting) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy cấu hình',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $Setting,
        ]);
    }

    public function update(Request $request, $id)
    {
        $Setting = Setting::find($id);

        if (!$Setting) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy cấu hình',
            ], 404);
        }

        $Setting->update($request->all());

        return response()->json([
            'status' => true,
            'data' => $Setting,
            'message' => 'Cập nhật cấu hình thành công',
        ]);
    }

    public function destroy($id)
    {
        $Setting = Setting::find($id);

        if (!$Setting) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy cấu hình',
            ], 404);
        }

        $Setting->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa cấu hình thành công',
        ]);
    }
}

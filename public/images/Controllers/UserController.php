<?php

namespace App\Http\Controllers;
use App\Models\User;


use Illuminate\Http\Request;

class UserController extends Controller
{
      public function index(Request $request)
    {
        $query = User::query();

        if ($request->has('roles')) {
            $query->where('roles', $request->roles);
        }

        $users = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'data' => $users,
            'message' => 'Lấy danh sách người dùng thành công',
        ]);
    }

    public function store(Request $request)
    {
        // chú ý: password nên bcrypt, ở đây mình làm đơn giản
        if ($request->has('password')) {
            $request->merge([
                'password' => bcrypt($request->password),
            ]);
        }

        $user = User::create($request->all());

        return response()->json([
            'status' => true,
            'data' => $user,
            'message' => 'Tạo người dùng thành công',
        ], 201);
    }

    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy người dùng',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $user,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy người dùng',
            ], 404);
        }

        if ($request->has('password')) {
            $request->merge([
                'password' => bcrypt($request->password),
            ]);
        }

        $user->update($request->all());

        return response()->json([
            'status' => true,
            'data' => $user,
            'message' => 'Cập nhật người dùng thành công',
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy người dùng',
            ], 404);
        }

        $user->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa người dùng thành công',
        ]);
    }
}

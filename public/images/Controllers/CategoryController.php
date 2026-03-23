<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    //
    public function index(Request $Request)
    {
        $query = Category::query();
        $categories = $query->get();
        $result = [
            'status' => true,
            'data' => $categories,
            'message' => 'Lấy danh sách Danh mục thành công',
            'error' => null,
        ];
        return response()->json($result, 200);
    }

}

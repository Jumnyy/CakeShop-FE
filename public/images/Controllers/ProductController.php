<?php
namespace App\Http\Controllers;
use App\Models\Product;
use Illuminate\Http\Request;
class ProductController extends Controller
{
    public function index(Request $Request)
    {
        $query = Product::query();
        if ($Request->has('limit') && $Request->has('page')) {
            $limit = $Request->input('limit');
            $page = $Request->input('page');
            $offset = ($page - 1) * $limit;
            $query->offset($offset);
            $query->limit($limit);
        } else {
            if ($Request->has('limit')) {
                $limit = $Request->limit;
                $query->limit($limit);
            }
        }
        //search
        if ($Request->has('search')) {
            $search = $Request->search;
            $query->where('name', 'like', '%' . $search . '%');
        }
        $query->orderBy('created_at', 'desc');
        $products = $query->get();
        $result = [
            'status' => true,
            'data' => $products,
            'message' => 'Lấy danh sách sản phẩm thành công',
            'error' => null,
        ];
        return response()->json($result, 200);
    }

}

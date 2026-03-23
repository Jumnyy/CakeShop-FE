<?php

namespace App\Http\Controllers;
use App\Models\Contact;

use Illuminate\Http\Request;

class ContactController extends Controller
{
     public function index(Request $request)
    {
        $query = Contact::query();

        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $contacts = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => true,
            'data' => $contacts,
            'message' => 'Lấy danh sách liên hệ thành công',
        ]);
    }

    public function store(Request $request)
    {
        $contact = Contact::create($request->all());

        return response()->json([
            'status' => true,
            'data' => $contact,
            'message' => 'Tạo liên hệ thành công',
        ], 201);
    }

    public function show($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy liên hệ',
            ], 404);
        }

        return response()->json([
            'status' => true,
            'data' => $contact,
        ]);
    }

    public function update(Request $request, $id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy liên hệ',
            ], 404);
        }

        $contact->update($request->all());

        return response()->json([
            'status' => true,
            'data' => $contact,
            'message' => 'Cập nhật liên hệ thành công',
        ]);
    }

    public function destroy($id)
    {
        $contact = Contact::find($id);

        if (!$contact) {
            return response()->json([
                'status' => false,
                'message' => 'Không tìm thấy liên hệ',
            ], 404);
        }

        $contact->delete();

        return response()->json([
            'status' => true,
            'message' => 'Xóa liên hệ thành công',
        ]);
    }
}

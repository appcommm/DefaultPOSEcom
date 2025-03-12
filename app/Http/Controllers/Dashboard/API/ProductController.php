<?php

namespace App\Http\Controllers\Dashboard\API;

use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use App\Http\Controllers\Dashboard\API\BaseController;
use App\Http\Resources\Dashboard\ProductImageResource;
use App\Http\Resources\ProductResource;

class ProductController extends BaseController
{
    //listing
    public function listing(Request $request)
    {
        $request->validate([
            'page' => 'required|numeric',
            'limit' => 'required|numeric',
        ]);

        $query = Product::with('brand', 'productCategory');

        if (isset($request->product_category_id)) {
            $query = $query->where('product_category_id', $request->product_category_id);
        }

        if (isset($request->brand_id)) {
            $query = $query->where('brand_id', $request->brand_id);
        }

        if (isset($request->min_price)) {
            $query = $query->where('product_price', '>=', (int)$request->min_price);
        }

        if (isset($request->max_price)) {
            $query = $query->where('product_price', '<=', (int)$request->max_price);
        }

        if (isset($request->search_key)) {
            $query = $query->where(function ($query) use ($request) {
                $query->orWhere('name', 'like', '%' . $request->search_key . '%')
                    ->orWhereHas('brand', function ($q) use ($request) {
                        $q->where('name', 'like', '%' . $request->search_key . '%');
                    });
            });
        }

        $result = $query->orderBy('products.id', 'desc')
            ->join('manage_stocks', 'manage_stocks.product_id', 'products.id')
            ->where('manage_stocks.warehouse_id', 2)->paginate($request->limit);

        $totalPages = ceil($result->total() / $request->limit);

        if ($totalPages == 0) {
            return $this->sendError(204, 'No Product Found');
        }
        return response()->json($result, 200);
    }

    //product detail
    public function detail($id)
    {
        $product = Product::where('id', $id)->with('brand', 'productCategory')->first();
        if (!$product) {
            return $this->sendError(204, 'No Product Found');
        }
        return $this->sendResponse('success', $product);
    }

    //product images
    public function productImages($id)
    {
        $images = ProductImage::where('product_id', $id)->get();
        if (!$images->count()) {
            return $this->sendError(204, 'No Product Images Found');
        }
        return $this->sendResponse('success', ProductImageResource::collection($images));
    }
}

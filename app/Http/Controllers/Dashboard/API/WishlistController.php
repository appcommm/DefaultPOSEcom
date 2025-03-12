<?php

namespace App\Http\Controllers\Dashboard\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\MainProduct;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WishlistController extends BaseController
{
    public function list()
    {
        $products = [];
        $authCustomer = Auth::guard('mobile')->user();
        $wishlists = Wishlist::where('customer_id', $authCustomer->id)->get();
        foreach ($wishlists as $wishlist) {
            $product = MainProduct::find($wishlist->product_id);
            if ($product) {
                $products[] = $product;
            }
        }
        if (!empty($products)) {
            return $this->sendResponse("Wishlist list!", $products);
        } else {
            return $this->sendError(404, "There's no wishlist product!");
        }
    }

    public function change(Request $request)
    {
        // $request->validate([
        //     'product_id' => 'required|exists:products,id'
        // ]);
        $authCustomer = Auth::guard('mobile')->user();
        $wishlist = Wishlist::where('product_id', $request->product_id)->where('customer_id', $authCustomer->id)->first();
        if (!$wishlist) {
            $wishlist = new Wishlist();
            $wishlist->customer_id = $authCustomer->id;
            $wishlist->product_id = $request->product_id;
            $wishlist->save();
        } else {
            $wishlist->delete();
        }

        return $this->sendResponse("Wishlist changed!", $wishlist);
    }
}

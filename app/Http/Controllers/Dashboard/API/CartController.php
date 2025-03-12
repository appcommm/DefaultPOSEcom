<?php

namespace App\Http\Controllers\Dashboard\API;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ManageStock;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends BaseController
{
    public function index()
    {
        $cart = Cart::where('customer_id', Auth::guard('mobile')->user()->id)->first();
        if (!$cart) {
            $cart = new Cart();
            $cart->customer_id = Auth::guard('mobile')->user()->id;
            $cart->save();
        }
        $cartItems = CartItem::where('cart_id', $cart->id)->get();
        $total = 0;
        $taxTotal = 0;
        foreach ($cartItems as $item) {
            $product = Product::find($item->product_id);
            $total += $item->price * $item->quantity;
            $taxTotal += ($item->price * $item->quantity) * ($product->order_tax / 100);
        }
        return $this->sendResponse("Cart data", [
            'data' => $cartItems,
            'total' => $total,
            'tax_total' => $taxTotal
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric',
            'price' => 'required|numeric'
        ]);
        $ecomWarehouse = Warehouse::where('role_id', 2)->first();
        $currentStock = ManageStock::where('product_id', $request->product_id)->where('warehouse_id', $ecomWarehouse->id)->first();
        if ($currentStock->quantity < $request->quantity) {
            return $this->sendError(422, "Not Enough Stock!");
        }
        $cart = Cart::where('customer_id', Auth::guard('mobile')->user()->id)->first();
        if (!$cart) {
            $cart = new Cart();
            $cart->customer_id = Auth::guard('mobile')->user()->id;
            $cart->save();
        }
        $cartItem = CartItem::where('cart_id', $cart->id)->where('product_id', $request->product_id)->first();
        if (!$cartItem) {
            $cartItem = new CartItem();
            $cartItem->cart_id = $cart->id;
            $cartItem->product_id = $request->product_id;
            $cartItem->price = $request->price;
            $cartItem->quantity = $request->quantity;
            $cartItem->save();
        } else {
            $cartItem->quantity += 1;
            $cartItem->update();
        }

        return $this->sendResponse("Cart item stored");
    }

    public function deleteCartItem(Request $request, $id)
    {
        $cartItem = CartItem::find($id);
        if ($cartItem) {
            $cartItem->delete();
            return $this->sendResponse("Cart Item deleted!");
        }
        return $this->sendError(404, "Cart Item not found!");
    }

    public function clearCart()
    {
        $cart = Cart::where('customer_id', Auth::guard('mobile')->user()->id)->first();
        if ($cart) {
            $cartItems = CartItem::where('cart_id', $cart->id)->get();
            foreach ($cartItems as $item) {
                $item->delete();
            }

            return $this->sendResponse("Cart cleared!");
        }
        return $this->sendError(404, "Cart not found!");
    }

    public function updateCartItem(Request $request, $id)
    {
        $cartItem = CartItem::find($id);
        if ($cartItem) {
            $ecomWarehouse = Warehouse::where('role_id', 2)->first();
            $currentStock = ManageStock::where('product_id', $cartItem->product_id)->where('warehouse_id', $ecomWarehouse->id)->first();
            if ($currentStock->quantity < $request->quantity) {
                return $this->sendError(422, "Not enough stock!");
            } else {
                $cartItem->quantity = $request->quantity;
                $cartItem->update();
                return $this->sendResponse("Cart item quantity updated!");
            }
        }
        return $this->sendError(404, "Cart Item not found!");
    }
}

<?php

namespace App\Http\Controllers\Dashboard\API;

use App\Events\NewOrderEvent;
use Exception;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use App\Models\OrderSuccessMessage;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\Dashboard\OrderResource;
use App\Http\Controllers\Dashboard\API\BaseController;
use App\Http\Requests\Dashboard\API\StoreOrderRequest;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\ManageStock;
use App\Models\Product;
use App\Models\Warehouse;

class OrderController extends BaseController
{
    //list
    public function list()
    {
        $orders = Order::getRelationData()->where('customer_id', Auth::guard('mobile')->user()->id)->orderBy('id', 'DESC')->get();
        if (!count($orders)) {
            return $this->sendError(204, 'No Data Found');
        }
        return $this->sendResponse('success', OrderResource::collection($orders));
    }

    //detail
    public function detail($id)
    {
        $order = Order::getRelationData()->where('customer_id', Auth::guard('mobile')->user()->id)->where('id', $id)->get();
        if (!$order->count()) {
            return $this->sendError(204, 'No Order Found');
        }
        return $this->sendResponse('success', new OrderResource($order[0]));
    }

    //create order
    public function create(StoreOrderRequest $request)
    {
        $cart = Cart::where('customer_id', Auth::guard('mobile')->user()->id)->first();
        if (!$cart) {
            return $this->sendError(404, "Cart not found");
        }
        $orderData = $this->getRequestOrderData($request);

        DB::beginTransaction();
        try {

            $order = Order::create($orderData);

            $orderItemsData = $this->getRequestOrderItemsData($request, $order->id);
            OrderItem::insert($orderItemsData);

            // event(new NewOrderEvent($this->getNotificationData($order->id)));
            $cart = Cart::where('customer_id', Auth::guard('mobile')->user()->id)->first();
            $cart->delete();

            $message = $this->getOrderSuccessfulMessage();
            DB::commit();

            return $this->sendResponse($message, $order);
        } catch (Exception $e) {

            DB::rollBack();
            throw $e;
            return $this->sendError(500, 'Something wrong!Please Try Again.');
        }
    }

    // get new order notification data for admin
    private function getNotificationData($orderId)
    {
        $data = Order::with(['customer' => function ($query) {
            $query->select('id', 'name');
        }])->where('id', $orderId)->first();

        $data->message = 'placed a new order';

        return $data;
    }

    //get order successful message
    private function getOrderSuccessfulMessage()
    {
        $orderSuccessMessage = OrderSuccessMessage::first();
        if (!$orderSuccessMessage) {
            return 'Order တင်ခြင်း အောင်မြင်ပါသည်။';
        }
        return $orderSuccessMessage->value('message');
    }

    //get order data
    private function getRequestOrderData($request)
    {
        $data = [
            'customer_id' => Auth::guard('mobile')->user()->id,
            'name' => $request->name,
            'phone' => $request->phone,
            'address' => $request->address,
            'payment_method' => $request->payment_method,
            'status' => 'pending',
            'delivery_fee' => $request->delivery_fee,
            'region_id' => $request->region_id,
            'delivery_fee_id' => $request->delivery_fee_id,
        ];

        if ($request->payment_method == 'payment') {
            $data['payment_id'] = $request->payment_id;
            if ($request->hasFile('payment_photo')) {
                $image = $request->file('payment_photo');
                $data['payment_photo'] = $image->store('payment-photos');
            }
        }

        $subTotal = 0;

        $cart = Cart::where('customer_id', Auth::guard('mobile')->user()->id)->first();
        $carts = CartItem::where('cart_id', $cart->id)->get();
        foreach (json_decode($carts) as $cart) {
            $product = Product::find($cart->product_id);
            $taxAmount =  ($cart->price * $cart->quantity) * ($product->order_tax ? ($product->order_tax / 100) : 0);
            $subTotal += ($cart->price * $cart->quantity) + $taxAmount;
        }

        $data['sub_total'] = $subTotal;

        $data['grand_total'] = $request->delivery_fee + $subTotal;
        return $data;
    }

    //get order items data
    private function getRequestOrderItemsData($request, $orderId)
    {
        $cart = Cart::where('customer_id', Auth::guard('mobile')->user()->id)->first();
        $carts = CartItem::where('cart_id', $cart->id)->get();

        foreach ($carts as $cart) {
            $warehouse = Warehouse::where('role_id', 2)->first();
            $stock = ManageStock::where('product_id', $cart->product_id)->where('warehouse_id', $warehouse->id)->first();
            $product = Product::find($cart->product_id);
            if ($stock->quantity >= $cart->quantity) {
                $stock->quantity -= $cart->quantity;
                $stock->update();
            }
            $taxAmount =  ($cart->price * $cart->quantity) * ($product->order_tax ? ($product->order_tax / 100) : 0);

            $orderItem = [
                'order_id' => $orderId,
                'product_id' => $cart->product_id,
                // 'color' => $cart->color ?? '',
                // 'size' => $cart->size ?? '',
                'price' => $cart->price,
                'quantity' => $cart->quantity,
                'tax_amount' => $taxAmount,
                'total_price' => ($cart->price * $cart->quantity) + $taxAmount,
                'created_at' => now(),
                'updated_at' => now()
            ];
            $orderItems[] = $orderItem;
        }

        return $orderItems;
    }
}

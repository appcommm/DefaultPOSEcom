<?php

namespace App\Rules;

use App\Models\ManageStock;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Contracts\Validation\Rule;

class CartProductExists implements Rule
{
    protected $errorMessage;
    /**
     * Create a new rule instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->errorMessage = 'Ordered product not found.'; // Default message
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // $carts = json_decode($value);
        // foreach ($carts as $cart) {
        //     $cartProducts[] = $cart->product_id;
        // }
        // $products = Product::select('id')->whereIn('id', $cartProducts)->get()->pluck('id')->toArray();
        // $productCheck = array_diff($cartProducts, $products);
        // if (count($productCheck)) {
        //     return false;
        // }
        // return true;
        $carts = json_decode($value);

        if (!$carts || !is_array($carts)) {
            return false; // Invalid carts data
        }

        // Extract product IDs from carts
        $cartProducts = array_map(fn($cart) => $cart->product_id, $carts);

        // Check if products exist
        $productIds = Product::whereIn('id', $cartProducts)->pluck('id')->toArray();
        $productCheck = array_diff($cartProducts, $productIds);


        if (count($productCheck)) {
            $this->errorMessage = 'Some products in the cart do not exist.';
            return false;
        }

        // Find the warehouse with role_id 2
        $warehouse = Warehouse::where('role_id', 2)->first();

        if (!$warehouse) {
            $this->errorMessage = 'Warehouse not found.';
            return false;
        }

        $warehouseId = $warehouse->id;

        // Check stock for each product
        foreach ($carts as $cart) {
            $productId = $cart->product_id;
            $quantityRequired = $cart->quantity;

            // Get the stock for the product in the warehouse
            $stock = ManageStock::where('warehouse_id', $warehouseId)
                ->where('product_id', $productId)
                ->value('quantity');

                if ($stock === null || $stock < $quantityRequired) {
                    $this->errorMessage = "Insufficient stock for product ID: {$productId}.";
                    return false;
                }
        }

        return true; // All checks passed

    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return $this->errorMessage;
    }
}

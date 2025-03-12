<?php

namespace App\Http\Controllers\Dashboard;

use App\Models\Product;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Models\MainProduct;

class DashboardController extends Controller
{
    public function index()
    {
        $topProducts = MainProduct::select('main_products.*', DB::raw('COUNT(order_items.id) as total_orders'))
            ->join('order_items', 'main_products.id', 'order_items.product_id')
            ->groupBy('order_items.product_id')
            ->orderBy('total_orders', 'desc')
            ->limit(5)
            ->get();

        $topCustomers = Customer::select('customers.*', DB::raw('SUM(orders.grand_total) as total_sales'))
            ->join('orders', 'orders.customer_id', 'customers.id')
            ->groupBy('customers.id')
            ->where('orders.status', '!=', 'cancel')
            ->where('orders.status', '!=', 'refund')
            ->where('orders.status', '!=', 'pending')
            ->orderBy('total_sales', 'desc')
            ->limit(5)
            ->get();

        return view('backend.dashboard.index')->with(['topProducts' => $topProducts, 'topCustomers' => $topCustomers]);
    }
}

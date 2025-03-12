<?php

use App\Http\Controllers\Dashboard\DeliveryFeeController;
use App\Http\Controllers\Dashboard\RegionController;
use App\Http\Controllers\Dashboard\ApplicationController;
use App\Http\Controllers\Dashboard\BannerController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\OrderController;
use App\Http\Controllers\Dashboard\LoginController;
use App\Http\Controllers\Dashboard\OrderSuccessMessageController;
use App\Http\Controllers\Dashboard\PaymentController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
})->name('home');

Route::get('/privacy-policy', function () {
    return view('privacy-policy');
})->name('privacyPolicy');

//Auth
Route::get('/2023', [LoginController::class, 'login'])->name('dashboard.login');
Route::post('/2023', [LoginController::class, 'postLogin'])->name('postLogin');

Route::middleware('dashboard')->prefix('dashboard')->group(function () {
    Route::get('/logout', [LoginController::class, 'logout'])->name('dashboard.logout')->middleware('dashboard');
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    
    //profile
    Route::get('/edit-profile', [LoginController::class, 'editProfile'])->name('profile.edit');
    Route::post('/edit-profile', [LoginController::class, 'updateProfile'])->name('profile.update');

    //auth
    Route::get('/edit-password', [LoginController::class, 'editPassword'])->name('editPassword');
    Route::post('/edit-password', [LoginController::class, 'updatePassword'])->name('updatePassword');

    //regions (cash on delivery)
    Route::get('/regions', [RegionController::class, 'index'])->name('region');
    Route::get('/regions/datatable/ssd', [RegionController::class, 'serverSide']);

    Route::get('/regions/create', [RegionController::class, 'create'])->name('region.create');
    Route::post('/regions/create', [RegionController::class, 'store'])->name('region.store');
    Route::get('/regions/edit/{region}', [RegionController::class, 'edit'])->name('region.edit');
    Route::post('/regions/edit/{region}', [RegionController::class, 'update'])->name('region.update');
    Route::delete('/regions/{region}', [RegionController::class, 'destroy'])->name('region.destroy');

    //delivery fee
    Route::get('/delivery-fees', [DeliveryFeeController::class, 'index'])->name('deliveryfee');
    Route::get('/delivery-fees/datatable/ssd', [DeliveryFeeController::class, 'serverSide']);
    Route::get('/delivery-fees/create', [DeliveryFeeController::class, 'create'])->name('deliveryfee.create');
    Route::post('/delivery-fees/create', [DeliveryFeeController::class, 'store'])->name('deliveryfee.store');
    Route::get('/delivery-fees/edit/{delivery_fee}', [DeliveryFeeController::class, 'edit'])->name('deliveryfee.edit');
    Route::post('/delivery-fees/edit/{delivery_fee}', [DeliveryFeeController::class, 'update'])->name('deliveryfee.update');
    Route::delete('/delivery-fees/{delivery_fee}', [DeliveryFeeController::class, 'destroy'])->name('deliveryfee.destroy');

    //payments
    Route::get('/payments', [PaymentController::class, 'index'])->name('payment');
    Route::get('/payments/datatable/ssd', [PaymentController::class, 'serverSide']);

    Route::get('/payments/create', [PaymentController::class, 'create'])->name('payment.create');
    Route::post('/payments/create', [PaymentController::class, 'store'])->name('payment.store');
    Route::get('/payments/edit/{payment}', [PaymentController::class, 'edit'])->name('payment.edit');
    Route::post('/payments/edit/{payment}', [PaymentController::class, 'update'])->name('payment.update');
    Route::delete('/payments/{payment}', [PaymentController::class, 'destroy'])->name('payment.destroy');

    //banners
    Route::get('/banners', [BannerController::class, 'index'])->name('banner');
    Route::get('/banners/datatable/ssd', [BannerController::class, 'serverSide']);

    Route::get('/banners/create', [BannerController::class, 'create'])->name('banner.create');
    Route::post('/banners/create', [BannerController::class, 'store'])->name('banner.store');
    Route::get('/banners/edit/{banner}', [BannerController::class, 'edit'])->name('banner.edit');
    Route::post('/banners/edit/{banner}', [BannerController::class, 'update'])->name('banner.update');
    Route::delete('/banners/{banner}', [BannerController::class, 'destroy'])->name('banner.destroy');

    //orders
    Route::get('/orders', [OrderController::class, 'index'])->name('order');
    Route::get('/orders/status/{status}', [OrderController::class, 'orderByStatus'])->name('orderByStatus');

    Route::post('/orders/{order}', [OrderController::class, 'updateStatus'])->name('order.updateStatus');
    Route::get('/orders/cancel/{order}', [OrderController::class, 'cancelOrder'])->name('order.cancel');
    Route::post('/orders/cancel/{order}', [OrderController::class, 'saveCancelOrder'])->name('order.saveCancel');

    Route::get('/orders/refund/all', [OrderController::class, 'refundOrderList'])->name('order.refund.list');
    Route::get('/orders/refund/{order}', [OrderController::class, 'refundOrder'])->name('order.refund');
    Route::post('/orders/refund/{order}', [OrderController::class, 'saveRefundOrder'])->name('order.saveRefund');

    Route::get('/orders/{order}/{notiId?}', [OrderController::class, 'detail'])->name('order.detail');

    Route::get('/all-orders/datatable/ssd', [OrderController::class, 'getAllOrder']);
    Route::get('/refund-orders/datatable/ssd', [OrderController::class, 'getRefundList']);
    Route::get('/orders/{status}/datatable/ssd', [OrderController::class, 'getOrderByStatus']);

    //order success message
    Route::get('/order-success-messages', [OrderSuccessMessageController::class, 'index'])->name('orderSuccessMessage');
    Route::get('/order-success-messages/datatable/ssd', [OrderSuccessMessageController::class, 'serverSide']);

    Route::get('/order-success-messages/create', [OrderSuccessMessageController::class, 'create'])->name('orderSuccessMessage.create');
    Route::post('/order-success-messages/create', [OrderSuccessMessageController::class, 'store'])->name('orderSuccessMessage.store');
    Route::get('/order-success-messages/edit/{order_success_message}', [OrderSuccessMessageController::class, 'edit'])->name('orderSuccessMessage.edit');
    Route::post('/order-success-messages/edit/{order_success_message}', [OrderSuccessMessageController::class, 'update'])->name('orderSuccessMessage.update');
    Route::delete('/order-success-messages/{order_success_message}', [OrderSuccessMessageController::class, 'destroy'])->name('orderSuccessMessage.destroy');
});

Route::get('image/{filename}', [ApplicationController::class, 'image'])->where('filename', '.*');

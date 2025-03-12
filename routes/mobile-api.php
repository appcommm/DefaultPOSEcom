<?php

use App\Http\Controllers\Dashboard\API\AuthController;
use App\Http\Controllers\Dashboard\API\BannerController;
use App\Http\Controllers\Dashboard\API\BrandController;
use App\Http\Controllers\Dashboard\API\CategoryController;
use App\Http\Controllers\Dashboard\API\CustomerController;
use App\Http\Controllers\Dashboard\API\DeliveryFeeController;
use App\Http\Controllers\Dashboard\API\ForgotPasswordController;
use App\Http\Controllers\Dashboard\API\NotificationController;
use App\Http\Controllers\Dashboard\API\OrderController;
use App\Http\Controllers\Dashboard\API\PaymentController;
use App\Http\Controllers\Dashboard\API\ProductController;
use App\Http\Controllers\Dashboard\API\RegionController;
use App\Http\Controllers\Dashboard\API\WishlistController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/forgot-password', [ForgotPasswordController::class, 'forgotPassword']);
Route::post('/forgot-password-code/verify', [ForgotPasswordController::class, 'verifyForgotPasswordCode']);
Route::post('/update-password', [ForgotPasswordController::class, 'updatePassword']);

// banners
Route::get('banners', [BannerController::class, 'index']);

//brands
Route::get('brands', [BrandController::class, 'index']);

//category
Route::get('categories', [CategoryController::class, 'index']);

//products
Route::get('/products', [ProductController::class, 'listing']);
Route::get('products/{id}', [ProductController::class, 'detail']);
// Route::get('products/{id}/images', [ProductController::class, 'productImages']);

 //regions & cash on delivery
 Route::get('regions', [RegionController::class, 'list']);
 Route::get('regions/{id}', [RegionController::class, 'detail']);

 Route::get('delivery-fees', [DeliveryFeeController::class, 'list']);
 Route::get('delivery-fees/{id}', [DeliveryFeeController::class, 'detail']);
 Route::get('delivery-fees/regions/{regionId}', [DeliveryFeeController::class, 'deliveryFeeByRegion']);

 //payments
 Route::get('payments', [PaymentController::class, 'index']);

Route::middleware('mobile')->group(function () {
    Route::get('/logout', [AuthController::class, 'logout']);

    //customers
    Route::get('customer', [CustomerController::class, 'index']);
    Route::put('customer', [CustomerController::class, 'update']);
    Route::put('customer/update-password', [CustomerController::class, 'updatePassword']);

    //order
    Route::post('orders', [OrderController::class, 'create']);
    Route::get('orders/{id}', [OrderController::class, 'detail']);
    Route::get('orders', [OrderController::class, 'list']);

    //notification
    Route::get('notifications', [NotificationController::class, 'list']);
    Route::get('notifications/{id}/read', [NotificationController::class, 'read']);

    //wishlist
    Route::get('wishlist', [WishlistController::class, 'list']);
    Route::post('wishlist/change', [WishlistController::class, 'change']);
});

<?php

namespace App\Models;

use App\Casts\Image;
use App\Models\Contracts\JsonResourceful;
use App\Models\Region;
use App\Models\Payment;
use App\Models\Customer;
use App\Models\OrderItem;
use App\Models\DeliveryFee;
use App\Traits\HasJsonResourcefulData;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Order extends Model implements JsonResourceful
{
    use HasFactory, HasJsonResourcefulData;

    protected $casts = [
        'payment_photo' => Image::class,
    ];

    protected $fillable = [
        'customer_id',
        'payment_id',
        'payment_photo',
        'payment_method',
        'name',
        'phone',
        'address',
        'grand_total',
        'status',
        'refund_date',
        'cancel_message',
        'refund_message',
        'region_id',
        'delivery_fee_id',
        'delivery_fee',
        'sub_total',
    ];

    public function prepareLinks(): array
    {
        return [
            'self' => route('orders.show', $this->id),
        ];
    }
    public function prepareAttributes(): array
    {
        $fields = [
            'date' => $this->date,
            'customer_id' => $this->customer_id,
            'customer_name' => $this->name,
            'phone' => $this->phone,
            'address' => $this->address,
            'payment_id' => $this->payment_id,
            'payment_photo' => $this->payment_photo,
            'payment_method' => $this->payment_method,
            'sub_total' => $this->sub_total,
            'grand_total' => $this->grand_total,
            'delivery_fee' => $this->delivery_fee,
            'delivery_fee_detail' => $this->deliveryFeeRelation(),
            'cancel_message' => $this->cancel_message,
            'region' => $this->region,
            'status' => $this->status,
            'refund_date' => $this->refund_date,
            'refund_message' => $this->refund_message,
            'refund_image' => $this->refund_image,
            'order_items' => $this->orderItem,
            'created_at' => $this->created_at,
        ];

        return $fields;
    }

    public function orderItem()
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'id');
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class, 'payment_id', 'id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }

    public function warehouse() {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'id');
    }

    public function customer_name()
    {
        return $this->belongsTo(Customer::class, 'customer_id', 'id')->select(['id', 'name']);
    }

    public function region()
    {
        return $this->belongsTo(Region::class, 'region_id', 'id')->withTrashed();
    }

    public function deliveryFeeRelation()
    {
        return $this->belongsTo(DeliveryFee::class, 'delivery_fee_id', 'id')->withTrashed();
    }

    public function scopeGetRelationData($query)
    {
        return $query->with('orderItem', 'orderItem.product', 'orderItem.product.productCategory', 'orderItem.product.brand', 'payment', 'deliveryFeeRelation', 'deliveryFeeRelation.region')->where('customer_id', Auth::guard('mobile')->user()->id);
    }
}

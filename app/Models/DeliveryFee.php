<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DeliveryFee extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'region_id', 'fee', 'city'
    ];

    public function region() {
        return $this->belongsTo(Region::class, 'region_id', 'id')->withTrashed();
    }
}

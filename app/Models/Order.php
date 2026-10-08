<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'city',
        'zone',
        'notes',
        'payment_method',
        'payment_status',
        'order_status',
        'subtotal',
        'shipping_cost',
        'discount',
        'total',
        'fraud_status',
        'fraud_score',
        'fraud_flags',
        'courier_name',
        'courier_tracking_id',
        'courier_status',
        'courier_collected_amount',
        'dispatched_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'fraud_flags' => 'array',
        'fraud_score' => 'integer',
        'courier_collected_amount' => 'decimal:2',
        'dispatched_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}

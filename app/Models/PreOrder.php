<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PreOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'pre_order_number',
        'customer_name',
        'customer_phone',
        'customer_email',
        'delivery_address',
        'quantity',
        'unit_price',
        'advance_paid',
        'status',
        'notes',
        'expected_date',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'advance_paid' => 'decimal:2',
        'quantity' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

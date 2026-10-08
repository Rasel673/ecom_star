<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category_id',
        'brand_id',
        'model',
        'sku',
        'regular_price',
        'special_price',
        'stock_status',
        'quantity',
        'key_features',
        'specifications',
        'description',
        'thumbnail',
        'gallery',
        'is_featured',
        'is_popular',
        'status',
        'view_count',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'regular_price' => 'decimal:2',
        'special_price' => 'decimal:2',
        'quantity' => 'integer',
        'key_features' => 'array',
        'specifications' => 'array',
        'gallery' => 'array',
        'is_featured' => 'boolean',
        'is_popular' => 'boolean',
        'status' => 'boolean',
        'view_count' => 'integer',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class)->where('status', true);
    }

    public function getEffectivePriceAttribute()
    {
        return $this->special_price ?: $this->regular_price;
    }

    public function getDiscountPercentageAttribute()
    {
        if ($this->special_price && $this->regular_price > $this->special_price) {
            return round((($this->regular_price - $this->special_price) / $this->regular_price) * 100);
        }
        return 0;
    }
}

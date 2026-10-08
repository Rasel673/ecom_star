<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PcBuild extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'components',
        'total_price',
        'total_wattage',
    ];

    protected $casts = [
        'components' => 'array',
        'total_price' => 'decimal:2',
        'total_wattage' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

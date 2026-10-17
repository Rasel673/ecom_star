<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SeoRedirect extends Model
{
    use HasFactory;

    protected $fillable = [
        'source_path',
        'target_path',
        'status_code',
        'is_active',
        'hits',
        'last_accessed_at',
    ];

    protected $casts = [
        'status_code' => 'integer',
        'is_active' => 'boolean',
        'hits' => 'integer',
        'last_accessed_at' => 'datetime',
    ];
}

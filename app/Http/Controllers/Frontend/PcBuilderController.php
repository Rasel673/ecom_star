<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PcBuilderController extends Controller
{
    public function index(Request $request): Response
    {
        $components = [
            ['id' => 'processor', 'name' => 'CPU / Processor', 'category_slug' => 'processor', 'required' => true, 'group' => 'Core Components'],
            ['id' => 'motherboard', 'name' => 'Motherboard', 'category_slug' => 'motherboard', 'required' => true, 'group' => 'Core Components'],
            ['id' => 'ram-desktop', 'name' => 'RAM 1 (Memory)', 'category_slug' => 'ram-desktop', 'required' => true, 'group' => 'Core Components'],
            ['id' => 'ram-desktop-2', 'name' => 'RAM 2 (Optional)', 'category_slug' => 'ram-desktop', 'required' => false, 'group' => 'Core Components'],
            ['id' => 'ssd-storage', 'name' => 'Storage / SSD', 'category_slug' => 'ssd-storage', 'required' => true, 'group' => 'Core Components'],
            ['id' => 'graphics-card', 'name' => 'Graphics Card', 'category_slug' => 'graphics-card', 'required' => false, 'group' => 'Core Components'],
            ['id' => 'power-supply', 'name' => 'Power Supply', 'category_slug' => 'power-supply', 'required' => true, 'group' => 'Core Components'],
            ['id' => 'casing', 'name' => 'Casing', 'category_slug' => 'casing', 'required' => true, 'group' => 'Core Components'],
            ['id' => 'monitor', 'name' => 'Monitor', 'category_slug' => 'monitor', 'required' => false, 'group' => 'Peripherals & Accessories'],
            ['id' => 'keyboard', 'name' => 'Keyboard', 'category_slug' => 'keyboard', 'required' => false, 'group' => 'Peripherals & Accessories'],
            ['id' => 'mouse', 'name' => 'Mouse', 'category_slug' => 'mouse', 'required' => false, 'group' => 'Peripherals & Accessories'],
            ['id' => 'headphone', 'name' => 'Headphone', 'category_slug' => 'headphone', 'required' => false, 'group' => 'Peripherals & Accessories'],
        ];

        return Inertia::render('Frontend/PcBuilder', [
            'components' => $components,
            'seo' => [
                'title' => 'PC Builder - Build Your Own Custom Computer | Star Tech',
                'description' => 'Star Tech custom PC Builder lets you choose CPU, GPU, Motherboard, RAM, SSD and calculate price with ease.',
            ],
        ]);
    }

    public function selectComponent(Request $request, string $componentSlug): Response
    {
        $slotId = $request->query('slot', $componentSlug);
        $category = Category::where('slug', $componentSlug)->first();
        $query = Product::where('status', true);

        if ($category) {
            $query->where('category_id', $category->id);
        }

        $products = $query->with(['brand'])->paginate(15);

        return Inertia::render('Frontend/PcBuilderSelect', [
            'componentSlug' => $componentSlug,
            'slotId' => $slotId,
            'category' => $category,
            'products' => $products,
        ]);
    }
}

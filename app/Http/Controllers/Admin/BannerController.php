<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function index(): Response
    {
        $banners = Banner::orderBy('position')->orderBy('sort_order')->get();
        return Inertia::render('Admin/Banners/Index', [
            'banners' => $banners,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|string|max:500',
            'link' => 'nullable|string|max:500',
            'position' => 'required|string|in:home_slider,home_banner_2,promo_banner',
            'sort_order' => 'integer',
            'status' => 'boolean',
        ]);

        Banner::create($validated);
        return back()->with('success', 'Banner created successfully!');
    }

    public function update(Request $request, Banner $banner)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'image' => 'required|string|max:500',
            'link' => 'nullable|string|max:500',
            'position' => 'required|string|in:home_slider,home_banner_2,promo_banner',
            'sort_order' => 'integer',
            'status' => 'boolean',
        ]);

        $banner->update($validated);
        return back()->with('success', 'Banner updated successfully!');
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();
        return back()->with('success', 'Banner deleted successfully!');
    }
}

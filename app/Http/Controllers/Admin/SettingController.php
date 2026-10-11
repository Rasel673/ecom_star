<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'site_name' => 'nullable|string|max:255',
            'site_tagline' => 'nullable|string|max:500',
            'site_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:3072',
            'site_favicon' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,ico,webp|max:1024',
            'site_logo_url' => 'nullable|string|max:1000',
            'site_favicon_url' => 'nullable|string|max:1000',
            'primary_color' => ['nullable', 'string', 'regex:/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/'],
            'header_bg_color' => ['nullable', 'string', 'regex:/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/'],
            'footer_bg_color' => ['nullable', 'string', 'regex:/^#([a-fA-F0-9]{3}|[a-fA-F0-9]{6})$/'],
            'hotline' => 'nullable|string|max:100',
            'phone' => 'nullable|string|max:100',
            'whatsapp' => 'nullable|string|max:100',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:1000',
            'working_hours' => 'nullable|string|max:255',
            'facebook_url' => 'nullable|url|max:500',
            'youtube_url' => 'nullable|url|max:500',
            'instagram_url' => 'nullable|url|max:500',
            'twitter_url' => 'nullable|url|max:500',
            'linkedin_url' => 'nullable|url|max:500',
            'footer_about' => 'nullable|string|max:2000',
            'footer_copyright' => 'nullable|string|max:500',
            'delivery_charge_inside' => 'nullable|numeric|min:0',
            'delivery_charge_outside' => 'nullable|numeric|min:0',
        ]);

        $fields = [
            'site_name',
            'site_tagline',
            'primary_color',
            'header_bg_color',
            'footer_bg_color',
            'hotline',
            'phone',
            'whatsapp',
            'email',
            'address',
            'working_hours',
            'facebook_url',
            'youtube_url',
            'instagram_url',
            'twitter_url',
            'linkedin_url',
            'footer_about',
            'footer_copyright',
            'delivery_charge_inside',
            'delivery_charge_outside',
        ];

        foreach ($fields as $field) {
            if ($request->has($field)) {
                Setting::set($field, $request->input($field));
            }
        }

        // Handle Site Logo
        if ($request->boolean('remove_site_logo')) {
            Setting::set('site_logo', null);
        } elseif ($request->hasFile('site_logo')) {
            $path = $request->file('site_logo')->store('settings', 'public');
            Setting::set('site_logo', '/storage/' . $path);
        } elseif ($request->filled('site_logo_url')) {
            Setting::set('site_logo', $request->input('site_logo_url'));
        }

        // Handle Site Favicon
        if ($request->boolean('remove_site_favicon')) {
            Setting::set('site_favicon', null);
        } elseif ($request->hasFile('site_favicon')) {
            $path = $request->file('site_favicon')->store('settings', 'public');
            Setting::set('site_favicon', '/storage/' . $path);
        } elseif ($request->filled('site_favicon_url')) {
            Setting::set('site_favicon', $request->input('site_favicon_url'));
        }

        return redirect()->back()->with('success', 'Site settings updated successfully!');
    }
}

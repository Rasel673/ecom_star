<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminPageController extends Controller
{
    /**
     * Display a listing of CMS pages.
     */
    public function index(Request $request): Response
    {
        $query = Page::query();

        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('slug', 'like', "%{$request->search}%")
                  ->orWhere('subtitle', 'like', "%{$request->search}%");
            });
        }

        if ($request->page_type) {
            $query->where('page_type', $request->page_type);
        }

        $pages = $query->orderBy('sort_order', 'asc')
            ->latest('id')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
            'filters' => $request->only(['search', 'page_type']),
        ]);
    }

    /**
     * Show the form for creating a new CMS page.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Pages/Create');
    }

    /**
     * Store a newly created CMS page in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'slug' => 'nullable|string|max:200|unique:pages,slug',
            'subtitle' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'page_type' => 'required|string|in:standard,emi_calculator,order_tracking,contact_us,service_complain',
            'meta_title' => 'nullable|string|max:200',
            'meta_description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
            // If exists, append unique suffix
            $count = Page::where('slug', 'like', "{$validated['slug']}%")->count();
            if ($count > 0) {
                $validated['slug'] .= '-' . ($count + 1);
            }
        }

        $page = Page::create($validated);

        return redirect()->route('admin.pages.index')->with('success', "Page '{$page->title}' created successfully.");
    }

    /**
     * Show the form for editing the specified CMS page.
     */
    public function edit(Page $page): Response
    {
        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
        ]);
    }

    /**
     * Update the specified CMS page in storage.
     */
    public function update(Request $request, Page $page)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'slug' => 'required|string|max:200|unique:pages,slug,' . $page->id,
            'subtitle' => 'nullable|string|max:255',
            'content' => 'nullable|string',
            'page_type' => 'required|string|in:standard,emi_calculator,order_tracking,contact_us,service_complain',
            'meta_title' => 'nullable|string|max:200',
            'meta_description' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $page->update($validated);

        return redirect()->route('admin.pages.index')->with('success', "Page '{$page->title}' updated successfully.");
    }

    /**
     * Remove the specified CMS page from storage.
     */
    public function destroy(Page $page)
    {
        $title = $page->title;
        $page->delete();

        return redirect()->route('admin.pages.index')->with('success', "Page '{$title}' deleted.");
    }

    /**
     * Quick toggle active status.
     */
    public function toggleStatus(Page $page)
    {
        $page->update(['is_active' => !$page->is_active]);
        $status = $page->is_active ? 'Published' : 'Draft';

        return back()->with('success', "Page status set to {$status}.");
    }
}

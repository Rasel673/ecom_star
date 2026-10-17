<?php

namespace App\Http\Middleware;

use App\Models\SeoRedirect;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SeoRedirectMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only inspect GET/HEAD requests
        if (!$request->isMethodSafe()) {
            return $next($request);
        }

        // Skip internal/admin/assets routes
        if ($request->is('admin*', 'storage*', 'build*', 'api*', 'up')) {
            return $next($request);
        }

        $path = '/' . ltrim($request->path(), '/');
        $uri = '/' . ltrim($request->getRequestUri(), '/');

        // Check if matching redirect exists
        $redirect = SeoRedirect::where('is_active', true)
            ->where(function ($query) use ($path, $uri) {
                $query->where('source_path', $path)
                    ->orWhere('source_path', ltrim($path, '/'))
                    ->orWhere('source_path', $uri)
                    ->orWhere('source_path', ltrim($uri, '/'));
            })
            ->first();

        if ($redirect) {
            $redirect->increment('hits');
            $redirect->update(['last_accessed_at' => now()]);

            $statusCode = in_array($redirect->status_code, [301, 302, 307, 308]) ? $redirect->status_code : 301;
            return redirect($redirect->target_path, $statusCode);
        }

        return $next($request);
    }
}

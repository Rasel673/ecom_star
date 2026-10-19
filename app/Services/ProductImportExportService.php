<?php

namespace App\Services;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use OpenSpout\Common\Entity\Row;
use OpenSpout\Common\Entity\Style\Style;
use OpenSpout\Reader\CSV\Options as CSVReaderOptions;
use OpenSpout\Reader\CSV\Reader as CSVReader;
use OpenSpout\Reader\XLSX\Reader as XLSXReader;
use OpenSpout\Writer\CSV\Options as CSVWriterOptions;
use OpenSpout\Writer\CSV\Writer as CSVWriter;
use OpenSpout\Writer\XLSX\Writer as XLSXWriter;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ProductImportExportService
{
    /**
     * Column definitions for Export and Template.
     */
    public const COLUMNS = [
        'id' => 'ID',
        'name' => 'Product Name',
        'slug' => 'Slug',
        'category' => 'Category',
        'brand' => 'Brand',
        'model' => 'Model',
        'sku' => 'SKU',
        'regular_price' => 'Regular Price (৳)',
        'special_price' => 'Special Price (৳)',
        'stock_status' => 'Stock Status',
        'quantity' => 'Quantity',
        'thumbnail' => 'Thumbnail URL',
        'key_features' => 'Key Features (| separated)',
        'specifications' => 'Specifications (JSON or Key: Value | ...)',
        'description' => 'Description',
        'is_featured' => 'Is Featured (1/0)',
        'is_popular' => 'Is Popular (1/0)',
        'status' => 'Status (1/0)',
        'meta_title' => 'Meta Title',
        'meta_description' => 'Meta Description',
    ];

    /**
     * Export products into an XLSX or CSV file and return a BinaryFileResponse.
     */
    public function export(string $format = 'xlsx', array $filters = []): BinaryFileResponse
    {
        $format = strtolower($format) === 'csv' ? 'csv' : 'xlsx';
        $timestamp = date('Y-m-d_His');
        $fileName = "products_export_{$timestamp}.{$format}";
        $tempPath = storage_path("app/{$fileName}");

        if (!is_dir(storage_path('app'))) {
            mkdir(storage_path('app'), 0755, true);
        }

        $query = Product::with(['category', 'brand'])->latest();

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('model', 'like', "%{$filters['search']}%")
                  ->orWhere('sku', 'like', "%{$filters['search']}%");
            });
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['brand_id'])) {
            $query->where('brand_id', $filters['brand_id']);
        }

        $writer = $this->createWriter($format, $tempPath);

        // Header row
        $headers = array_values(self::COLUMNS);
        $headerStyle = (new Style())->setFontBold()->setFontSize(11);
        $writer->addRow(Row::fromValues($headers, $headerStyle));

        // Data rows in chunks to support thousands of products without memory issues
        $query->chunk(200, function ($products) use ($writer) {
            foreach ($products as $product) {
                $keyFeatures = is_array($product->key_features)
                    ? implode(' | ', $product->key_features)
                    : (string) ($product->key_features ?? '');

                $specifications = '';
                if (is_array($product->specifications)) {
                    $specsList = [];
                    foreach ($product->specifications as $k => $v) {
                        $specsList[] = "{$k}: {$v}";
                    }
                    $specifications = implode(' | ', $specsList);
                } elseif (is_string($product->specifications)) {
                    $specifications = $product->specifications;
                }

                $rowValues = [
                    $product->id,
                    $product->name,
                    $product->slug,
                    $product->category?->name ?? '',
                    $product->brand?->name ?? '',
                    $product->model ?? '',
                    $product->sku ?? '',
                    (float) $product->regular_price,
                    $product->special_price !== null ? (float) $product->special_price : '',
                    $product->stock_status ?? 'in_stock',
                    (int) $product->quantity,
                    $product->thumbnail ?? '',
                    $keyFeatures,
                    $specifications,
                    $product->description ?? '',
                    $product->is_featured ? 1 : 0,
                    $product->is_popular ? 1 : 0,
                    $product->status ? 1 : 0,
                    $product->meta_title ?? '',
                    $product->meta_description ?? '',
                ];

                $writer->addRow(Row::fromValues($rowValues));
            }
        });

        $writer->close();

        $contentType = $format === 'csv' ? 'text/csv; charset=UTF-8' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        return response()->download($tempPath, $fileName, [
            'Content-Type' => $contentType,
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ])->deleteFileAfterSend(true);
    }

    /**
     * Download sample blank/demo template for import.
     */
    public function downloadSampleTemplate(string $format = 'xlsx'): BinaryFileResponse
    {
        $format = strtolower($format) === 'csv' ? 'csv' : 'xlsx';
        $fileName = "product_import_sample_template.{$format}";
        $tempPath = storage_path("app/{$fileName}");

        if (!is_dir(storage_path('app'))) {
            mkdir(storage_path('app'), 0755, true);
        }

        $writer = $this->createWriter($format, $tempPath);

        $headers = array_values(self::COLUMNS);
        $headerStyle = (new Style())->setFontBold()->setFontSize(11);
        $writer->addRow(Row::fromValues($headers, $headerStyle));

        // Get sample category and brand if available
        $sampleCategory = Category::first()?->name ?? 'Processor';
        $sampleBrand = Brand::first()?->name ?? 'Intel';

        // Add 2 realistic sample rows
        $sampleRows = [
            [
                '', // Leave ID blank for new products
                'AMD Ryzen 7 7800X3D Gaming Processor',
                'amd-ryzen-7-7800x3d-processor',
                $sampleCategory,
                $sampleBrand,
                'Ryzen 7 7800X3D',
                'CPU-AMD-7800X3D',
                52000.00,
                48500.00,
                'in_stock',
                15,
                'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500',
                '8 Cores & 16 Threads | Up to 5.0 GHz Boost | 96MB 3D V-Cache | AM5 Socket | 120W TDP',
                'Cores: 8 | Threads: 16 | Base Clock: 4.2 GHz | Boost Clock: 5.0 GHz | Socket: AM5',
                'The AMD Ryzen 7 7800X3D is the ultimate gaming processor with groundbreaking 3D V-Cache technology.',
                1,
                1,
                1,
                'AMD Ryzen 7 7800X3D Processor Price in BD',
                'Buy AMD Ryzen 7 7800X3D gaming processor at best price in Bangladesh with official warranty.',
            ],
            [
                '',
                'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz RAM',
                'corsair-vengeance-rgb-32gb-ddr5-6000mhz-ram',
                'RAM (Desktop)',
                'Corsair',
                'CMH32GX5M2B6000C30',
                'RAM-COR-DDR5-32GB',
                16500.00,
                15200.00,
                'in_stock',
                20,
                'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500',
                'Capacity: 32GB (2x16GB) | Speed: DDR5 6000MHz | Dynamic Multi-Zone RGB | Intel XMP 3.0 & AMD EXPO',
                'Capacity: 32GB (2x16GB) | Memory Type: DDR5 | Tested Speed: 6000MHz | Tested Latency: CL30 | Voltage: 1.35V',
                'Corsair Vengeance RGB DDR5 delivers higher frequencies and greater capacities optimized for modern motherboards.',
                0,
                1,
                1,
                'Corsair Vengeance RGB 32GB DDR5 6000MHz Price in BD',
                'Get Corsair Vengeance RGB 32GB DDR5 6000MHz high speed RAM with lifetime warranty in Bangladesh.',
            ],
        ];

        foreach ($sampleRows as $row) {
            $writer->addRow(Row::fromValues($row));
        }

        $writer->close();

        $contentType = $format === 'csv' ? 'text/csv; charset=UTF-8' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

        return response()->download($tempPath, $fileName, [
            'Content-Type' => $contentType,
            'Content-Disposition' => "attachment; filename=\"{$fileName}\"",
        ])->deleteFileAfterSend(true);
    }

    /**
     * Bulk Import products from uploaded XLSX or CSV file.
     *
     * @return array{total_rows: int, imported: int, updated: int, skipped: int, errors: array}
     */
    public function import(UploadedFile $file, bool $updateExisting = true): array
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $filePath = $file->getRealPath();

        $imported = 0;
        $updated = 0;
        $skipped = 0;
        $errors = [];
        $totalRows = 0;

        // Cache categories and brands to minimize database queries during large bulk imports
        $categoryCache = Category::all()->keyBy(fn ($c) => Str::lower(trim($c->name)));
        $brandCache = Brand::all()->keyBy(fn ($b) => Str::lower(trim($b->name)));

        // Delimiter detection for CSV
        $delimiter = ',';
        if ($extension === 'csv' || $extension === 'txt') {
            $firstLine = fgets(fopen($filePath, 'r'));
            if ($firstLine) {
                if (substr_count($firstLine, ';') > substr_count($firstLine, ',')) {
                    $delimiter = ';';
                } elseif (substr_count($firstLine, "\t") > substr_count($firstLine, ',')) {
                    $delimiter = "\t";
                }
            }
        }

        $reader = $this->createReader($extension, $delimiter);
        $reader->open($filePath);

        $headerMap = [];
        $isFirstRow = true;

        foreach ($reader->getSheetIterator() as $sheet) {
            foreach ($sheet->getRowIterator() as $row) {
                $cells = array_map(function ($cell) {
                    $val = $cell->getValue();
                    if ($val instanceof \DateTimeInterface) {
                        return $val->format('Y-m-d H:i:s');
                    }
                    return is_string($val) ? trim($val) : $val;
                }, $row->getCells());

                // Skip completely empty rows
                if (empty(array_filter($cells, fn ($v) => $v !== null && $v !== ''))) {
                    continue;
                }

                if ($isFirstRow) {
                    $headerMap = $this->normalizeHeaders($cells);
                    $isFirstRow = false;
                    continue;
                }

                $totalRows++;
                $rowNum = $totalRows + 1; // +1 to reflect spreadsheet line number

                $rowData = $this->mapRowData($cells, $headerMap);

                // Validation: Name is required
                $name = $rowData['name'] ?? null;
                if (empty($name)) {
                    $errors[] = [
                        'row' => $rowNum,
                        'name' => 'Row #' . $rowNum,
                        'reason' => 'Product Name is missing or empty.',
                    ];
                    $skipped++;
                    continue;
                }

                // Validation: Regular price is required and must be numeric
                $regularPrice = $this->sanitizeNumber($rowData['regular_price'] ?? null);
                if ($regularPrice === null || $regularPrice < 0) {
                    $errors[] = [
                        'row' => $rowNum,
                        'name' => $name,
                        'reason' => 'Valid Regular Price is required.',
                    ];
                    $skipped++;
                    continue;
                }

                $specialPrice = $this->sanitizeNumber($rowData['special_price'] ?? null);
                if ($specialPrice !== null && $specialPrice <= 0) {
                    $specialPrice = null;
                }

                // Category Resolution
                $categoryId = $this->resolveCategory($rowData['category'] ?? null, $categoryCache);
                if (!$categoryId) {
                    // Fallback to first category or create default
                    $defaultCategory = Category::first();
                    if (!$defaultCategory) {
                        $defaultCategory = Category::create([
                            'name' => 'General',
                            'slug' => 'general',
                            'status' => true,
                        ]);
                        $categoryCache->put('general', $defaultCategory);
                    }
                    $categoryId = $defaultCategory->id;
                }

                // Brand Resolution
                $brandId = $this->resolveBrand($rowData['brand'] ?? null, $brandCache);

                // Slug & SKU Generation
                $sku = !empty($rowData['sku']) ? (string) $rowData['sku'] : null;
                $slug = !empty($rowData['slug']) ? Str::slug($rowData['slug']) : Str::slug($name);

                // Stock Status & Quantity
                $quantity = isset($rowData['quantity']) && is_numeric($rowData['quantity'])
                    ? (int) $rowData['quantity']
                    : 10;

                $stockStatus = strtolower($rowData['stock_status'] ?? '');
                if (!in_array($stockStatus, ['in_stock', 'out_of_stock', 'upcoming'])) {
                    $stockStatus = $quantity > 0 ? 'in_stock' : 'out_of_stock';
                }

                // Parse Key Features
                $keyFeatures = $this->parseKeyFeatures($rowData['key_features'] ?? null);

                // Parse Specifications
                $specifications = $this->parseSpecifications($rowData['specifications'] ?? null);

                // Flags
                $isFeatured = $this->parseBoolean($rowData['is_featured'] ?? false);
                $isPopular = $this->parseBoolean($rowData['is_popular'] ?? false);
                $status = isset($rowData['status']) ? $this->parseBoolean($rowData['status']) : true;

                $attributes = [
                    'name' => $name,
                    'category_id' => $categoryId,
                    'brand_id' => $brandId,
                    'model' => $rowData['model'] ?? null,
                    'sku' => $sku,
                    'regular_price' => $regularPrice,
                    'special_price' => $specialPrice,
                    'stock_status' => $stockStatus,
                    'quantity' => $quantity,
                    'thumbnail' => $rowData['thumbnail'] ?? null,
                    'key_features' => $keyFeatures,
                    'specifications' => $specifications,
                    'description' => $rowData['description'] ?? null,
                    'is_featured' => $isFeatured,
                    'is_popular' => $isPopular,
                    'status' => $status,
                    'meta_title' => $rowData['meta_title'] ?? null,
                    'meta_description' => $rowData['meta_description'] ?? null,
                ];

                // Check for existing product
                $existingProduct = null;
                $rowId = !empty($rowData['id']) && is_numeric($rowData['id']) ? (int) $rowData['id'] : null;

                if ($rowId) {
                    $existingProduct = Product::find($rowId);
                }

                if (!$existingProduct && !empty($sku)) {
                    $existingProduct = Product::where('sku', $sku)->first();
                }

                if (!$existingProduct) {
                    $existingProduct = Product::where('slug', $slug)->first();
                }

                try {
                    if ($existingProduct) {
                        if ($updateExisting) {
                            $attributes['slug'] = $existingProduct->slug; // keep original slug
                            if (empty($attributes['sku'])) {
                                $attributes['sku'] = $existingProduct->sku;
                            }
                            $existingProduct->update($attributes);
                            $updated++;
                        } else {
                            $skipped++;
                        }
                    } else {
                        // Generate unique slug for new product
                        $originalSlug = $slug;
                        $counter = 1;
                        while (Product::where('slug', $slug)->exists()) {
                            $slug = "{$originalSlug}-{$counter}";
                            $counter++;
                        }
                        $attributes['slug'] = $slug;

                        if (empty($attributes['sku'])) {
                            $attributes['sku'] = 'SKU-' . strtoupper(Str::random(8));
                        }

                        Product::create($attributes);
                        $imported++;
                    }
                } catch (\Throwable $e) {
                    $errors[] = [
                        'row' => $rowNum,
                        'name' => $name,
                        'reason' => $e->getMessage(),
                    ];
                    $skipped++;
                }
            }
        }

        $reader->close();

        return [
            'total_rows' => $totalRows,
            'imported' => $imported,
            'updated' => $updated,
            'skipped' => $skipped,
            'errors' => array_slice($errors, 0, 50), // return first 50 errors to avoid excessive payload
        ];
    }

    /**
     * Create writer instance based on format.
     */
    private function createWriter(string $format, string $filePath): XLSXWriter|CSVWriter
    {
        if ($format === 'csv') {
            $options = new CSVWriterOptions();
            $options->SHOULD_ADD_BOM = true;
            $writer = new CSVWriter($options);
        } else {
            $writer = new XLSXWriter();
        }

        $writer->openToFile($filePath);
        return $writer;
    }

    /**
     * Create reader instance based on format.
     */
    private function createReader(string $extension, string $delimiter = ','): XLSXReader|CSVReader
    {
        if ($extension === 'csv' || $extension === 'txt') {
            $options = new CSVReaderOptions();
            $options->FIELD_DELIMITER = $delimiter;
            return new CSVReader($options);
        }

        return new XLSXReader();
    }

    /**
     * Normalize headers to standardized keys.
     */
    private function normalizeHeaders(array $cells): array
    {
        $map = [];
        $synonyms = [
            'id' => ['id', 'product id', 'product_id'],
            'name' => ['name', 'product name', 'product_name', 'title', 'product title'],
            'slug' => ['slug', 'url_slug', 'product_slug'],
            'category' => ['category', 'category name', 'category_name', 'category_id', 'cat'],
            'brand' => ['brand', 'brand name', 'brand_name', 'brand_id', 'manufacturer'],
            'model' => ['model', 'product model', 'model_number', 'model_no'],
            'sku' => ['sku', 'product code', 'product_code', 'item code', 'barcode'],
            'regular_price' => ['regular price', 'regular_price', 'price', 'mrp', 'regular price (৳)', 'original price'],
            'special_price' => ['special price', 'special_price', 'sale price', 'offer price', 'discount price', 'special price (৳)'],
            'stock_status' => ['stock status', 'stock_status', 'availability', 'stock state'],
            'quantity' => ['quantity', 'qty', 'stock', 'stock quantity', 'inventory'],
            'thumbnail' => ['thumbnail', 'image', 'thumbnail url', 'image url', 'product image', 'photo'],
            'key_features' => ['key features', 'key_features', 'features', 'highlights', 'bullet points', 'key features (| separated)'],
            'specifications' => ['specifications', 'specs', 'technical specifications', 'specifications (json or key: value | ...)'],
            'description' => ['description', 'desc', 'details', 'product description'],
            'is_featured' => ['is featured', 'is_featured', 'featured', 'is featured (1/0)'],
            'is_popular' => ['is popular', 'is_popular', 'popular', 'is popular (1/0)'],
            'status' => ['status', 'is active', 'active', 'published', 'status (1/0)'],
            'meta_title' => ['meta title', 'meta_title', 'seo title'],
            'meta_description' => ['meta description', 'meta_description', 'seo description'],
        ];

        foreach ($cells as $index => $rawHeader) {
            $clean = Str::lower(trim((string) $rawHeader));
            $clean = preg_replace('/\s+/', ' ', $clean);

            foreach ($synonyms as $standardKey => $aliases) {
                if (in_array($clean, $aliases, true)) {
                    $map[$index] = $standardKey;
                    break;
                }
            }
        }

        return $map;
    }

    /**
     * Map row cell values by header map.
     */
    private function mapRowData(array $cells, array $headerMap): array
    {
        $data = [];
        foreach ($cells as $index => $value) {
            if (isset($headerMap[$index])) {
                $key = $headerMap[$index];
                $data[$key] = $value;
            }
        }
        return $data;
    }

    /**
     * Clean and parse number (strips currency symbols, commas).
     */
    private function sanitizeNumber(mixed $val): ?float
    {
        if ($val === null || $val === '') {
            return null;
        }

        if (is_numeric($val)) {
            return (float) $val;
        }

        // Clean out currency symbols (৳, $, €, etc.), commas, spaces
        $cleaned = preg_replace('/[^\d.]/', '', (string) $val);
        return is_numeric($cleaned) ? (float) $cleaned : null;
    }

    /**
     * Resolve or auto-create category by name or ID.
     */
    private function resolveCategory(mixed $input, $categoryCache): ?int
    {
        if (empty($input)) {
            return null;
        }

        // If numeric and matches existing ID
        if (is_numeric($input) && Category::where('id', (int) $input)->exists()) {
            return (int) $input;
        }

        $normalized = Str::lower(trim((string) $input));

        if ($categoryCache->has($normalized)) {
            return $categoryCache->get($normalized)->id;
        }

        // Search DB case-insensitively
        $category = Category::whereRaw('LOWER(name) = ?', [$normalized])->first();
        if ($category) {
            $categoryCache->put($normalized, $category);
            return $category->id;
        }

        // Auto-create category if doesn't exist
        $name = trim((string) $input);
        $slug = Str::slug($name);
        if (Category::where('slug', $slug)->exists()) {
            $slug .= '-' . Str::random(4);
        }

        $newCategory = Category::create([
            'name' => $name,
            'slug' => $slug,
            'status' => true,
        ]);

        $categoryCache->put($normalized, $newCategory);
        return $newCategory->id;
    }

    /**
     * Resolve or auto-create brand by name or ID.
     */
    private function resolveBrand(mixed $input, $brandCache): ?int
    {
        if (empty($input)) {
            return null;
        }

        if (is_numeric($input) && Brand::where('id', (int) $input)->exists()) {
            return (int) $input;
        }

        $normalized = Str::lower(trim((string) $input));

        if ($brandCache->has($normalized)) {
            return $brandCache->get($normalized)->id;
        }

        $brand = Brand::whereRaw('LOWER(name) = ?', [$normalized])->first();
        if ($brand) {
            $brandCache->put($normalized, $brand);
            return $brand->id;
        }

        // Auto-create brand
        $name = trim((string) $input);
        $slug = Str::slug($name);
        if (Brand::where('slug', $slug)->exists()) {
            $slug .= '-' . Str::random(4);
        }

        $newBrand = Brand::create([
            'name' => $name,
            'slug' => $slug,
            'status' => true,
        ]);

        $brandCache->put($normalized, $newBrand);
        return $newBrand->id;
    }

    /**
     * Parse key features from pipe-separated string, JSON, or newlines.
     */
    private function parseKeyFeatures(mixed $input): ?array
    {
        if (empty($input)) {
            return null;
        }

        if (is_array($input)) {
            return array_values(array_filter(array_map('trim', $input)));
        }

        $str = trim((string) $input);

        // Check if valid JSON array
        if ((str_starts_with($str, '[') && str_ends_with($str, ']'))) {
            $decoded = json_decode($str, true);
            if (is_array($decoded)) {
                return array_values(array_filter(array_map('trim', $decoded)));
            }
        }

        // Split by pipe '|' or newline '\n'
        $delimiter = str_contains($str, '|') ? '|' : "\n";
        $items = explode($delimiter, $str);
        $cleanItems = array_values(array_filter(array_map(function ($item) {
            return trim(ltrim(trim($item), "•-*\t "));
        }, $items)));

        return !empty($cleanItems) ? $cleanItems : null;
    }

    /**
     * Parse specifications into key-value map.
     */
    private function parseSpecifications(mixed $input): ?array
    {
        if (empty($input)) {
            return null;
        }

        if (is_array($input)) {
            return $input;
        }

        $str = trim((string) $input);

        // If JSON object
        if (str_starts_with($str, '{') && str_ends_with($str, '}')) {
            $decoded = json_decode($str, true);
            if (is_array($decoded)) {
                return $decoded;
            }
        }

        // Key: Value | Key: Value or newlines
        $delimiter = str_contains($str, '|') ? '|' : "\n";
        $parts = explode($delimiter, $str);
        $specs = [];

        foreach ($parts as $part) {
            if (str_contains($part, ':')) {
                [$k, $v] = explode(':', $part, 2);
                $cleanK = trim($k);
                $cleanV = trim($v);
                if ($cleanK !== '') {
                    $specs[$cleanK] = $cleanV;
                }
            }
        }

        return !empty($specs) ? $specs : null;
    }

    /**
     * Parse boolean string representation.
     */
    private function parseBoolean(mixed $val): bool
    {
        if (is_bool($val)) {
            return $val;
        }

        $lower = strtolower(trim((string) $val));
        return in_array($lower, ['1', 'true', 'yes', 'y', 'on', 'active'], true);
    }
}

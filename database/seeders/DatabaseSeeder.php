<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Banner;
use App\Models\Setting;
use App\Models\Coupon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users
        $admin = User::firstOrCreate(
            ['email' => 'admin@startech.com.bd'],
            [
                'name' => 'StarTech Admin',
                'password' => Hash::make('password123'),
                'role' => 'admin',
                'phone' => '01700000000',
                'address' => 'Dhaka, Bangladesh',
            ]
        );

        $customer = User::firstOrCreate(
            ['email' => 'customer@gmail.com'],
            [
                'name' => 'Rahim Ahmed',
                'password' => Hash::make('password123'),
                'role' => 'customer',
                'phone' => '01800000000',
                'address' => 'Mirpur-10, Dhaka',
            ]
        );

        // 2. Settings
        $settings = [
            'site_name' => 'Star Tech & Engineering Ltd',
            'site_tagline' => 'Leading Computer, Laptop & Component Shop in Bangladesh',
            'hotline' => '16793',
            'phone' => '09678002003',
            'email' => 'info@startech.com.bd',
            'address' => '28 Kazi Nazrul Islam Avenue, Banglamotor, Dhaka 1000',
            'currency' => '৳',
            'delivery_charge_inside' => '60',
            'delivery_charge_outside' => '120',
        ];
        foreach ($settings as $key => $val) {
            Setting::updateOrCreate(['key' => $key], ['value' => $val]);
        }

        // 3. Brands
        $brandsData = [
            ['name' => 'Intel', 'slug' => 'intel', 'logo' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=150', 'is_featured' => true],
            ['name' => 'AMD', 'slug' => 'amd', 'logo' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=150', 'is_featured' => true],
            ['name' => 'ASUS', 'slug' => 'asus', 'logo' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150', 'is_featured' => true],
            ['name' => 'MSI', 'slug' => 'msi', 'logo' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150', 'is_featured' => true],
            ['name' => 'Gigabyte', 'slug' => 'gigabyte', 'logo' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150', 'is_featured' => true],
            ['name' => 'Corsair', 'slug' => 'corsair', 'logo' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=150', 'is_featured' => true],
            ['name' => 'Apple', 'slug' => 'apple', 'logo' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150', 'is_featured' => true],
            ['name' => 'Dell', 'slug' => 'dell', 'logo' => 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=150', 'is_featured' => true],
            ['name' => 'HP', 'slug' => 'hp', 'logo' => 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=150', 'is_featured' => true],
            ['name' => 'Lenovo', 'slug' => 'lenovo', 'logo' => 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=150', 'is_featured' => true],
            ['name' => 'Samsung', 'slug' => 'samsung', 'logo' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=150', 'is_featured' => true],
            ['name' => 'Logitech', 'slug' => 'logitech', 'logo' => 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=150', 'is_featured' => true],
        ];

        $brands = [];
        foreach ($brandsData as $b) {
            $brands[$b['slug']] = Brand::firstOrCreate(['slug' => $b['slug']], $b);
        }

        // 4. Categories & Subcategories
        $categoriesTree = [
            [
                'name' => 'Desktop',
                'slug' => 'desktop',
                'icon' => 'Monitor',
                'is_featured' => true,
                'children' => [
                    ['name' => 'Special PC', 'slug' => 'special-pc'],
                    ['name' => 'Star PC', 'slug' => 'star-pc'],
                    ['name' => 'Gaming PC', 'slug' => 'gaming-pc'],
                    ['name' => 'Brand PC', 'slug' => 'brand-pc'],
                    ['name' => 'All-in-One PC', 'slug' => 'all-in-one-pc'],
                ]
            ],
            [
                'name' => 'Laptop',
                'slug' => 'laptop',
                'icon' => 'Laptop',
                'is_featured' => true,
                'children' => [
                    ['name' => 'All Laptops', 'slug' => 'all-laptops'],
                    ['name' => 'Gaming Laptop', 'slug' => 'gaming-laptop'],
                    ['name' => 'Premium Ultrabook', 'slug' => 'premium-ultrabook'],
                    ['name' => 'Apple MacBook', 'slug' => 'apple-macbook'],
                ]
            ],
            [
                'name' => 'Component',
                'slug' => 'component',
                'icon' => 'Cpu',
                'is_featured' => true,
                'children' => [
                    ['name' => 'Processor / CPU', 'slug' => 'processor'],
                    ['name' => 'Motherboard', 'slug' => 'motherboard'],
                    ['name' => 'Graphics Card', 'slug' => 'graphics-card'],
                    ['name' => 'RAM (Desktop)', 'slug' => 'ram-desktop'],
                    ['name' => 'Power Supply', 'slug' => 'power-supply'],
                    ['name' => 'Casing', 'slug' => 'casing'],
                    ['name' => 'SSD / Storage', 'slug' => 'ssd-storage'],
                ]
            ],
            [
                'name' => 'Monitor',
                'slug' => 'monitor',
                'icon' => 'Tv',
                'is_featured' => true,
                'children' => [
                    ['name' => 'Gaming Monitor', 'slug' => 'gaming-monitor'],
                    ['name' => '4K Monitor', 'slug' => '4k-monitor'],
                    ['name' => 'Curved Monitor', 'slug' => 'curved-monitor'],
                ]
            ],
            [
                'name' => 'Accessories',
                'slug' => 'accessories',
                'icon' => 'Keyboard',
                'is_featured' => true,
                'children' => [
                    ['name' => 'Keyboard', 'slug' => 'keyboard'],
                    ['name' => 'Mouse', 'slug' => 'mouse'],
                    ['name' => 'Headphone', 'slug' => 'headphone'],
                    ['name' => 'Speaker', 'slug' => 'speaker'],
                ]
            ],
            [
                'name' => 'Networking',
                'slug' => 'networking',
                'icon' => 'Wifi',
                'is_featured' => true,
                'children' => [
                    ['name' => 'Router', 'slug' => 'router'],
                    ['name' => 'Access Point', 'slug' => 'access-point'],
                ]
            ],
            [
                'name' => 'Gadget',
                'slug' => 'gadget',
                'icon' => 'Watch',
                'is_featured' => true,
                'children' => [
                    ['name' => 'Smart Watch', 'slug' => 'smart-watch'],
                    ['name' => 'Earbuds', 'slug' => 'earbuds'],
                    ['name' => 'Power Bank', 'slug' => 'power-bank'],
                ]
            ],
            [
                'name' => 'Gaming',
                'slug' => 'gaming',
                'icon' => 'Gamepad2',
                'is_featured' => true,
                'children' => [
                    ['name' => 'Gaming Chair', 'slug' => 'gaming-chair'],
                    ['name' => 'Gamepad', 'slug' => 'gamepad'],
                ]
            ],
        ];

        $categories = [];
        $sort = 1;
        foreach ($categoriesTree as $catData) {
            $children = $catData['children'] ?? [];
            unset($catData['children']);
            $catData['sort_order'] = $sort++;
            $parent = Category::firstOrCreate(['slug' => $catData['slug']], $catData);
            $categories[$parent->slug] = $parent;

            foreach ($children as $cIdx => $childData) {
                $childData['parent_id'] = $parent->id;
                $childData['sort_order'] = $cIdx + 1;
                $child = Category::firstOrCreate(['slug' => $childData['slug']], $childData);
                $categories[$child->slug] = $child;
            }
        }

        // 5. Banners
        $bannersData = [
            [
                'title' => 'Build Your Dream PC Today',
                'subtitle' => 'Get the best price & genuine warranty on components',
                'image' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&h=450&fit=crop',
                'link' => '/pc-builder',
                'position' => 'home_slider',
                'sort_order' => 1,
            ],
            [
                'title' => 'Intel Core Ultra Processors',
                'subtitle' => 'Experience next-gen AI computing and gaming performance',
                'image' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&h=450&fit=crop',
                'link' => '/category/processor',
                'position' => 'home_slider',
                'sort_order' => 2,
            ],
            [
                'title' => 'NVIDIA GeForce RTX 40-Series',
                'subtitle' => 'Beyond Fast for Gamers & Creators with DLSS 3',
                'image' => 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&h=450&fit=crop',
                'link' => '/category/graphics-card',
                'position' => 'home_slider',
                'sort_order' => 3,
            ],
            [
                'title' => 'Special PC Build Offer',
                'subtitle' => 'Exclusive discounts on full desktop setups',
                'image' => 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&h=300&fit=crop',
                'link' => '/category/special-pc',
                'position' => 'home_banner_2',
                'sort_order' => 1,
            ],
            [
                'title' => 'Laptop Fest 2026',
                'subtitle' => 'Free Backpack, Mouse & Up to 15,000৳ Cash Discount',
                'image' => 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=300&fit=crop',
                'link' => '/category/laptop',
                'position' => 'home_banner_2',
                'sort_order' => 2,
            ],
        ];

        foreach ($bannersData as $b) {
            Banner::firstOrCreate(['title' => $b['title']], $b);
        }

        // 6. Products
        $productsData = [
            [
                'name' => 'Intel 14th Gen Core i5-14400 10-Core Processor',
                'slug' => 'intel-14th-gen-core-i5-14400-processor',
                'category_slug' => 'processor',
                'brand_slug' => 'intel',
                'model' => 'Core i5-14400',
                'sku' => 'CPU-INTEL-14400',
                'regular_price' => 27500,
                'special_price' => 25800,
                'stock_status' => 'in_stock',
                'quantity' => 25,
                'thumbnail' => 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500&h=500&fit=crop',
                'is_featured' => true,
                'is_popular' => true,
                'key_features' => [
                    'Socket: LGA1700',
                    'Total Cores: 10 (6 P-cores + 4 E-cores)',
                    'Max Turbo Frequency: Up to 4.7 GHz',
                    'Total Cache: 20 MB Intel Smart Cache',
                    'Integrated Intel UHD Graphics 730',
                    '3 Years Replacement Warranty',
                ],
                'specifications' => [
                    'Base Frequency' => '2.50 GHz',
                    'Turbo Frequency' => '4.70 GHz',
                    'Cores / Threads' => '10 / 16',
                    'Socket' => 'LGA1700',
                    'TDP' => '65W (Base) / 148W (Max Turbo)',
                    'Memory Support' => 'DDR5 4800MHz / DDR4 3200MHz',
                ],
                'description' => 'The Intel Core i5-14400 is a powerful hybrid architecture processor built for mainstream desktop computing, smooth gaming, and content creation. Equipped with 6 Performance cores and 4 Efficient cores.',
            ],
            [
                'name' => 'AMD Ryzen 5 7600 Gaming Processor',
                'slug' => 'amd-ryzen-5-7600-gaming-processor',
                'category_slug' => 'processor',
                'brand_slug' => 'amd',
                'model' => 'Ryzen 5 7600',
                'sku' => 'CPU-AMD-7600',
                'regular_price' => 24000,
                'special_price' => 22500,
                'stock_status' => 'in_stock',
                'quantity' => 20,
                'thumbnail' => 'https://images.unsplash.com/photo-1555617981-d250280eb4c2?w=500&h=500&fit=crop',
                'is_featured' => true,
                'is_popular' => true,
                'key_features' => [
                    'Socket: AM5',
                    'Total Cores: 6, Threads: 12',
                    'Max Boost Clock: Up to 5.1 GHz',
                    'Base Clock: 3.8 GHz, L3 Cache: 32MB',
                    'PCI Express Version: PCIe 5.0',
                    '3 Years Warranty',
                ],
                'specifications' => [
                    'Platform' => 'Desktop (AM5)',
                    'Cores / Threads' => '6 / 12',
                    'Base Clock' => '3.8 GHz',
                    'Boost Clock' => 'Up to 5.1 GHz',
                    'L3 Cache' => '32MB',
                    'Default TDP' => '65W',
                ],
                'description' => 'AMD Ryzen 5 7600 Desktop Processor is powered by Zen 4 architecture, engineered for elite high-FPS gaming and fast processing speeds.',
            ],
            [
                'name' => 'MSI GeForce RTX 4060 VENTUS 2X Black 8G OC Graphics Card',
                'slug' => 'msi-geforce-rtx-4060-ventus-2x-black-8g-oc-graphics-card',
                'category_slug' => 'graphics-card',
                'brand_slug' => 'msi',
                'model' => 'RTX 4060 VENTUS 2X',
                'sku' => 'GPU-MSI-4060-V2',
                'regular_price' => 39500,
                'special_price' => 37900,
                'stock_status' => 'in_stock',
                'quantity' => 15,
                'thumbnail' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&h=500&fit=crop',
                'is_featured' => true,
                'is_popular' => true,
                'key_features' => [
                    '8GB GDDR6 128-bit Memory',
                    'Boost Clock: 2490 MHz',
                    'TORX Fan 4.0 Dual Fan Cooling',
                    'DLSS 3 & Ray Tracing Support',
                    'Outputs: DisplayPort x 3 (v1.4a) / HDMI 2.1a x 1',
                    '3 Years Official Warranty',
                ],
                'specifications' => [
                    'CUDA Cores' => '3072 Units',
                    'Memory Speed' => '17 Gbps',
                    'Memory Interface' => '128-bit',
                    'Recommended PSU' => '550W',
                    'Power Connectors' => '8-pin x 1',
                ],
                'description' => 'MSI GeForce RTX 4060 VENTUS 2X OC brings a performance-focused design that maintains the essentials to accomplish any gaming or rendering task at hand.',
            ],
            [
                'name' => 'ASUS ROG Strix B760-A Gaming WIFI D4 Motherboard',
                'slug' => 'asus-rog-strix-b760-a-gaming-wifi-d4-motherboard',
                'category_slug' => 'motherboard',
                'brand_slug' => 'asus',
                'model' => 'ROG STRIX B760-A',
                'sku' => 'MB-ASUS-B760A',
                'regular_price' => 26500,
                'special_price' => 24800,
                'stock_status' => 'in_stock',
                'quantity' => 12,
                'thumbnail' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=500&fit=crop',
                'is_featured' => true,
                'is_popular' => false,
                'key_features' => [
                    'Intel LGA1700 Socket for 14th/13th/12th Gen',
                    '12+1 Power Stages & VRM Heatsinks',
                    'PCIe 5.0 x16 SafeSlot',
                    'WiFi 6E & Intel 2.5Gb Ethernet',
                    'Aura Sync RGB Lighting',
                    '3 Years Warranty',
                ],
                'specifications' => [
                    'Form Factor' => 'ATX',
                    'Chipset' => 'Intel B760',
                    'Memory Slots' => '4 x DDR4 DIMM (Up to 128GB)',
                    'Storage' => '3 x M.2 PCIe 4.0 + 4 x SATA 6Gb/s',
                ],
                'description' => 'Dive into high-performance gaming with the ASUS ROG Strix B760-A Gaming WiFi D4, offering high-end power delivery and aesthetic silver heatsinks.',
            ],
            [
                'name' => 'Apple MacBook Air 13.6-Inch M3 Chip (8GB RAM, 256GB SSD) Midnight',
                'slug' => 'apple-macbook-air-13-inch-m3-chip-midnight',
                'category_slug' => 'apple-macbook',
                'brand_slug' => 'apple',
                'model' => 'MacBook Air M3',
                'sku' => 'LAP-APPLE-M3-MDN',
                'regular_price' => 148000,
                'special_price' => 142000,
                'stock_status' => 'in_stock',
                'quantity' => 8,
                'thumbnail' => 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop',
                'is_featured' => true,
                'is_popular' => true,
                'key_features' => [
                    'Apple M3 chip (8-core CPU, 8-core GPU)',
                    '8GB Unified Memory, 256GB SSD Storage',
                    '13.6-inch Liquid Retina Display with True Tone',
                    'Up to 18 hours battery life',
                    'MagSafe 3 charging port + 2x Thunderbolt ports',
                    '1 Year International Warranty',
                ],
                'specifications' => [
                    'Processor' => 'Apple M3 8-Core',
                    'Display' => '13.6-inch 2560x1664 Liquid Retina',
                    'Weight' => '1.24 kg',
                    'OS' => 'macOS Sonoma',
                ],
                'description' => 'MacBook Air with M3 chip sails through work and play. Superportable and fast with stunning battery life and slim aluminum unibody enclosure.',
            ],
            [
                'name' => 'ASUS TUF Gaming A15 FA506NC Ryzen 5 7535HS RTX 3050 4GB Laptop',
                'slug' => 'asus-tuf-gaming-a15-ryzen-5-rtx-3050-laptop',
                'category_slug' => 'gaming-laptop',
                'brand_slug' => 'asus',
                'model' => 'TUF Gaming A15',
                'sku' => 'LAP-ASUS-TUF-A15',
                'regular_price' => 96000,
                'special_price' => 91500,
                'stock_status' => 'in_stock',
                'quantity' => 10,
                'thumbnail' => 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop',
                'is_featured' => true,
                'is_popular' => true,
                'key_features' => [
                    'AMD Ryzen 5 7535HS Processor (Up to 4.55GHz)',
                    '15.6" FHD (1920x1080) 144Hz IPS Display',
                    '8GB DDR5 4800MHz RAM + 512GB NVMe SSD',
                    'NVIDIA GeForce RTX 3050 4GB GDDR6',
                    'RGB Backlit Gaming Keyboard',
                    '2 Years International Warranty',
                ],
                'specifications' => [
                    'Processor' => 'AMD Ryzen 5 7535HS',
                    'RAM' => '8GB DDR5 4800MHz',
                    'Storage' => '512GB PCIe NVMe SSD',
                    'Display' => '15.6" FHD 144Hz IPS',
                    'Battery' => '48WHrs, 3-cell Li-ion',
                ],
                'description' => 'Geared for serious gaming and real-world durability, the TUF Gaming A15 is a fully-loaded Windows 11 gaming laptop that can carry you to victory.',
            ],
            [
                'name' => 'Dell S2721HN 27" Full HD 75Hz IPS Monitor',
                'slug' => 'dell-s2721hn-27-inch-full-hd-ips-monitor',
                'category_slug' => 'monitor',
                'brand_slug' => 'dell',
                'model' => 'S2721HN',
                'sku' => 'MON-DELL-S2721HN',
                'regular_price' => 23500,
                'special_price' => 21800,
                'stock_status' => 'in_stock',
                'quantity' => 18,
                'thumbnail' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&h=500&fit=crop',
                'is_featured' => true,
                'is_popular' => true,
                'key_features' => [
                    '27" Full HD (1920 x 1080) at 75 Hz IPS Panel',
                    'AMD FreeSync Technology',
                    'Ultrathin bezel design & elegant textured rear',
                    'Dual HDMI 1.4 Ports & Audio Line-out',
                    'Flicker-free screen with ComfortView',
                    '3 Years Official Warranty',
                ],
                'specifications' => [
                    'Screen Size' => '27 Inch',
                    'Resolution' => '1920 x 1080 (FHD)',
                    'Refresh Rate' => '75Hz',
                    'Response Time' => '4ms (extreme)',
                    'Viewing Angle' => '178° / 178°',
                ],
                'description' => '27-inch Full HD monitor beautifully designed to sit easily into any space ready for your everyday lifestyle with seamless visual switching.',
            ],
            [
                'name' => 'Corsair Vengeance RGB PRO 16GB (2x8GB) DDR4 3200MHz RAM',
                'slug' => 'corsair-vengeance-rgb-pro-16gb-ddr4-3200mhz-ram',
                'category_slug' => 'ram-desktop',
                'brand_slug' => 'corsair',
                'model' => 'Vengeance RGB PRO',
                'sku' => 'RAM-COR-16GB-3200',
                'regular_price' => 7200,
                'special_price' => 6500,
                'stock_status' => 'in_stock',
                'quantity' => 30,
                'thumbnail' => 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&h=500&fit=crop',
                'is_featured' => false,
                'is_popular' => true,
                'key_features' => [
                    'Capacity: 16GB Kit (2 x 8GB)',
                    'Speed: DDR4 3200MHz, CL16 Latency',
                    'Dynamic Multi-Zone RGB Lighting',
                    'Custom Performance PCB for highest signal quality',
                    'Tightly Screened Memory ICs',
                    'Lifetime Warranty',
                ],
                'specifications' => [
                    'Type' => 'DDR4 Desktop Memory',
                    'Speed' => '3200MHz (PC4-25600)',
                    'Tested Latency' => '16-20-20-38',
                    'Tested Voltage' => '1.35V',
                ],
                'description' => 'CORSAIR VENGEANCE RGB PRO Series DDR4 overclocked memory lights up your PC with mesmerizing dynamic multi-zone RGB lighting while delivering peak performance.',
            ],
            [
                'name' => 'Logitech G502 HERO High Performance Gaming Mouse',
                'slug' => 'logitech-g502-hero-high-performance-gaming-mouse',
                'category_slug' => 'mouse',
                'brand_slug' => 'logitech',
                'model' => 'G502 HERO',
                'sku' => 'ACC-LOGI-G502',
                'regular_price' => 5500,
                'special_price' => 4950,
                'stock_status' => 'in_stock',
                'quantity' => 25,
                'thumbnail' => 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&h=500&fit=crop',
                'is_featured' => false,
                'is_popular' => true,
                'key_features' => [
                    'HERO 25K Sensor (100 - 25,600 DPI)',
                    '11 Programmable Buttons & Hyper-fast Scroll Wheel',
                    'Adjustable Weights (Five 3.6g weights)',
                    'LIGHTSYNC RGB customizable lighting',
                    'Mechanical Switch Button Tensioning',
                    '2 Years Warranty',
                ],
                'specifications' => [
                    'Sensor' => 'HERO 25K Optical',
                    'Max Acceleration' => '> 40G',
                    'Max Speed' => '> 400 IPS',
                    'Cable Length' => '2.10 m braided',
                ],
                'description' => 'G502 HERO features an advanced optical sensor for maximum tracking accuracy, customizable RGB lighting, custom game profiles, and repositionable weights.',
            ],
            [
                'name' => 'Star Special Gaming PC (Ryzen 5 5600 + GTX 1650 4GB + 16GB RAM + 512GB SSD)',
                'slug' => 'star-special-gaming-pc-ryzen-5-5600',
                'category_slug' => 'gaming-pc',
                'brand_slug' => 'amd',
                'model' => 'Star Gamer Pro V1',
                'sku' => 'PC-STAR-GAMER-V1',
                'regular_price' => 58000,
                'special_price' => 54500,
                'stock_status' => 'in_stock',
                'quantity' => 10,
                'thumbnail' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&h=500&fit=crop',
                'is_featured' => true,
                'is_popular' => true,
                'key_features' => [
                    'AMD Ryzen 5 5600 6-Core 12-Thread Processor',
                    'B450M Gaming Motherboard with M.2 slot',
                    '16GB (2x8GB) 3200MHz DDR4 Gaming RAM',
                    'GeForce GTX 1650 4GB GDDR6 Graphics Card',
                    '512GB NVMe M.2 High-Speed SSD',
                    '550W 80+ Bronze Certified Power Supply',
                    'RGB Gaming Tempered Glass Casing',
                    '3 Years Warranty on Major Components',
                ],
                'specifications' => [
                    'Processor' => 'AMD Ryzen 5 5600',
                    'Motherboard' => 'B450M Chipset',
                    'RAM' => '16GB DDR4 3200MHz',
                    'Graphics' => 'GTX 1650 4GB GDDR6',
                    'Storage' => '512GB M.2 NVMe SSD',
                    'PSU' => '550W 80 Plus Bronze',
                ],
                'description' => 'Complete ready-to-game Desktop PC engineered by Star Tech experts. Delivers 60+ FPS in GTA V, Valorant, CS2, Fortnite, and smooth creative workflows.',
            ],
            [
                'name' => 'Samsung 980 500GB PCIe 3.0 M.2 NVMe SSD',
                'slug' => 'samsung-980-500gb-pcie-3-m2-nvme-ssd',
                'category_slug' => 'ssd-storage',
                'brand_slug' => 'samsung',
                'model' => 'MZ-V8V500BW',
                'sku' => 'SSD-SAM-980-500G',
                'regular_price' => 5900,
                'special_price' => 5400,
                'stock_status' => 'in_stock',
                'quantity' => 20,
                'thumbnail' => 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop',
                'is_featured' => true,
                'is_popular' => true,
                'key_features' => [
                    'Capacity: 500GB M.2 (2280) Form Factor',
                    'Sequential Read: Up to 3,100 MB/s',
                    'Sequential Write: Up to 2,600 MB/s',
                    'PCIe 3.0 x4, NVMe 1.4 Interface',
                    'Samsung V-NAND 3-bit MLC Technology',
                    '3 Years Replacement Warranty',
                ],
                'specifications' => [
                    'Form Factor' => 'M.2 2280',
                    'Interface' => 'PCIe Gen 3.0 x4, NVMe 1.4',
                    'Read Speed' => '3100 MB/s',
                    'Write Speed' => '2600 MB/s',
                ],
                'description' => 'Upgrade to stunning NVMe speed. The Samsung 980 delivers maximum value using high bandwidth PCIe 3.0 technology.',
            ],
            [
                'name' => 'Corsair CV650 650W 80 Plus Bronze Power Supply',
                'slug' => 'corsair-cv650-650w-80-plus-bronze-power-supply',
                'category_slug' => 'power-supply',
                'brand_slug' => 'corsair',
                'model' => 'CV650',
                'sku' => 'PSU-COR-CV650',
                'regular_price' => 6800,
                'special_price' => 6200,
                'stock_status' => 'in_stock',
                'quantity' => 15,
                'thumbnail' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&h=500&fit=crop',
                'is_featured' => true,
                'is_popular' => true,
                'key_features' => [
                    'Continuous, reliable output: 650 Watts',
                    '80 PLUS Bronze Certified Efficiency up to 88%',
                    '120mm Low-Noise Thermally Controlled Fan',
                    'Compact 125mm length fits modern PC cases',
                    'Black sleeved cables and black powder-coated casing',
                    '3 Years Official Warranty',
                ],
                'specifications' => [
                    'Wattage' => '650W',
                    'Efficiency' => '80 PLUS Bronze',
                    'Fan Size' => '120mm',
                ],
                'description' => 'CORSAIR CV Series power supplies are ideal for powering your new home or office PC, with 80 PLUS Bronze efficiency guaranteed to deliver full wattage.',
            ],
            [
                'name' => 'Antec NX292 RGB Mid Tower Gaming Case',
                'slug' => 'antec-nx292-rgb-mid-tower-gaming-case',
                'category_slug' => 'casing',
                'brand_slug' => 'asus',
                'model' => 'NX292',
                'sku' => 'CASE-ANT-NX292',
                'regular_price' => 4400,
                'special_price' => 3950,
                'stock_status' => 'in_stock',
                'quantity' => 18,
                'thumbnail' => 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&h=500&fit=crop',
                'is_featured' => true,
                'is_popular' => true,
                'key_features' => [
                    'Mid Tower gaming chassis with Mesh front panel',
                    'Tempered Glass Side Panel Window',
                    'Pre-installed 3 x 120mm RGB fans in front + 1 regular fan rear',
                    'Supports ATX, Micro-ATX, and ITX Motherboards',
                    'USB 3.0 x 1, USB 2.0 x 2, HD-AUDIO',
                ],
                'specifications' => [
                    'Form Factor' => 'Mid Tower',
                    'Side Panel' => 'Tempered Glass',
                    'Included Fans' => '4 Fans (3 RGB + 1 Black)',
                ],
                'description' => 'The NX292 RGB mid-tower gaming case effortlessly combines a bevy of in-demand features: USB 3.0 connectivity, ample storage drive bays, and pre-installed RGB fans.',
            ],
        ];

        foreach ($productsData as $pData) {
            $catSlug = $pData['category_slug'];
            $brandSlug = $pData['brand_slug'];
            unset($pData['category_slug'], $pData['brand_slug']);

            $pData['category_id'] = $categories[$catSlug]->id ?? $categories['desktop']->id;
            $pData['brand_id'] = $brands[$brandSlug]->id ?? null;

            Product::firstOrCreate(['slug' => $pData['slug']], $pData);
        }

        // 7. Coupons
        Coupon::firstOrCreate(
            ['code' => 'STARTECH1000'],
            [
                'type' => 'fixed',
                'value' => 1000,
                'min_spend' => 20000,
                'status' => true,
                'expires_at' => now()->addMonths(6),
            ]
        );

        Coupon::firstOrCreate(
            ['code' => 'DISCOUNT5'],
            [
                'type' => 'percent',
                'value' => 5,
                'min_spend' => 10000,
                'status' => true,
                'expires_at' => now()->addMonths(6),
            ]
        );
    }
}

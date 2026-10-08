<?php

namespace Database\Seeders;

use App\Models\Page;
use Illuminate\Database\Seeder;

class PageSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            [
                'title' => 'Order Tracking',
                'slug' => 'order-tracking',
                'subtitle' => 'Real-time parcel delivery and fulfillment tracking',
                'page_type' => 'order_tracking',
                'content' => 'Track your StarTech online purchases anytime. Enter your Order ID (e.g. ST-261008-1234) and contact number below to get live fulfillment status, courier dispatch details, and tracking numbers for Steadfast, RedX, and Pathao logistics.',
                'meta_title' => 'Order Tracking - Star Tech & Engineering Ltd',
                'meta_description' => 'Track your StarTech online order live with consignment ID and courier tracking info.',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'EMI Calculation & Facilities',
                'slug' => 'emi-calculation',
                'subtitle' => '0% Interest EMI up to 36 Months with Leading Credit Cards',
                'page_type' => 'emi_calculator',
                'content' => 'Star Tech offers convenient Equated Monthly Installment (EMI) facilities across Bangladesh with over 28 leading commercial banks. Enjoy up to 36 months tenure on laptops, gaming desktops, processors, graphics cards, and premium accessories.',
                'meta_title' => 'EMI Facilities & Calculator - Star Tech',
                'meta_description' => 'Calculate your monthly EMI for laptops, PCs and components with StarTech partner banks.',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Online Service & Complain',
                'slug' => 'service-complain',
                'subtitle' => 'Official RMA Warranty, Product Repair & Customer Feedback',
                'page_type' => 'service_complain',
                'content' => 'At Star Tech, customer satisfaction is our prime commitment. If you face any technical trouble with your computer, laptop, or peripheral within the warranty period, submit a service ticket or lodge a complaint directly with our central RMA technical team.',
                'meta_title' => 'Online Service & RMA Complain - Star Tech',
                'meta_description' => 'Submit warranty repair tickets or lodge service complaints to Star Tech technical support.',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Contact Us',
                'slug' => 'contact-us',
                'subtitle' => 'Connect with our headquarters, retail branches & corporate teams',
                'page_type' => 'contact_us',
                'content' => 'Have questions about a component, corporate procurement, or need assistance choosing the right laptop? Our technology experts are available 7 days a week via hotline, email, or at any of our 18 retail outlets across Bangladesh.',
                'meta_title' => 'Contact Us - Star Tech & Engineering Ltd',
                'meta_description' => 'Contact Star Tech customer service hotline, email, and nationwide branch locations.',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'title' => 'PC Builder Guide',
                'slug' => 'pc-builder-guide',
                'subtitle' => 'How to build your custom desktop step-by-step',
                'page_type' => 'standard',
                'content' => '<h2>Welcome to the Star Tech PC Builder Guide</h2><p>Building your own desktop gives you the power to tailor every single component to your exact performance, cooling, and budget needs.</p><h3>1. Choosing Your Processor (CPU)</h3><p>Choose between Intel Core 14th Gen / Core Ultra or AMD Ryzen 7000/9000 series based on whether your priority is high-FPS gaming, 3D rendering, or office multitasking.</p><h3>2. Matching the Motherboard Socket</h3><p>Ensure your chosen motherboard socket (LGA1700 for Intel 13th/14th Gen or AM5 for AMD Ryzen 7000) matches your CPU.</p><h3>3. Memory (RAM) & High-Speed Storage (NVMe SSD)</h3><p>For modern gaming and productivity, 16GB to 32GB of DDR4 or DDR5 RAM is recommended. Pair it with a Gen4 M.2 NVMe SSD for fast boot times and game load speeds.</p><h3>4. Power Supply (PSU) & Casing</h3><p>Ensure your power supply has enough continuous wattage (e.g. 550W - 850W 80+ Bronze/Gold) to safely power your graphics card and components under peak loads.</p>',
                'meta_title' => 'PC Builder Guide - Star Tech',
                'meta_description' => 'Complete step-by-step guide on how to choose components and build your desktop PC.',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'title' => 'About Us',
                'slug' => 'about-us',
                'subtitle' => 'Bangladesh\'s Leading ICT Retail & Enterprise Solution Provider',
                'page_type' => 'standard',
                'content' => '<p>Star Tech & Engineering Ltd was founded in March 2007 with a clear mission: to provide genuine tech hardware, unmatched post-sales customer support, and fair pricing to gamers, professionals, and students across Bangladesh.</p><p>Today, Star Tech operates nationwide retail superstores, an e-commerce platform, and an enterprise solutions division serving thousands of businesses and institutions.</p>',
                'meta_title' => 'About Us - Star Tech & Engineering Ltd',
                'meta_description' => 'Learn about Star Tech history, mission, and nationwide tech retail presence in Bangladesh.',
                'is_active' => true,
                'sort_order' => 6,
            ],
            [
                'title' => 'Branches & Outlets',
                'slug' => 'branches-outlets',
                'subtitle' => 'Visit our retail superstores in Dhaka, Chittagong, Sylhet, Khulna & Rajshahi',
                'page_type' => 'standard',
                'content' => '<h3>Dhaka Outlets</h3><ul><li><strong>IDB Bhaban Superstore:</strong> Shop # SR-116, 1st Floor, BCS Computer City, Agargaon, Dhaka.</li><li><strong>Multiplan Center:</strong> Level # 9, Shop # 975, Multiplan Center, New Elephant Road, Dhaka.</li><li><strong>Uttara Branch:</strong> Level # 4, RAK Tower, Jashimuddin Avenue, Sector 3, Uttara, Dhaka.</li><li><strong>Mirpur Branch:</strong> 2nd Floor, Green View Tower, Section 10, Mirpur, Dhaka.</li></ul><h3>Chattogram Outlets</h3><ul><li><strong>Agrabad Branch:</strong> Yunusco City Center, Level 2, CDA Avenue, Chattogram.</li></ul><h3>Sylhet Outlet</h3><ul><li><strong>Zindabazar Branch:</strong> Level 3, Al-Hamra Shopping City, Zindabazar, Sylhet.</li></ul>',
                'meta_title' => 'Branches & Outlets - Star Tech',
                'meta_description' => 'Find the nearest Star Tech branch location, address, phone number, and opening hours.',
                'is_active' => true,
                'sort_order' => 7,
            ],
            [
                'title' => 'Terms and Conditions',
                'slug' => 'terms-conditions',
                'subtitle' => 'Store purchasing terms, return policies and warranty guidelines',
                'page_type' => 'standard',
                'content' => '<p>Please read these terms and conditions carefully before ordering from Star Tech website or visiting our branches.</p><h3>Pricing & Availability</h3><p>Prices and stock availability of computer components fluctuate with global market conditions and currency rates. Star Tech reserves the right to adjust prices or cancel orders in case of typographical errors or stock depletion.</p><h3>Warranty & RMA</h3><p>All warranty claims are handled strictly according to the official manufacturer / importer policies. Physical damage, burn marks, liquid spill, or broken warranty seals void product warranty.</p>',
                'meta_title' => 'Terms and Conditions - Star Tech',
                'meta_description' => 'Official terms and conditions of Star Tech e-commerce store and retail branches.',
                'is_active' => true,
                'sort_order' => 8,
            ],
            [
                'title' => 'Privacy Policy',
                'slug' => 'privacy-policy',
                'subtitle' => 'How we safeguard customer personal data and privacy',
                'page_type' => 'standard',
                'content' => '<p>Star Tech & Engineering Ltd respects your privacy and is dedicated to protecting customer data. We only collect details essential for processing orders, courier delivery, SMS notifications, and security verification.</p><p>We do not sell, rent, or trade your personal information to third-party marketing companies.</p>',
                'meta_title' => 'Privacy Policy - Star Tech',
                'meta_description' => 'Star Tech privacy policy explaining data protection and customer security.',
                'is_active' => true,
                'sort_order' => 9,
            ],
        ];

        foreach ($pages as $p) {
            Page::updateOrCreate(['slug' => $p['slug']], $p);
        }
    }
}

<?php
/**
 * Magical Plugin Activation - Example Implementation
 * 
 * This file demonstrates how to integrate the Magical Plugin Activation toolkit
 * into your WordPress theme. This is a complete example showing various use cases
 * and implementation patterns.
 * 
 * @package magical_plugin_activation
 * @version 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * STEP 1: Include the Magical Plugin Activation library
 * Add this to your theme's functions.php file
 */

// Include the library (adjust path as needed)
require_once get_template_directory() . '/libs/magical-plugin-activation/class-magical-plugin-activation.php';


/**
 * STEP 2: Define your theme's required and recommended plugins
 * Use the main filter to define your complete plugin list
 */

function mytheme_recommended_plugins($plugins) {
    $theme_plugins = array(
        
        // REQUIRED PLUGINS (Essential for theme functionality)
        'elementor' => array(
            'name'        => __('Elementor', 'mytheme'),
            'slug'        => 'elementor',
            'file'        => 'elementor/elementor.php',
            'description' => __('The most advanced frontend drag & drop page builder. Create high-end, pixel perfect websites.', 'mytheme'),
            'category'    => 'Page Builder',
            'required'    => true,
            'featured'    => true,
            'is_local'    => false,
        ),
        
        'contact-form-7' => array(
            'name'        => __('Contact Form 7', 'mytheme'),
            'slug'        => 'contact-form-7',
            'file'        => 'contact-form-7/wp-contact-form-7.php',
            'description' => __('Just another contact form plugin. Simple but flexible.', 'mytheme'),
            'category'    => 'Forms',
            'required'    => true,
            'featured'    => false,
            'is_local'    => false,
        ),
        
        // RECOMMENDED PLUGINS (Enhance theme experience)
        'magical-addons-for-elementor' => array(
            'name'        => __('Magical Addons For Elementor', 'mytheme'),
            'slug'        => 'magical-addons-for-elementor',
            'file'        => 'magical-addons-for-elementor/magical-addons-for-elementor.php',
            'description' => __('Magical Addons for Elementor is a collection of premium quality addons or widgets for Elementor page builder.', 'mytheme'),
            'category'    => 'Page Builder',
            'required'    => false,
            'featured'    => true,
            'is_local'    => false,
        ),
        
        'magical-posts-display' => array(
            'name'        => __('Magical Posts Display', 'mytheme'),
            'slug'        => 'magical-posts-display',
            'file'        => 'magical-posts-display/magical-posts-display.php',
            'description' => __('Display posts in beautiful layouts with various customization options. Perfect for blogs, news sites, and portfolios.', 'mytheme'),
            'category'    => 'Content Display',
            'required'    => false,
            'featured'    => true,
            'is_local'    => false,
        ),
        
        // LOCAL/PREMIUM PLUGIN (Bundled with theme)
        /* 'mytheme-core' => array(
            'name'        => __('MyTheme Core Plugin', 'mytheme'),
            'slug'        => 'mytheme-core',
            'file'        => 'mytheme-core/mytheme-core.php',
            'description' => __('Core functionality plugin for MyTheme. Provides custom post types, widgets, and theme features.', 'mytheme'),
            'category'    => 'Theme Core',
            'required'    => true,
            'featured'    => true,
            'is_local'    => true,
            'source'      => get_template_directory() . '/libs/plugins/mytheme-core.zip',
            'version'     => '1.2.0', // Minimum required version
        ), */
      
        
    );

    return array_merge($plugins, $theme_plugins);
}
add_filter('magical_plugin_activation_recommended_plugins', 'mytheme_recommended_plugins');

/**
 * STEP 3: Advanced Usage Examples
 * Demonstrate different ways to use the available filters
 */

/**
 * Example 1: Add plugins conditionally based on WooCommerce availability
 */
function mytheme_conditional_plugins($plugins) {
    // Ensure is_plugin_active() function is available
    if (!function_exists('is_plugin_active')) {
        include_once(ABSPATH . 'wp-admin/includes/plugin.php');
    }
    
    // Only add WooCommerce plugins if WooCommerce is active or installed
    if (class_exists('WooCommerce') || is_plugin_active('woocommerce/woocommerce.php')) {
        $ecommerce_plugins = array(
            'woocommerce-payments' => array(
                'name'        => __('WooCommerce Payments', 'mytheme'),
                'slug'        => 'woocommerce-payments',
                'file'        => 'woocommerce-payments/woocommerce-payments.php',
                'description' => __('Secure payments made simple. Accept credit/debit cards and local payment methods.', 'mytheme'),
                'category'    => 'eCommerce',
                'required'    => false,
                'featured'    => true,
                'is_local'    => false,
            ),
            'magical-products-display' => array(
                'name'        => __('Magical Products Display', 'mytheme'),
                'slug'        => 'magical-products-display',
                'file'        => 'magical-products-display/magical-products-display.php',
                'description' => __('Display WooCommerce products in beautiful layouts with various customization options. Perfect for online stores and product showcases.', 'mytheme'),
                'category'    => 'eCommerce',
                'required'    => false,
                'featured'    => true,
                'is_local'    => false,
            ),
        );
        
        $plugins = array_merge($plugins, $ecommerce_plugins);
    }
    
    return $plugins;
}
add_filter('magical_plugin_activation_add_recommended_plugins', 'mytheme_conditional_plugins');




/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Copy this example file to your theme directory
 * 2. Include the relevant parts in your functions.php
 * 3. Customize the plugin array with your own plugins
 * 4. Test the functionality in your WordPress admin
 * 5. Adjust styling and behavior as needed
 * 
 * NOTES:
 * - Replace 'mytheme' with your actual theme textdomain
 * - Ensure all plugin slugs and file paths are correct
 * - Test local plugin installation with actual ZIP files
 * - Always check user capabilities before showing admin interfaces
 * - Use proper WordPress coding standards and security practices
 */
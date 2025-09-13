# Magical Plugin Activation

A powerful and modern WordPress theme toolkit for managing plugin recommendations and requirements. This library serves as a lightweight, feature-rich alternative to TGM Plugin Activation (TGMPA) with enhanced user experience and modern AJAX functionality.

## 🚀 Features

### Core Functionality
- **One-click AJAX Plugin Installation** - Install and activate plugins without page reloads
- **Automatic Plugin Updates** - Handle both WordPress.org and local plugin updates
- **Bulk Operations** - Install multiple required or recommended plugins at once
- **Smart Admin Notices** - Contextual notifications with dismiss functionality
- **Local Plugin Support** - Install plugins from ZIP files bundled with themes
- **Version Management** - Check and enforce minimum plugin versions

### User Experience
- **Tabbed Plugin Interface** - Filter plugins by status (All, Featured, Required, Active, Inactive, Not Installed)
- **Real-time Status Updates** - Live plugin status tracking and visual feedback
- **Smart Dismissal System** - Time-based notice re-showing (7 days for required, 30 days for recommended)
- **Responsive Admin Page** - Mobile-friendly plugin management interface
- **Visual Plugin Cards** - Clean, organized plugin display with badges and categories

### Developer Features
- **Extensive Filter Hooks** - Customize plugin lists programmatically
- **Theme Integration** - Seamlessly integrate with any WordPress theme
- **Auto-installation** - Automatically install required plugins on theme activation
- **Background Processing** - Silent plugin operations without UI interruption
- **Error Handling** - Robust error management and fallback mechanisms

## 📦 Installation

### For Theme Developers

1. **Copy the library to your theme:**
   ```
   your-theme/
   ├── libs/
   │   └── magical-plugin-activation/
   │       ├── class-magical-plugin-activation.php
   │       ├── assets/
   │       │   ├── css/admin-plugins.css
   │       │   └── js/admin-plugins.js
   │       ├── README.md
   │       └── example.php
   ```

2. **Include the library in your theme's functions.php:**
   ```php
   // Include Magical Plugin Activation
   require_once get_template_directory() . '/libs/magical-plugin-activation/class-magical-plugin-activation.php';

   ```

3. **Configure your plugins using WordPress filters (see Usage section below)**

## 🎯 Usage

### Basic Configuration

Use WordPress filters to define your required and recommended plugins:

```php
/**
 * Add recommended plugins for your theme
 */
function your_theme_recommended_plugins($plugins) {
    $theme_plugins = array(
        'elementor' => array(
            'name'        => 'Elementor',
            'slug'        => 'elementor',
            'file'        => 'elementor/elementor.php',
            'description' => 'The most advanced frontend drag & drop page builder.',
            'category'    => 'Page Builder',
            'required'    => true,
            'featured'    => true,
            'is_local'    => false,
        ),
        'contact-form-7' => array(
            'name'        => 'Contact Form 7',
            'slug'        => 'contact-form-7',
            'file'        => 'contact-form-7/wp-contact-form-7.php',
            'description' => 'Just another contact form plugin.',
            'category'    => 'Forms',
            'required'    => false,
            'featured'    => true,
            'is_local'    => false,
        ),
    );

    return array_merge($plugins, $theme_plugins);
}
add_filter('magical_plugin_activation_recommended_plugins', 'your_theme_recommended_plugins');
```

### Advanced Configuration

#### Local Plugin Support
```php
function your_theme_local_plugins($plugins) {
    $local_plugins = array(
        'your-premium-plugin' => array(
            'name'        => 'Your Premium Plugin',
            'slug'        => 'your-premium-plugin',
            'file'        => 'your-premium-plugin/your-premium-plugin.php',
            'description' => 'Premium plugin bundled with theme.',
            'category'    => 'Premium',
            'required'    => true,
            'featured'    => true,
            'is_local'    => true,
            'source'      => get_template_directory() . '/libs/plugins/your-premium-plugin.zip',
            'version'     => '1.0.0',
        ),
    );

    return array_merge($plugins, $local_plugins);
}
add_filter('magical_plugin_activation_recommended_plugins', 'your_theme_local_plugins');
```

#### Plugin Configuration Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `name` | string | Yes | Display name of the plugin |
| `slug` | string | Yes | WordPress.org plugin slug |
| `file` | string | Yes | Path to main plugin file (relative to plugins directory) |
| `description` | string | Yes | Plugin description |
| `category` | string | Yes | Plugin category for organization |
| `required` | boolean | Yes | Whether plugin is required or recommended |
| `featured` | boolean | Yes | Whether to show featured badge |
| `is_local` | boolean | Yes | Whether plugin is bundled locally |
| `source` | string | No | Path to local ZIP file (required if `is_local` is true) |
| `version` | string | No | Minimum required version |

## 🔧 Available Filters

### Plugin Management Filters

#### `magical_plugin_activation_recommended_plugins`
Modify the complete list of recommended plugins.

```php
add_filter('magical_plugin_activation_recommended_plugins', function($plugins) {
    // Modify existing plugins or add new ones
    $plugins['new-plugin'] = array(
        'name' => 'New Plugin',
        'slug' => 'new-plugin',
        // ... other parameters
    );
    
    // Remove a plugin
    unset($plugins['unwanted-plugin']);
    
    return $plugins;
});
```

#### `magical_plugin_activation_add_recommended_plugins`
Add additional plugins to the existing list.

```php
add_filter('magical_plugin_activation_add_recommended_plugins', function($plugins) {
    $additional_plugins = array(
        'additional-plugin' => array(
            'name' => 'Additional Plugin',
            'slug' => 'additional-plugin',
            // ... other parameters
        ),
    );
    
    return array_merge($plugins, $additional_plugins);
});
```

#### `magical_plugin_activation_filter_plugins_by_category`
Filter plugins based on categories or other criteria.

```php
add_filter('magical_plugin_activation_filter_plugins_by_category', function($plugins) {
    // Only show SEO and Security plugins
    $allowed_categories = array('SEO', 'Security');
    
    return array_filter($plugins, function($plugin) use ($allowed_categories) {
        return in_array($plugin['category'], $allowed_categories);
    });
});
```

## 🎨 User Interface

### Admin Page Location
- **Dashboard** → **Appearance** → **Recommended Plugins**

### Plugin Status Indicators
- **Active** - Plugin is installed and active
- **Inactive** - Plugin is installed but not active
- **Not Installed** - Plugin needs to be installed
- **Update Available** - Plugin has an available update
- **Featured** - Highlighted recommended plugin
- **Required** - Essential plugin for theme functionality
- **Local** - Plugin bundled with theme

### Admin Notices
- **Required Plugins Notice** - Shows when required plugins are missing
- **Recommended Plugins Notice** - Shows when recommended plugins are available
- **Update Notice** - Shows when plugin updates are available

## 🔄 Auto-Installation Features

### Theme Activation
Required plugins are automatically installed when the theme is activated (if user has appropriate permissions).

### Background Checks
The system periodically checks for missing required plugins and attempts to install them automatically.

### Silent Installation
Plugins can be installed silently in the background without UI interruption.

## 🛠️ Customization

### Custom Styling
Override the default styles by enqueueing your own CSS:

```php
function your_theme_plugin_activation_styles() {
    wp_enqueue_style(
        'your-theme-plugin-activation',
        get_template_directory_uri() . '/assets/css/custom-plugin-activation.css',
        array('magical-plugin-activation-plugins-admin'),
        '1.0.0'
    );
}
add_action('admin_enqueue_scripts', 'your_theme_plugin_activation_styles');
```

### Custom JavaScript
Add custom functionality:

```php
function your_theme_plugin_activation_scripts() {
    wp_enqueue_script(
        'your-theme-plugin-activation',
        get_template_directory_uri() . '/assets/js/custom-plugin-activation.js',
        array('magical-plugin-activation-plugins-admin'),
        '1.0.0',
        true
    );
}
add_action('admin_enqueue_scripts', 'your_theme_plugin_activation_scripts');
```

## 🆚 Comparison with TGM Plugin Activation

| Feature | Magical Plugin Activation | TGM Plugin Activation |
|---------|--------------------------|----------------------|
| AJAX Operations | ✅ Full AJAX support | ❌ Page reloads required |
| Modern UI | ✅ Tabbed interface, cards | ❌ Basic list view |
| Auto-updates | ✅ Plugin update management | ❌ No update handling |
| Local Plugins | ✅ ZIP file support | ✅ Basic support |
| Bulk Operations | ✅ Install multiple at once | ❌ One by one |
| Smart Notices | ✅ Time-based dismissal | ❌ Simple dismissal |
| Version Checking | ✅ Minimum version enforcement | ❌ No version checking |
| Background Install | ✅ Silent installation | ❌ Always requires UI |
| Mobile Responsive | ✅ Fully responsive | ❌ Desktop focused |
| Filter Hooks | ✅ Multiple filter points | ✅ Basic filtering |

## 📋 Requirements

- **WordPress:** 5.0 or higher
- **PHP:** 7.4 or higher
- **Permissions:** Users need `install_plugins` and `activate_plugins` capabilities
- **Optional:** ZipArchive PHP extension (for local plugin installation, has fallbacks)

## 🔒 Security Features

- **Nonce Verification** - All AJAX requests are protected with WordPress nonces
- **Capability Checks** - User permissions verified for all operations
- **Input Sanitization** - All user inputs are properly sanitized
- **Error Handling** - Graceful error handling prevents system exposure

## 🐛 Troubleshooting

### Common Issues

**Local plugins not installing:**
- Verify ZIP file exists at specified path
- Check plugins directory write permissions
- Ensure ZipArchive is available or fallback methods work

**AJAX requests failing:**
- Check browser console for JavaScript errors
- Verify WordPress admin-ajax.php is accessible
- Confirm user has required capabilities

**Plugins not auto-installing:**
- Check if user has `install_plugins` capability
- Verify theme activation hooks are working
- Check WordPress transients aren't being cleared too frequently

### Debug Mode
Enable WordPress debug mode to see detailed error messages:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
```

## 🤝 Contributing

This toolkit is designed for theme developers. Contributions and suggestions are welcome:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

This library is released under the GPL v2 or later license, same as WordPress.

##  Credits

Inspired by TGM Plugin Activation but built from the ground up with modern WordPress development practices and enhanced user experience in mind.

---

**Note:** This is a theme development toolkit, not a standalone plugin. It should be included with WordPress themes to provide plugin recommendation functionality. need to change text domain 'mytheme' to your theme 'text-domain'
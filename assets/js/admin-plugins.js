/**
 * Shop Toolkit Pro Plugin Recommendations Admin JavaScript
 */

(function($) {
    'use strict';

    $(document).ready(function() {
        // Initialize plugin recommendations
        PluginRecommendations.init();
    });

    var PluginRecommendations = {
        
        init: function() {
            this.bindEvents();
            this.initFilters();
            
            // Check if recommended plugins notice should be hidden
            if (window.location.href.indexOf('wp-admin') !== -1) {
                this.checkRecommendedPluginsStatus();
            }
        },

        bindEvents: function() {
            // Install plugin
            $(document).on('click', '.install-plugin', this.installPlugin);
            
            // Activate plugin
            $(document).on('click', '.activate-plugin', this.activatePlugin);
            
            // Update plugin
            $(document).on('click', '.update-plugin', this.updatePlugin);
            
            // Filter tabs
            $(document).on('click', '.filter-tab', this.filterPlugins);
            
            // Dismiss install notice - Handle .install-dismiss buttons and #install-dismiss ID
            $(document).on('click', '.install-dismiss, #install-dismiss', this.dismissInstallNotice);
            
            // Bulk install required plugins
            $(document).on('click', '#install-required-plugins', this.bulkInstallRequired);
            
            // Bulk install recommended plugins
            $(document).on('click', '#install-recommended-plugins', this.bulkInstallRecommended);
            
            // Update all plugins
            $(document).on('click', '#update-all-plugins', this.updateAllPlugins);
        },

        initFilters: function() {
            // Set initial counts
            this.updateFilterCounts();
        },

        installPlugin: function(e) {
            e.preventDefault();
            
            var $button = $(this);
            var slug = $button.data('slug');
            var isLocal = $button.data('is-local') === 1;
            var originalText = $button.text();
            
            // Disable button and show loading
            $button.addClass('loading').prop('disabled', true);
            
            $.ajax({
                url: MagicalPluginActivation.ajaxurl,
                type: 'POST',
                data: {
                    action: 'magical_plugin_activation_install_plugin',
                    slug: slug,
                    is_local: isLocal ? '1' : '0',
                    nonce: MagicalPluginActivation.nonce
                },
                success: function(response) {
                    if (response.success) {
                        PluginRecommendations.showMessage($button, response.data.message || MagicalPluginActivation.strings.installed, 'success');
                        
                        // Update plugin status
                        setTimeout(function() {
                            PluginRecommendations.updatePluginStatus(slug, 'inactive');
                            
                            // Auto-activate the plugin
                            $button.removeClass('loading').trigger('click');
                        }, 1000);
                    } else {
                        PluginRecommendations.showMessage($button, response.data.message || MagicalPluginActivation.strings.error, 'error');
                        $button.removeClass('loading').prop('disabled', false);
                    }
                },
                error: function() {
                    PluginRecommendations.showMessage($button, MagicalPluginActivation.strings.error, 'error');
                    $button.removeClass('loading').prop('disabled', false);
                }
            });
        },

        activatePlugin: function(e) {
            e.preventDefault();
            
            var $button = $(this);
            var file = $button.data('file');
            var slug = $button.data('slug');
            var originalText = $button.text();
            
            // Disable button and show loading
            $button.addClass('loading').prop('disabled', true);
            
            $.ajax({
                url: MagicalPluginActivation.ajaxurl,
                type: 'POST',
                data: {
                    action: 'magical_plugin_activation_activate_plugin',
                    file: file,
                    nonce: MagicalPluginActivation.nonce
                },
                success: function(response) {
                    if (response.success) {
                        PluginRecommendations.showMessage($button, MagicalPluginActivation.strings.activated, 'success');
                        
                        // Update plugin status
                        setTimeout(function() {
                            PluginRecommendations.updatePluginStatus(slug, 'active');
                            
                            // Check if all recommended plugins are now active
                            PluginRecommendations.checkRecommendedPluginsStatus();
                            
                            // Reload page after activation to refresh plugin status
                            setTimeout(function() {
                                location.reload();
                            }, 2000);
                        }, 1000);
                    } else {
                        PluginRecommendations.showMessage($button, response.data || MagicalPluginActivation.strings.error, 'error');
                        $button.removeClass('loading').prop('disabled', false);
                    }
                },
                error: function() {
                    PluginRecommendations.showMessage($button, MagicalPluginActivation.strings.error, 'error');
                    $button.removeClass('loading').prop('disabled', false);
                }
            });
        },

        updatePlugin: function(e) {
            e.preventDefault();
            
            var $button = $(this);
            var slug = $button.data('slug');
            var file = $button.data('file');
            var isLocal = $button.data('is-local') === 1;
            var originalText = $button.text();
            
            // Disable button and show loading
            $button.addClass('loading').prop('disabled', true);
            
            $.ajax({
                url: MagicalPluginActivation.ajaxurl,
                type: 'POST',
                data: {
                    action: 'magical_plugin_activation_update_plugin',
                    slug: slug,
                    file: file,
                    is_local: isLocal ? '1' : '0',
                    nonce: MagicalPluginActivation.nonce
                },
                success: function(response) {
                    if (response.success) {
                        PluginRecommendations.showMessage($button, response.data.message || MagicalPluginActivation.strings.updated, 'success');
                        
                        // Update plugin status to active (since it was reactivated)
                        setTimeout(function() {
                            PluginRecommendations.updatePluginStatus(slug, 'active');
                            
                            // Check if all recommended plugins are now active
                            PluginRecommendations.checkRecommendedPluginsStatus();
                        }, 1000);
                    } else {
                        PluginRecommendations.showMessage($button, response.data.message || MagicalPluginActivation.strings.error, 'error');
                        $button.removeClass('loading').prop('disabled', false);
                    }
                },
                error: function() {
                    PluginRecommendations.showMessage($button, MagicalPluginActivation.strings.error, 'error');
                    $button.removeClass('loading').prop('disabled', false);
                }
            });
        },

        filterPlugins: function(e) {
            e.preventDefault();
            
            var $tab = $(this);
            var filter = $tab.data('filter');
            
            // Update active tab
            $('.filter-tab').removeClass('active');
            $tab.addClass('active');
            
            // Filter plugin cards
            $('.plugin-card').each(function() {
                var $card = $(this);
                var status = $card.data('status');
                var featured = $card.data('featured');
                var required = $card.data('required');
                var show = false;
                
                switch (filter) {
                    case 'all':
                        show = true;
                        break;
                    case 'featured':
                        show = featured == 1;
                        break;
                    case 'required':
                        show = required == 1;
                        break;
                    case 'active':
                        show = status === 'active';
                        break;
                    case 'inactive':
                        show = status === 'inactive';
                        break;
                    case 'not-installed':
                        show = status === 'not-installed';
                        break;
                }
                
                if (show) {
                    $card.removeClass('hidden').fadeIn(300);
                } else {
                    $card.addClass('hidden').fadeOut(300);
                }
            });
            
            // Update URL without reloading
            if (history.pushState) {
                var newUrl = window.location.href.split('?')[0] + '?page=magical-plugin-activation-plugins';
                if (filter !== 'all') {
                    newUrl += '&filter=' + filter;
                }
                history.pushState(null, null, newUrl);
            }
        },

        updateFilterCounts: function() {
            var counts = {
                all: 0,
                featured: 0,
                required: 0,
                active: 0,
                inactive: 0,
                'not-installed': 0
            };
            
            $('.plugin-card').each(function() {
                var $card = $(this);
                var status = $card.data('status');
                var featured = $card.data('featured');
                var required = $card.data('required');
                
                counts.all++;
                counts[status]++;
                
                if (featured == 1) {
                    counts.featured++;
                }
                
                if (required == 1) {
                    counts.required++;
                }
            });
            
            // Update tab text with counts
            $('.filter-tab').each(function() {
                var $tab = $(this);
                var filter = $tab.data('filter');
                var count = counts[filter];
                var baseText = $tab.text().split(' (')[0];
                
                if (count > 0) {
                    $tab.text(baseText + ' (' + count + ')');
                } else {
                    $tab.text(baseText);
                }
            });
        },

        showMessage: function($button, message, type) {
            var $card = $button.closest('.plugin-card');
            var $message = $('<div class="plugin-message"></div>')
                .text(message)
                .addClass(type === 'error' ? 'error' : '')
                .appendTo($card);
            
            // Show message
            setTimeout(function() {
                $message.addClass('show');
            }, 100);
            
            // Hide message after 3 seconds
            setTimeout(function() {
                $message.removeClass('show');
                setTimeout(function() {
                    $message.remove();
                }, 300);
            }, 3000);
        },

        // NEW: dismissInstallNotice function to handle .install-dismiss button clicks
        dismissInstallNotice: function(e) {
            e.preventDefault();
            var $button = $(this);
            var $notice = $button.closest('.notice');
            // Determine notice type based on CSS class
            var noticeType = 'recommended'; // default
            if ($notice.hasClass('magical-plugin-activation-pro-recommended-notice')) {
                noticeType = 'recommended';
            } else if ($notice.hasClass('magical-plugin-activation-pro-update-notice')) {
                noticeType = 'update';
            } else if ($notice.hasClass('magical-plugin-activation-pro-required-notice')) {
                noticeType = 'install'; // Use 'install' for required plugins notice
            }

            // Two-step dismiss for required plugins
            if (noticeType === 'install') {
                if (!$button.data('confirm-dismiss')) {
                    // First click: show warning, do not dismiss
                    // Remove any previous warning
                    $notice.find('.magical-plugin-activation-required-warning').remove();
                    // Add warning message
                    var warning = $('<div class="magical-plugin-activation-required-warning" style="color:#b71c1c; margin-top:8px; font-weight:bold;">'+
                        (MagicalPluginActivation && MagicalPluginActivation.strings && MagicalPluginActivation.strings.requiredWarning ? MagicalPluginActivation.strings.requiredWarning :
                        'You must install and activate all required plugins before dismissing this notice. Click Dismiss again to hide this warning.')+
                        '</div>');
                    $notice.find('p').append(warning);
                    $button.data('confirm-dismiss', true);
                    return;
                }
                // Second click: proceed with AJAX and dismiss
            }

            // Send AJAX request to hide notice permanently
            var requestData = {
                action: 'magical_plugin_activation_dismiss_plugin_notice',
                nonce: MagicalPluginActivation.nonce
            };
            // Add notice_type or use specific action for different notices
            if (noticeType === 'update') {
                requestData.action = 'magical_plugin_activation_dismiss_update_notice';
            } else if (noticeType === 'install') {
                requestData.action = 'magical_plugin_activation_dismiss_install_notice';
            } else {
                requestData.notice_type = noticeType;
            }
            $.post(MagicalPluginActivation.ajaxurl, requestData);
            // Hide the notice with animation
            $notice.fadeOut(300, function() {
                $(this).remove();
            });
        },

        bulkInstallRequired: function(e) {
            e.preventDefault();
            
            var $button = $(this);
            var originalText = $button.text();
            
            // Disable button and show loading
            $button.addClass('loading').prop('disabled', true);
            
            // Add progress indicator
            var $progress = $('<div class="bulk-install-progress active"><div class="progress-bar"><div class="progress-fill"></div></div><div class="progress-text">Preparing to install required plugins...</div></div>');
            $button.after($progress);
            
            // Animate progress bar from 0% to 30% while waiting for response
            setTimeout(function() {
                $progress.find('.progress-fill').css('width', '30%');
                $progress.find('.progress-text').text('Installing required plugins...');
            }, 200);
            
            // Simulate additional progress steps
            setTimeout(function() {
                if ($progress.find('.progress-fill').css('width') === '30%') {
                    $progress.find('.progress-fill').css('width', '60%');
                    $progress.find('.progress-text').text('Activating plugins...');
                }
            }, 2000);
            
            setTimeout(function() {
                if ($progress.find('.progress-fill').css('width') === '60%') {
                    $progress.find('.progress-fill').css('width', '80%');
                    $progress.find('.progress-text').text('Finalizing installation...');
                }
            }, 4000);
            
            $.ajax({
                url: MagicalPluginActivation.ajaxurl,
                type: 'POST',
                data: {
                    action: 'magical_plugin_activation_install_required_plugins',
                    nonce: MagicalPluginActivation.nonce
                },
                success: function(response) {
                    $button.removeClass('loading').prop('disabled', false);
                    
                    if (response.success) {
                        // Animate progress to 100%
                        $progress.find('.progress-fill').css('width', '100%');
                        $progress.find('.progress-text').text('All required plugins installed and activated!');
                        
                        // Show success message
                        var $notice = $('<div class="notice notice-success is-dismissible"><p>' + response.data.message + '</p></div>');
                        $('.magical-plugin-activation-plugins h1').after($notice);
                        
                        // Hide progress after 2 seconds
                        setTimeout(function() {
                            $progress.fadeOut(300, function() {
                                $(this).remove();
                            });
                        }, 2000);
                        
                        // Hide the install button and warning notice
                        $button.closest('.notice').fadeOut(300);
                        
                        // Refresh the page after 3 seconds to update plugin status
                        setTimeout(function() {
                            location.reload();
                        }, 3000);
                        
                    } else {
                        // Show error message
                        var $notice = $('<div class="notice notice-error is-dismissible"><p>' + response.data.message + '</p></div>');
                        $('.magical-plugin-activation-plugins h1').after($notice);
                        
                        $progress.remove();
                    }
                },
                error: function() {
                    $button.removeClass('loading').prop('disabled', false);
                    
                    // Show error message
                    var $notice = $('<div class="notice notice-error is-dismissible"><p>An error occurred while installing plugins. Please try again.</p></div>');
                    $('.magical-plugin-activation-plugins h1').after($notice);
                    
                    $progress.remove();
                }
            });
        },

        bulkInstallRecommended: function(e) {
            e.preventDefault();
            
            var $button = $(this);
            var originalText = $button.text();
            
            // Disable button and show loading
            $button.addClass('loading').prop('disabled', true);
            
            // Add progress indicator
            var $progress = $('<div class="bulk-install-progress active"><div class="progress-bar"><div class="progress-fill"></div></div><div class="progress-text">Preparing to install recommended plugins...</div></div>');
            $button.after($progress);
            
            // Animate progress bar from 0% to 30% while waiting for response
            setTimeout(function() {
                $progress.find('.progress-fill').css('width', '30%');
                $progress.find('.progress-text').text('Installing recommended plugins...');
            }, 200);
            
            // Simulate additional progress steps
            setTimeout(function() {
                if ($progress.find('.progress-fill').css('width') === '30%') {
                    $progress.find('.progress-fill').css('width', '60%');
                    $progress.find('.progress-text').text('Activating plugins...');
                }
            }, 2000);
            
            setTimeout(function() {
                if ($progress.find('.progress-fill').css('width') === '60%') {
                    $progress.find('.progress-fill').css('width', '80%');
                    $progress.find('.progress-text').text('Finalizing installation...');
                }
            }, 4000);
            
            $.ajax({
                url: MagicalPluginActivation.ajaxurl,
                type: 'POST',
                data: {
                    action: 'magical_plugin_activation_install_recommended_plugins',
                    nonce: MagicalPluginActivation.nonce
                },
                success: function(response) {
                    $button.removeClass('loading').prop('disabled', false);
                    
                    if (response.success) {
                        // Animate progress to 100%
                        $progress.find('.progress-fill').css('width', '100%');
                        $progress.find('.progress-text').text('All recommended plugins installed and activated!');
                        
                        // Show success message
                        var $notice = $('<div class="notice notice-success is-dismissible"><p>' + response.data.message + '</p></div>');
                        $('h1').first().after($notice);
                        
                        // Hide progress after 2 seconds
                        setTimeout(function() {
                            $progress.fadeOut(300, function() {
                                $(this).remove();
                            });
                        }, 2000);
                        
                        // Hide the recommended notice immediately
                        $button.closest('.notice').fadeOut(300, function() {
                            $(this).remove();
                        });
                        
                        // Refresh the page after 3 seconds to update plugin status
                        setTimeout(function() {
                            location.reload();
                        }, 3000);
                        
                    } else {
                        // Show error message
                        var $notice = $('<div class="notice notice-error is-dismissible"><p>' + response.data.message + '</p></div>');
                        $('h1').first().after($notice);
                        
                        $progress.remove();
                    }
                },
                error: function() {
                    $button.removeClass('loading').prop('disabled', false);
                    
                    // Show error message
                    var $notice = $('<div class="notice notice-error is-dismissible"><p>An error occurred while installing plugins. Please try again.</p></div>');
                    $('h1').first().after($notice);
                    
                    $progress.remove();
                }
            });
        },

        updateAllPlugins: function(e) {
            e.preventDefault();
            
            var $button = $(this);
            var originalText = $button.text();
            
            // Disable button and show loading
            $button.addClass('loading').prop('disabled', true).text(MagicalPluginActivation.strings.updating);
            
            // Show progress bar
            PluginRecommendations.showBulkProgress($button, 'Updating plugins...');
            
            // Get all plugins that need updates
            var $updateButtons = $('.update-plugin');
            var total = $updateButtons.length;
            var completed = 0;
            
            if (total === 0) {
                PluginRecommendations.showMessage($button, 'No plugins need updates', 'info');
                $button.removeClass('loading').prop('disabled', false).text(originalText);
                return;
            }
            
            // Update each plugin
            $updateButtons.each(function() {
                var $updateBtn = $(this);
                var slug = $updateBtn.data('slug');
                var file = $updateBtn.data('file');
                var isLocal = $updateBtn.data('is-local');
                
                $.ajax({
                    url: MagicalPluginActivation.ajaxurl,
                    type: 'POST',
                    data: {
                        action: 'magical_plugin_activation_update_plugin',
                        slug: slug,
                        file: file,
                        is_local: isLocal,
                        nonce: MagicalPluginActivation.nonce
                    },
                    success: function(response) {
                        completed++;
                        
                        if (response.success) {
                            PluginRecommendations.updatePluginStatus(slug, 'active');
                        }
                        
                        // Update progress
                        var progress = Math.round((completed / total) * 100);
                        PluginRecommendations.updateBulkProgress(progress);
                        
                        // Check if all updates are complete
                        if (completed === total) {
                            setTimeout(function() {
                                PluginRecommendations.hideBulkProgress();
                                PluginRecommendations.showMessage($button, 'All plugins updated successfully!', 'success');
                                $button.removeClass('loading').prop('disabled', false).text(originalText);
                                
                                // Hide update notices
                                $('.magical-plugin-activation-pro-update-notice').fadeOut(300, function() {
                                    $(this).remove();
                                });
                                
                                // Refresh page to update plugin status
                                setTimeout(function() {
                                    window.location.reload();
                                }, 1500);
                            }, 500);
                        }
                    },
                    error: function() {
                        completed++;
                        
                        // Update progress
                        var progress = Math.round((completed / total) * 100);
                        PluginRecommendations.updateBulkProgress(progress);
                        
                        // Check if all updates are complete
                        if (completed === total) {
                            setTimeout(function() {
                                PluginRecommendations.hideBulkProgress();
                                PluginRecommendations.showMessage($button, 'Some plugins failed to update', 'error');
                                $button.removeClass('loading').prop('disabled', false).text(originalText);
                            }, 500);
                        }
                    }
                });
            });
        },

        checkRecommendedPluginsStatus: function() {
            // Check via AJAX if all recommended plugins are active
            $.ajax({
                url: MagicalPluginActivation.ajaxurl,
                type: 'POST',
                data: {
                    action: 'magical_plugin_activation_check_recommended_plugins_status',
                    nonce: MagicalPluginActivation.nonce
                },
                success: function(response) {
                    if (response.success && response.data.all_active) {
                        // Hide recommended notice if all plugins are active
                        $('.magical-plugin-activation-pro-plugin-notice').fadeOut(300, function() {
                            $(this).remove();
                        });
                    }
                },
                error: function() {
                    // Fallback: check individual plugin cards if available
                    var allActive = true;
                    $('.plugin-card[data-featured="1"]').each(function() {
                        if ($(this).attr('data-status') !== 'active') {
                            allActive = false;
                            return false; // break
                        }
                    });
                    
                    if (allActive) {
                        $('.magical-plugin-activation-pro-plugin-notice').fadeOut(300, function() {
                            $(this).remove();
                        });
                    }
                }
            });
        }
    };

    // Expose to global scope for debugging
    window.PluginRecommendations = PluginRecommendations;

})(jQuery);
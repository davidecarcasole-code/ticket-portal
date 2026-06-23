<?php
function slm_theme_setup() {
    load_theme_textdomain('studio-legale-mandroneniglio', SLM_THEME_DIR . '/languages');

    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo', array(
        'height'      => 80,
        'width'       => 300,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    add_theme_support('html5', array(
        'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script',
    ));
    add_theme_support('customize-selective-refresh-widgets');
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');

    register_nav_menus(array(
        'primary' => __('Menu Principale', 'studio-legale-mandroneniglio'),
        'footer'  => __('Menu Footer', 'studio-legale-mandroneniglio'),
    ));

    set_post_thumbnail_size(800, 500, true);
    add_image_size('slm-hero', 1920, 800, true);
    add_image_size('slm-team', 400, 500, true);
    add_image_size('slm-gallery', 600, 400, true);
}
add_action('after_setup_theme', 'slm_theme_setup');

function slm_content_width() {
    $GLOBALS['content_width'] = apply_filters('slm_content_width', 800);
}
add_action('after_setup_theme', 'slm_content_width', 0);

function slm_register_sidebars() {
    register_sidebar(array(
        'name'          => __('Sidebar Principale', 'studio-legale-mandroneniglio'),
        'id'            => 'sidebar-main',
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
    for ($i = 1; $i <= 4; $i++) {
        register_sidebar(array(
            'name'          => sprintf(__('Footer Colonna %d', 'studio-legale-mandroneniglio'), $i),
            'id'            => "footer-{$i}",
            'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
            'after_widget'  => '</div>',
            'before_title'  => '<h4 class="footer-title">',
            'after_title'   => '</h4>',
        ));
    }
}
add_action('widgets_init', 'slm_register_sidebars');

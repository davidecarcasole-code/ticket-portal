<?php
function slm_enqueue_scripts() {
    $version = SLM_THEME_VERSION;

    wp_enqueue_style('slm-font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css', array(), '6.5.1');
    wp_enqueue_style('slm-google-fonts', 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Lato:wght@300;400;700;900&family=Playfair+Display:wght@400;500;600;700&display=swap', array(), null);
    wp_enqueue_style('slm-style', SLM_THEME_URI . '/assets/css/style.css', array(), $version);
    wp_enqueue_style('slm-main-style', get_stylesheet_uri(), array(), $version);

    wp_enqueue_script('slm-main', SLM_THEME_URI . '/assets/js/main.js', array(), $version, true);

    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'slm_enqueue_scripts');

function slm_login_enqueue() {
    wp_enqueue_style('slm-login', SLM_THEME_URI . '/assets/css/style.css', array(), SLM_THEME_VERSION);
}
add_action('login_enqueue_scripts', 'slm_login_enqueue');

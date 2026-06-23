<?php
function slm_breadcrumbs() {
    $home_text = __('Home', 'studio-legale-mandroneniglio');
    $sep = '<span class="breadcrumb-sep">&rsaquo;</span>';

    $breadcrumbs = array();
    $breadcrumbs[] = '<a href="' . esc_url(home_url('/')) . '">' . $home_text . '</a>';

    if (is_singular()) {
        $post_type = get_post_type_object(get_post_type());
        if ($post_type && $post_type->has_archive && !is_singular('post')) {
            $breadcrumbs[] = '<a href="' . esc_url(get_post_type_archive_link(get_post_type())) . '">' . $post_type->labels->name . '</a>';
        }
        $breadcrumbs[] = '<span class="current">' . get_the_title() . '</span>';
    } elseif (is_archive()) {
        $breadcrumbs[] = '<span class="current">' . get_the_archive_title() . '</span>';
    } elseif (is_search()) {
        $breadcrumbs[] = '<span class="current">' . sprintf(__('Ricerca: %s', 'studio-legale-mandroneniglio'), get_search_query()) . '</span>';
    } elseif (is_404()) {
        $breadcrumbs[] = '<span class="current">' . __('Pagina non trovata', 'studio-legale-mandroneniglio') . '</span>';
    } elseif (is_home()) {
        $breadcrumbs[] = '<span class="current">' . single_post_title('', false) . '</span>';
    }

    echo implode(' ' . $sep . ' ', $breadcrumbs);
}

function slm_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'slm_excerpt_length');

function slm_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'slm_excerpt_more');

function slm_body_classes($classes) {
    if (is_singular()) {
        $classes[] = 'singular';
    }
    if (is_active_sidebar('sidebar-main')) {
        $classes[] = 'has-sidebar';
    }
    return $classes;
}
add_filter('body_class', 'slm_body_classes');

function slm_custom_login_logo_url() {
    return home_url();
}
add_filter('login_headerurl', 'slm_custom_login_logo_url');

function slm_custom_login_logo_text() {
    return get_bloginfo('name');
}
add_filter('login_headertext', 'slm_custom_login_logo_text');

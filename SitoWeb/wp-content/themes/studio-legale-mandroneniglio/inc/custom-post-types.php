<?php
function slm_register_custom_post_types() {
    $team_labels = array(
        'name'               => __('Team', 'studio-legale-mandroneniglio'),
        'singular_name'      => __('Membro del Team', 'studio-legale-mandroneniglio'),
        'add_new'            => __('Aggiungi Membro', 'studio-legale-mandroneniglio'),
        'add_new_item'       => __('Aggiungi Nuovo Membro', 'studio-legale-mandroneniglio'),
        'edit_item'          => __('Modifica Membro', 'studio-legale-mandroneniglio'),
        'view_item'          => __('Vedi Membro', 'studio-legale-mandroneniglio'),
        'search_items'       => __('Cerca Membro', 'studio-legale-mandroneniglio'),
        'menu_name'          => __('Team', 'studio-legale-mandroneniglio'),
    );
    register_post_type('slm_team', array(
        'labels'       => $team_labels,
        'public'       => true,
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-groups',
        'supports'     => array('title', 'editor', 'thumbnail', 'excerpt', 'page-attributes'),
        'has_archive'  => false,
        'rewrite'      => array('slug' => 'team'),
        'menu_position' => 20,
    ));

    $service_labels = array(
        'name'               => __('Servizi Legali', 'studio-legale-mandroneniglio'),
        'singular_name'      => __('Servizio', 'studio-legale-mandroneniglio'),
        'add_new'            => __('Aggiungi Servizio', 'studio-legale-mandroneniglio'),
        'add_new_item'       => __('Aggiungi Nuovo Servizio', 'studio-legale-mandroneniglio'),
        'edit_item'          => __('Modifica Servizio', 'studio-legale-mandroneniglio'),
        'menu_name'          => __('Servizi', 'studio-legale-mandroneniglio'),
    );
    register_post_type('slm_service', array(
        'labels'       => $service_labels,
        'public'       => true,
        'show_ui'      => true,
        'menu_icon'    => 'dashicons-portfolio',
        'supports'     => array('title', 'editor', 'thumbnail', 'excerpt'),
        'has_archive'  => true,
        'rewrite'      => array('slug' => 'servizi'),
        'menu_position' => 21,
    ));

    $faq_labels = array(
        'name'               => __('FAQ', 'studio-legale-mandroneniglio'),
        'singular_name'      => __('FAQ', 'studio-legale-mandroneniglio'),
        'add_new'            => __('Aggiungi FAQ', 'studio-legale-mandroneniglio'),
        'menu_name'          => __('FAQ', 'studio-legale-mandroneniglio'),
    );
    register_post_type('slm_faq', array(
        'labels'       => $faq_labels,
        'public'       => true,
        'show_ui'      => true,
        'menu_icon'    => 'dashicons-editor-help',
        'supports'     => array('title', 'editor'),
        'has_archive'  => false,
        'rewrite'      => array('slug' => 'faq'),
        'menu_position' => 22,
    ));

    flush_rewrite_rules();
}
add_action('init', 'slm_register_custom_post_types');

function slm_register_taxonomies() {
    register_taxonomy('slm_practice_area', 'slm_service', array(
        'labels' => array(
            'name'          => __('Aree di Diritto', 'studio-legale-mandroneniglio'),
            'singular_name' => __('Area di Diritto', 'studio-legale-mandroneniglio'),
            'menu_name'     => __('Aree di Diritto', 'studio-legale-mandroneniglio'),
        ),
        'hierarchical'      => true,
        'show_admin_column' => true,
        'rewrite'           => array('slug' => 'area-di-diritto'),
    ));

    register_taxonomy('slm_forum_category', 'slm_forum_topic', array(
        'labels' => array(
            'name'          => __('Categorie Forum', 'studio-legale-mandroneniglio'),
            'singular_name' => __('Categoria Forum', 'studio-legale-mandroneniglio'),
            'menu_name'     => __('Categorie Forum', 'studio-legale-mandroneniglio'),
        ),
        'hierarchical'      => true,
        'show_admin_menu'   => true,
        'rewrite'           => array('slug' => 'categoria-forum'),
    ));
}
add_action('init', 'slm_register_taxonomies');

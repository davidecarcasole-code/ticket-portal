<?php
function slm_register_forum_post_types() {
    $topic_labels = array(
        'name'               => __('Discussioni Forum', 'studio-legale-mandroneniglio'),
        'singular_name'      => __('Discussione', 'studio-legale-mandroneniglio'),
        'add_new'            => __('Nuova Discussione', 'studio-legale-mandroneniglio'),
        'add_new_item'       => __('Aggiungi Nuova Discussione', 'studio-legale-mandroneniglio'),
        'edit_item'          => __('Modifica Discussione', 'studio-legale-mandroneniglio'),
        'view_item'          => __('Vedi Discussione', 'studio-legale-mandroneniglio'),
        'search_items'       => __('Cerca Discussioni', 'studio-legale-mandroneniglio'),
        'menu_name'          => __('Forum', 'studio-legale-mandroneniglio'),
    );
    register_post_type('slm_forum_topic', array(
        'labels'       => $topic_labels,
        'public'       => true,
        'show_ui'      => true,
        'show_in_menu' => true,
        'menu_icon'    => 'dashicons-format-chat',
        'supports'     => array('title', 'editor', 'author', 'comments'),
        'has_archive'  => true,
        'rewrite'      => array('slug' => 'forum/discussione'),
        'menu_position' => 23,
    ));

    $reply_labels = array(
        'name'               => __('Risposte Forum', 'studio-legale-mandroneniglio'),
        'singular_name'      => __('Risposta', 'studio-legale-mandroneniglio'),
        'edit_item'          => __('Modifica Risposta', 'studio-legale-mandroneniglio'),
        'menu_name'          => __('Risposte', 'studio-legale-mandroneniglio'),
    );
    register_post_type('slm_forum_reply', array(
        'labels'       => $reply_labels,
        'public'       => false,
        'show_ui'      => true,
        'show_in_menu' => 'edit.php?post_type=slm_forum_topic',
        'supports'     => array('title', 'editor', 'author'),
        'rewrite'      => false,
        'menu_position' => 24,
    ));

    flush_rewrite_rules();
}
add_action('init', 'slm_register_forum_post_types');

function slm_forum_topic_metabox() {
    add_meta_box(
        'slm_forum_topic_status',
        __('Stato Discussione', 'studio-legale-mandroneniglio'),
        'slm_forum_topic_metabox_cb',
        'slm_forum_topic',
        'side',
        'high'
    );
}
add_action('add_meta_boxes', 'slm_forum_topic_metabox');

function slm_forum_topic_metabox_cb($post) {
    wp_nonce_field('slm_forum_topic_status', 'slm_forum_topic_status_nonce');
    $status = get_post_meta($post->ID, '_slm_topic_status', true) ?: 'open';
    $is_pinned = get_post_meta($post->ID, '_slm_topic_pinned', true);
    $is_resolved = get_post_meta($post->ID, '_slm_topic_resolved', true);
    ?>
    <p>
        <label for="slm_topic_status"><?php esc_html_e('Stato:', 'studio-legale-mandroneniglio'); ?></label>
        <select name="slm_topic_status" id="slm_topic_status" style="width:100%">
            <option value="open" <?php selected($status, 'open'); ?>><?php esc_html_e('Aperto', 'studio-legale-mandroneniglio'); ?></option>
            <option value="closed" <?php selected($status, 'closed'); ?>><?php esc_html_e('Chiuso', 'studio-legale-mandroneniglio'); ?></option>
        </select>
    </p>
    <p>
        <label>
            <input type="checkbox" name="slm_topic_pinned" value="1" <?php checked($is_pinned, '1'); ?>>
            <?php esc_html_e('Discussione in evidenza', 'studio-legale-mandroneniglio'); ?>
        </label>
    </p>
    <p>
        <label>
            <input type="checkbox" name="slm_topic_resolved" value="1" <?php checked($is_resolved, '1'); ?>>
            <?php esc_html_e('Risolto', 'studio-legale-mandroneniglio'); ?>
        </label>
    </p>
    <?php
}

function slm_save_forum_topic_meta($post_id) {
    if (!isset($_POST['slm_forum_topic_status_nonce']) || !wp_verify_nonce($_POST['slm_forum_topic_status_nonce'], 'slm_forum_topic_status')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['slm_topic_status'])) {
        update_post_meta($post_id, '_slm_topic_status', sanitize_text_field($_POST['slm_topic_status']));
    }
    update_post_meta($post_id, '_slm_topic_pinned', isset($_POST['slm_topic_pinned']) ? '1' : '0');
    update_post_meta($post_id, '_slm_topic_resolved', isset($_POST['slm_topic_resolved']) ? '1' : '0');
}
add_action('save_post_slm_forum_topic', 'slm_save_forum_topic_meta');

function slm_forum_reply_metabox() {
    add_meta_box(
        'slm_forum_reply_parent',
        __('Discussione collegata', 'studio-legale-mandroneniglio'),
        'slm_forum_reply_metabox_cb',
        'slm_forum_reply',
        'side',
        'high'
    );
}
add_action('add_meta_boxes', 'slm_forum_reply_metabox');

function slm_forum_reply_metabox_cb($post) {
    wp_nonce_field('slm_forum_reply_parent', 'slm_forum_reply_parent_nonce');
    $parent_id = get_post_meta($post->ID, '_slm_reply_to', true);
    $topics = get_posts(array('post_type' => 'slm_forum_topic', 'posts_per_page' => -1, 'post_status' => 'publish'));
    ?>
    <p>
        <label for="slm_reply_to"><?php esc_html_e('Discussione:', 'studio-legale-mandroneniglio'); ?></label>
        <select name="slm_reply_to" id="slm_reply_to" style="width:100%">
            <option value="">— <?php esc_html_e('Seleziona', 'studio-legale-mandroneniglio'); ?> —</option>
            <?php foreach ($topics as $topic) : ?>
                <option value="<?php echo esc_attr($topic->ID); ?>" <?php selected($parent_id, $topic->ID); ?>>
                    <?php echo esc_html($topic->post_title); ?>
                </option>
            <?php endforeach; ?>
        </select>
    </p>
    <?php
}

function slm_save_forum_reply_meta($post_id) {
    if (!isset($_POST['slm_forum_reply_parent_nonce']) || !wp_verify_nonce($_POST['slm_forum_reply_parent_nonce'], 'slm_forum_reply_parent')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    if (isset($_POST['slm_reply_to']) && !empty($_POST['slm_reply_to'])) {
        update_post_meta($post_id, '_slm_reply_to', intval($_POST['slm_reply_to']));
    }
}
add_action('save_post_slm_forum_reply', 'slm_save_forum_reply_meta');

function slm_get_recent_forum_topics($count = 5) {
    return get_posts(array(
        'post_type'      => 'slm_forum_topic',
        'posts_per_page' => $count,
        'post_status'    => 'publish',
        'meta_query'     => array(
            array(
                'key'   => '_slm_topic_status',
                'value' => 'closed',
                'compare' => '!=',
            ),
        ),
        'orderby' => 'date',
        'order'   => 'DESC',
    ));
}

function slm_get_forum_topic_reply_count($topic_id) {
    $replies = get_posts(array(
        'post_type'      => 'slm_forum_reply',
        'meta_key'       => '_slm_reply_to',
        'meta_value'     => $topic_id,
        'posts_per_page' => -1,
        'fields'         => 'ids',
    ));
    return count($replies);
}

function slm_get_forum_topics_by_category($category_slug = '') {
    $args = array(
        'post_type'      => 'slm_forum_topic',
        'posts_per_page' => 20,
        'post_status'    => 'publish',
    );
    if (!empty($category_slug)) {
        $args['tax_query'] = array(array(
            'taxonomy' => 'slm_forum_category',
            'field'    => 'slug',
            'terms'    => $category_slug,
        ));
    }
    return get_posts($args);
}

function slm_handle_new_forum_topic() {
    if (!isset($_POST['slm_new_topic_nonce']) || !wp_verify_nonce($_POST['slm_new_topic_nonce'], 'slm_new_topic')) return;

    if (!is_user_logged_in()) return;

    $title   = sanitize_text_field($_POST['topic_title']);
    $content = wp_kses_post($_POST['topic_content']);
    $category = intval($_POST['topic_category']);

    if (empty($title) || empty($content)) {
        wp_die(__('Compila tutti i campi obbligatori.', 'studio-legale-mandroneniglio'));
    }

    $topic_id = wp_insert_post(array(
        'post_type'    => 'slm_forum_topic',
        'post_title'   => $title,
        'post_content' => $content,
        'post_status'  => 'publish',
        'post_author'  => get_current_user_id(),
    ));

    if ($topic_id && $category) {
        wp_set_object_terms($topic_id, $category, 'slm_forum_category');
    }

    wp_redirect(get_permalink($topic_id));
    exit;
}
add_action('admin_post_slm_new_topic', 'slm_handle_new_forum_topic');
add_action('admin_post_nopriv_slm_new_topic', 'slm_handle_new_forum_topic');

function slm_handle_new_forum_reply() {
    if (!isset($_POST['slm_new_reply_nonce']) || !wp_verify_nonce($_POST['slm_new_reply_nonce'], 'slm_new_reply')) return;

    if (!is_user_logged_in()) return;

    $topic_id = intval($_POST['topic_id']);
    $content  = wp_kses_post($_POST['reply_content']);

    if (empty($content) || !$topic_id) return;

    $topic = get_post($topic_id);
    if (!$topic || $topic->post_type !== 'slm_forum_topic') return;

    $reply_id = wp_insert_post(array(
        'post_type'    => 'slm_forum_reply',
        'post_title'   => 'Re: ' . $topic->post_title,
        'post_content' => $content,
        'post_status'  => 'publish',
        'post_author'  => get_current_user_id(),
    ));

    if ($reply_id) {
        update_post_meta($reply_id, '_slm_reply_to', $topic_id);
    }

    wp_redirect(add_query_arg('reply', $reply_id, get_permalink($topic_id)));
    exit;
}
add_action('admin_post_slm_new_reply', 'slm_handle_new_forum_reply');
add_action('admin_post_nopriv_slm_new_reply', 'slm_handle_new_forum_reply');

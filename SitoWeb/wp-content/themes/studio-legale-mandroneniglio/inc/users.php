<?php
function slm_get_profile_url() {
    return home_url('/profilo-utente');
}

function slm_get_registration_url() {
    return wp_registration_url();
}

function slm_get_login_url() {
    return wp_login_url();
}

function slm_redirect_after_login($redirect_to, $request, $user) {
    if (isset($request['redirect_to'])) {
        return $request['redirect_to'];
    }
    if ($user && !is_wp_error($user)) {
        $redirect_to = slm_get_profile_url();
    }
    return $redirect_to;
}
add_filter('login_redirect', 'slm_redirect_after_login', 10, 3);

function slm_add_user_profile_fields($user) {
    ?>
    <h3><?php esc_html_e('Informazioni Studio Legale', 'studio-legale-mandroneniglio'); ?></h3>
    <table class="form-table">
        <tr>
            <th><label for="slm_phone"><?php esc_html_e('Telefono', 'studio-legale-mandroneniglio'); ?></label></th>
            <td><input type="text" name="slm_phone" id="slm_phone" value="<?php echo esc_attr(get_the_author_meta('slm_phone', $user->ID)); ?>" class="regular-text"></td>
        </tr>
        <tr>
            <th><label for="slm_profession"><?php esc_html_e('Professione', 'studio-legale-mandroneniglio'); ?></label></th>
            <td>
                <select name="slm_profession" id="slm_profession">
                    <option value="">— <?php esc_html_e('Seleziona', 'studio-legale-mandroneniglio'); ?> —</option>
                    <option value="avvocato" <?php selected(get_the_author_meta('slm_profession', $user->ID), 'avvocato'); ?>><?php esc_html_e('Avvocato', 'studio-legale-mandroneniglio'); ?></option>
                    <option value="praticante" <?php selected(get_the_author_meta('slm_profession', $user->ID), 'praticante'); ?>><?php esc_html_e('Praticante Avvocato', 'studio-legale-mandroneniglio'); ?></option>
                    <option value="cliente" <?php selected(get_the_author_meta('slm_profession', $user->ID), 'cliente'); ?>><?php esc_html_e('Cliente / Privato', 'studio-legale-mandroneniglio'); ?></option>
                    <option value="studente" <?php selected(get_the_author_meta('slm_profession', $user->ID), 'studente'); ?>><?php esc_html_e('Studente di Giurisprudenza', 'studio-legale-mandroneniglio'); ?></option>
                    <option value="altro" <?php selected(get_the_author_meta('slm_profession', $user->ID), 'altro'); ?>><?php esc_html_e('Altro', 'studio-legale-mandroneniglio'); ?></option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="slm_legal_area"><?php esc_html_e('Area di interesse legale', 'studio-legale-mandroneniglio'); ?></label></th>
            <td>
                <select name="slm_legal_area" id="slm_legal_area">
                    <option value="">— <?php esc_html_e('Seleziona', 'studio-legale-mandroneniglio'); ?> —</option>
                    <option value="civile" <?php selected(get_the_author_meta('slm_legal_area', $user->ID), 'civile'); ?>><?php esc_html_e('Diritto Civile', 'studio-legale-mandroneniglio'); ?></option>
                    <option value="penale" <?php selected(get_the_author_meta('slm_legal_area', $user->ID), 'penale'); ?>><?php esc_html_e('Diritto Penale', 'studio-legale-mandroneniglio'); ?></option>
                    <option value="amministrativo" <?php selected(get_the_author_meta('slm_legal_area', $user->ID), 'amministrativo'); ?>><?php esc_html_e('Diritto Amministrativo', 'studio-legale-mandroneniglio'); ?></option>
                    <option value="famiglia" <?php selected(get_the_author_meta('slm_legal_area', $user->ID), 'famiglia'); ?>><?php esc_html_e('Diritto di Famiglia', 'studio-legale-mandroneniglio'); ?></option>
                    <option value="lavoro" <?php selected(get_the_author_meta('slm_legal_area', $user->ID), 'lavoro'); ?>><?php esc_html_e('Diritto del Lavoro', 'studio-legale-mandroneniglio'); ?></option>
                    <option value="societario" <?php selected(get_the_author_meta('slm_legal_area', $user->ID), 'societario'); ?>><?php esc_html_e('Diritto Societario', 'studio-legale-mandroneniglio'); ?></option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="slm_newsletter"><?php esc_html_e('Newsletter', 'studio-legale-mandroneniglio'); ?></label></th>
            <td>
                <label>
                    <input type="checkbox" name="slm_newsletter" id="slm_newsletter" value="1" <?php checked(get_the_author_meta('slm_newsletter', $user->ID), '1'); ?>>
                    <?php esc_html_e('Iscritto alla newsletter', 'studio-legale-mandroneniglio'); ?>
                </label>
            </td>
        </tr>
    </table>
    <?php
}
add_action('show_user_profile', 'slm_add_user_profile_fields');
add_action('edit_user_profile', 'slm_add_user_profile_fields');

function slm_save_user_profile_fields($user_id) {
    if (!current_user_can('edit_user', $user_id)) return false;

    $fields = array('slm_phone', 'slm_profession', 'slm_legal_area');
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_user_meta($user_id, $field, sanitize_text_field($_POST[$field]));
        }
    }
    update_user_meta($user_id, 'slm_newsletter', isset($_POST['slm_newsletter']) ? '1' : '0');
}
add_action('personal_options_update', 'slm_save_user_profile_fields');
add_action('edit_user_profile_update', 'slm_save_user_profile_fields');

function slm_registration_extra_fields() {
    ?>
    <p>
        <label for="slm_profession_reg"><?php esc_html_e('Professione', 'studio-legale-mandroneniglio'); ?><br>
            <select name="slm_profession" id="slm_profession_reg">
                <option value="">— <?php esc_html_e('Seleziona', 'studio-legale-mandroneniglio'); ?> —</option>
                <option value="avvocato"><?php esc_html_e('Avvocato', 'studio-legale-mandroneniglio'); ?></option>
                <option value="praticante"><?php esc_html_e('Praticante Avvocato', 'studio-legale-mandroneniglio'); ?></option>
                <option value="cliente"><?php esc_html_e('Cliente / Privato', 'studio-legale-mandroneniglio'); ?></option>
                <option value="studente"><?php esc_html_e('Studente di Giurisprudenza', 'studio-legale-mandroneniglio'); ?></option>
                <option value="altro"><?php esc_html_e('Altro', 'studio-legale-mandroneniglio'); ?></option>
            </select>
        </label>
    </p>
    <?php
}
add_action('register_form', 'slm_registration_extra_fields');

function slm_registration_save_extra_fields($user_id) {
    if (isset($_POST['slm_profession'])) {
        update_user_meta($user_id, 'slm_profession', sanitize_text_field($_POST['slm_profession']));
    }
}
add_action('user_register', 'slm_registration_save_extra_fields');

function slm_user_profile_shortcode() {
    if (!is_user_logged_in()) {
        return '<div class="slm-alert warning"><p>' . __('Devi effettuare l\'accesso per visualizzare il profilo.', 'studio-legale-mandroneniglio') . '</p><a href="' . esc_url(wp_login_url(get_permalink())) . '" class="btn btn-primary">' . __('Accedi', 'studio-legale-mandroneniglio') . '</a></div>';
    }

    $current_user = wp_get_current_user();
    ob_start();
    ?>
    <div class="slm-user-profile">
        <div class="profile-header">
            <div class="profile-avatar">
                <?php echo get_avatar($current_user->ID, 120); ?>
            </div>
            <div class="profile-info">
                <h2><?php echo esc_html($current_user->display_name); ?></h2>
                <p class="profile-email"><?php echo esc_html($current_user->user_email); ?></p>
                <p class="profile-member-since"><?php printf(__('Membro dal %s', 'studio-legale-mandroneniglio'), date_i18n(get_option('date_format'), strtotime($current_user->user_registered))); ?></p>
            </div>
        </div>

        <div class="profile-details">
            <h3><?php esc_html_e('Dettagli Profilo', 'studio-legale-mandroneniglio'); ?></h3>
            <?php if ($phone = get_user_meta($current_user->ID, 'slm_phone', true)) : ?>
            <p><strong><?php esc_html_e('Telefono:', 'studio-legale-mandroneniglio'); ?></strong> <?php echo esc_html($phone); ?></p>
            <?php endif; ?>
            <?php
            $professions = array(
                'avvocato' => __('Avvocato', 'studio-legale-mandroneniglio'),
                'praticante' => __('Praticante Avvocato', 'studio-legale-mandroneniglio'),
                'cliente' => __('Cliente / Privato', 'studio-legale-mandroneniglio'),
                'studente' => __('Studente di Giurisprudenza', 'studio-legale-mandroneniglio'),
                'altro' => __('Altro', 'studio-legale-mandroneniglio'),
            );
            $prof = get_user_meta($current_user->ID, 'slm_profession', true);
            if ($prof && isset($professions[$prof])) : ?>
            <p><strong><?php esc_html_e('Professione:', 'studio-legale-mandroneniglio'); ?></strong> <?php echo esc_html($professions[$prof]); ?></p>
            <?php endif; ?>
            <p class="profile-actions">
                <a href="<?php echo esc_url(admin_url('profile.php')); ?>" class="btn btn-primary"><?php esc_html_e('Modifica Profilo', 'studio-legale-mandroneniglio'); ?></a>
                <a href="<?php echo esc_url(home_url('/forum')); ?>" class="btn btn-secondary"><?php esc_html_e('Le mie discussioni', 'studio-legale-mandroneniglio'); ?></a>
            </p>
        </div>

        <div class="profile-topics">
            <h3><?php esc_html_e('Le mie discussioni sul Forum', 'studio-legale-mandroneniglio'); ?></h3>
            <?php
            $user_topics = get_posts(array(
                'post_type'      => 'slm_forum_topic',
                'author'         => $current_user->ID,
                'posts_per_page' => 10,
                'post_status'    => 'publish',
            ));
            if ($user_topics) : ?>
            <ul class="user-topics-list">
                <?php foreach ($user_topics as $topic) : ?>
                <li>
                    <a href="<?php echo esc_url(get_permalink($topic->ID)); ?>"><?php echo esc_html($topic->post_title); ?></a>
                    <span class="topic-date"><?php echo get_the_date('', $topic->ID); ?></span>
                </li>
                <?php endforeach; ?>
            </ul>
            <?php else : ?>
            <p><?php esc_html_e('Non hai ancora aperto discussioni nel forum.', 'studio-legale-mandroneniglio'); ?></p>
            <?php endif; ?>
        </div>
    </div>
    <?php
    return ob_get_clean();
}
add_shortcode('slm_user_profile', 'slm_user_profile_shortcode');

<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page" class="site">
    <a class="skip-link screen-reader-text" href="#primary">
        <?php esc_html_e('Salta al contenuto', 'studio-legale-mandroneniglio'); ?>
    </a>

    <header id="masthead" class="site-header">
        <div class="header-top">
            <div class="container">
                <div class="header-top-content">
                    <div class="header-contact">
                        <span class="phone"><i class="fas fa-phone"></i> <a href="tel:+390612345678">+39 06 12345678</a></span>
                        <span class="email"><i class="fas fa-envelope"></i> <a href="mailto:info@studiolegalemandroneniglio.it">info@studiolegalemandroneniglio.it</a></span>
                        <span class="address"><i class="fas fa-map-marker-alt"></i> Via dei Giureconsulti, 25 - 00186 Roma</span>
                    </div>
                    <div class="header-user-menu">
                        <?php if (is_user_logged_in()) : ?>
                            <?php $current_user = wp_get_current_user(); ?>
                            <span class="user-greeting">
                                <i class="fas fa-user"></i>
                                <a href="<?php echo esc_url(slm_get_profile_url()); ?>"><?php echo esc_html($current_user->display_name); ?></a>
                            </span>
                            <a href="<?php echo esc_url(wp_logout_url(home_url())); ?>" class="logout-link"><i class="fas fa-sign-out-alt"></i> <?php esc_html_e('Esci', 'studio-legale-mandroneniglio'); ?></a>
                        <?php else : ?>
                            <a href="<?php echo esc_url(wp_login_url()); ?>" class="login-link"><i class="fas fa-sign-in-alt"></i> <?php esc_html_e('Accedi', 'studio-legale-mandroneniglio'); ?></a>
                            <a href="<?php echo esc_url(slm_get_registration_url()); ?>" class="register-link"><i class="fas fa-user-plus"></i> <?php esc_html_e('Registrati', 'studio-legale-mandroneniglio'); ?></a>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>

        <div class="header-main">
            <div class="container">
                <div class="site-branding">
                    <?php if (has_custom_logo()) : ?>
                        <?php the_custom_logo(); ?>
                    <?php else : ?>
                        <div class="site-logo-text">
                            <a href="<?php echo esc_url(home_url('/')); ?>" rel="home">
                                <span class="logo-icon">
                                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="40" height="40" rx="8" fill="#C5A55A"/>
                                        <text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="#1B1B2F" font-size="20" font-weight="bold" font-family="serif">SL</text>
                                    </svg>
                                </span>
                                <span class="site-title"><?php bloginfo('name'); ?></span>
                                <span class="site-description"><?php bloginfo('description'); ?></span>
                            </a>
                        </div>
                    <?php endif; ?>
                </div>

                <nav id="site-navigation" class="main-navigation">
                    <button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false">
                        <span class="hamburger"></span>
                        <span class="screen-reader-text"><?php esc_html_e('Menu', 'studio-legale-mandroneniglio'); ?></span>
                    </button>
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'primary',
                        'menu_id'        => 'primary-menu',
                        'container'      => false,
                        'fallback_cb'    => false,
                    ));
                    ?>
                </nav>
            </div>
        </div>
    </header>

    <?php if (!is_front_page() && !is_page_template('page-templates/front-page.php')) : ?>
    <div class="page-hero">
        <div class="container">
            <h1 class="page-title">
                <?php
                if (is_home()) {
                    single_post_title();
                } elseif (is_search()) {
                    printf(esc_html__('Risultati ricerca: %s', 'studio-legale-mandroneniglio'), get_search_query());
                } elseif (is_404()) {
                    esc_html_e('Pagina non trovata', 'studio-legale-mandroneniglio');
                } elseif (is_archive()) {
                    the_archive_title();
                } else {
                    the_title();
                }
                ?>
            </h1>
            <?php if (function_exists('yoast_breadcrumb')) : ?>
                <?php yoast_breadcrumb('<nav class="breadcrumbs">', '</nav>'); ?>
            <?php else : ?>
                <nav class="breadcrumbs"><?php slm_breadcrumbs(); ?></nav>
            <?php endif; ?>
        </div>
    </div>
    <?php endif; ?>

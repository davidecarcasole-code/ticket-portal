<?php
/**
 * Template Name: Profilo Utente
 */
get_header(); ?>

<main id="primary" class="site-main user-profile-page">
    <div class="container">
        <div class="profile-main">
            <?php echo do_shortcode('[slm_user_profile]'); ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>

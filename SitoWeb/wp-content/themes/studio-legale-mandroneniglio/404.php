<?php get_header(); ?>

<main id="primary" class="site-main error-404">
    <div class="container">
        <div class="error-404-content">
            <div class="error-code">404</div>
            <h2><?php esc_html_e('Pagina non trovata', 'studio-legale-mandroneniglio'); ?></h2>
            <p><?php esc_html_e('La pagina che stai cercando potrebbe essere stata spostata o rimossa. Ti invitiamo a tornare alla homepage o a contattarci per assistenza.', 'studio-legale-mandroneniglio'); ?></p>
            <div class="error-actions">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="btn btn-primary">
                    <i class="fas fa-home"></i> <?php esc_html_e('Torna alla Home', 'studio-legale-mandroneniglio'); ?>
                </a>
                <a href="<?php echo esc_url(home_url('/contatti')); ?>" class="btn btn-secondary">
                    <i class="fas fa-envelope"></i> <?php esc_html_e('Contattaci', 'studio-legale-mandroneniglio'); ?>
                </a>
            </div>
            <?php get_search_form(); ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>

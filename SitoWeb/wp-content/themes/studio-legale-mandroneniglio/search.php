<?php get_header(); ?>

<main id="primary" class="site-main">
    <div class="container">
        <div class="content-area with-sidebar">
            <?php if (have_posts()) : ?>
                <div class="search-results-count">
                    <p><?php printf(esc_html__('Trovati %s risultato/i per "%s"', 'studio-legale-mandroneniglio'), $wp_query->found_posts, get_search_query()); ?></p>
                </div>
                <div class="search-loop">
                    <?php
                    while (have_posts()) :
                        the_post();
                        get_template_part('template-parts/content', 'search');
                    endwhile;
                    ?>
                </div>
                <?php the_posts_pagination(array(
                    'mid_size' => 2,
                    'prev_text' => __('&laquo; Precedente', 'studio-legale-mandroneniglio'),
                    'next_text' => __('Successivo &raquo;', 'studio-legale-mandroneniglio'),
                )); ?>
            <?php else : ?>
                <div class="no-results">
                    <h2><?php esc_html_e('Nessun risultato', 'studio-legale-mandroneniglio'); ?></h2>
                    <p><?php esc_html_e('Prova con termini di ricerca diversi o naviga tra le aree del sito.', 'studio-legale-mandroneniglio'); ?></p>
                    <?php get_search_form(); ?>
                </div>
            <?php endif; ?>
        </div>
        <?php get_sidebar(); ?>
    </div>
</main>

<?php get_footer(); ?>

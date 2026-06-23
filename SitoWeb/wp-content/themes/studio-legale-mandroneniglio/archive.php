<?php get_header(); ?>

<main id="primary" class="site-main">
    <div class="container">
        <div class="content-area with-sidebar">
            <?php if (have_posts()) : ?>
                <div class="archive-loop">
                    <?php
                    while (have_posts()) :
                        the_post();
                        get_template_part('template-parts/content', get_post_type());
                    endwhile;
                    ?>
                </div>
                <?php the_posts_pagination(array(
                    'mid_size' => 2,
                    'prev_text' => __('&laquo; Precedente', 'studio-legale-mandroneniglio'),
                    'next_text' => __('Successivo &raquo;', 'studio-legale-mandroneniglio'),
                )); ?>
            <?php else : ?>
                <?php get_template_part('template-parts/content', 'none'); ?>
            <?php endif; ?>
        </div>
        <?php get_sidebar(); ?>
    </div>
</main>

<?php get_footer(); ?>

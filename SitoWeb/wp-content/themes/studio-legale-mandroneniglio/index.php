<?php get_header(); ?>

<main class="site-main">
    <div class="container">
        <div class="content-area">
            <?php
            if (have_posts()) :
                while (have_posts()) :
                    the_post();
                    get_template_part('template-parts/content', get_post_type());
                endwhile;
                the_posts_pagination(array(
                    'mid_size' => 2,
                    'prev_text' => __('&laquo; Precedente', 'studio-legale-mandroneniglio'),
                    'next_text' => __('Successivo &raquo;', 'studio-legale-mandroneniglio'),
                ));
            else :
                get_template_part('template-parts/content', 'none');
            endif;
            ?>
        </div>
        <?php get_sidebar(); ?>
    </div>
</main>

<?php get_footer(); ?>

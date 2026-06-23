<?php get_header(); ?>

<main id="primary" class="site-main">
    <div class="container">
        <div class="content-area with-sidebar">
            <?php
            while (have_posts()) :
                the_post();
                get_template_part('template-parts/content', get_post_type());
                the_post_navigation(array(
                    'prev_text' => '<span class="nav-subtitle">' . __('Precedente', 'studio-legale-mandroneniglio') . '</span> <span class="nav-title">%title</span>',
                    'next_text' => '<span class="nav-subtitle">' . __('Successivo', 'studio-legale-mandroneniglio') . '</span> <span class="nav-title">%title</span>',
                ));
                if (comments_open() || get_comments_number()) :
                    comments_template();
                endif;
            endwhile;
            ?>
        </div>
        <?php get_sidebar(); ?>
    </div>
</main>

<?php get_footer(); ?>

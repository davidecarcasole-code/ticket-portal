<?php get_header(); ?>

<main id="primary" class="site-main">
    <div class="container">
        <div class="content-area with-sidebar">
            <?php
            while (have_posts()) :
                the_post();
                get_template_part('template-parts/content', 'page');
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

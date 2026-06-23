<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <?php if (has_post_thumbnail()) : ?>
    <div class="page-thumbnail">
        <?php the_post_thumbnail('full'); ?>
    </div>
    <?php endif; ?>
    <div class="entry-content">
        <?php
        the_content();
        wp_link_pages(array(
            'before' => '<div class="page-links">' . __('Pagine:', 'studio-legale-mandroneniglio'),
            'after'  => '</div>',
        ));
        ?>
    </div>
</article>

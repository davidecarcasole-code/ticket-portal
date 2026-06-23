<article id="post-<?php the_ID(); ?>" <?php post_class('post-card'); ?>>
    <?php if (has_post_thumbnail()) : ?>
    <div class="post-thumbnail">
        <a href="<?php the_permalink(); ?>">
            <?php the_post_thumbnail('large'); ?>
        </a>
    </div>
    <?php endif; ?>
    <div class="post-body">
        <header class="entry-header">
            <?php
            if (is_singular()) :
                the_title('<h1 class="entry-title">', '</h1>');
            else :
                the_title('<h2 class="entry-title"><a href="' . esc_url(get_permalink()) . '" rel="bookmark">', '</a></h2>');
            endif;
            ?>
            <div class="entry-meta">
                <span class="posted-by"><?php esc_html_e('Da', 'studio-legale-mandroneniglio'); ?> <?php the_author_posts_link(); ?></span>
                <span class="posted-on"><?php echo get_the_date(); ?></span>
                <span class="post-categories"><?php the_category(', '); ?></span>
            </div>
        </header>
        <div class="entry-content">
            <?php
            if (is_singular()) {
                the_content();
                wp_link_pages(array(
                    'before' => '<div class="page-links">' . __('Pagine:', 'studio-legale-mandroneniglio'),
                    'after'  => '</div>',
                ));
            } else {
                the_excerpt();
                echo '<a href="' . esc_url(get_permalink()) . '" class="read-more">' . __('Leggi tutto', 'studio-legale-mandroneniglio') . ' <i class="fas fa-arrow-right"></i></a>';
            }
            ?>
        </div>
        <?php if (is_singular()) : ?>
        <footer class="entry-footer">
            <?php the_tags('<div class="post-tags"><span>' . __('Tag:', 'studio-legale-mandroneniglio') . '</span> ', ' ', '</div>'); ?>
        </footer>
        <?php endif; ?>
    </div>
</article>

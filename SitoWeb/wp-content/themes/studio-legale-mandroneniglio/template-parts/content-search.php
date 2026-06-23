<article id="post-<?php the_ID(); ?>" <?php post_class('search-result'); ?>>
    <header class="entry-header">
        <?php the_title(sprintf('<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url(get_permalink())), '</a></h2>'); ?>
        <div class="entry-meta">
            <span class="post-type"><?php echo get_post_type_object(get_post_type())->labels->singular_name; ?></span>
            <span class="posted-on"><?php echo get_the_date(); ?></span>
        </div>
    </header>
    <div class="entry-summary">
        <?php the_excerpt(); ?>
    </div>
    <a href="<?php the_permalink(); ?>" class="read-more"><?php esc_html_e('Leggi tutto', 'studio-legale-mandroneniglio'); ?> <i class="fas fa-arrow-right"></i></a>
</article>

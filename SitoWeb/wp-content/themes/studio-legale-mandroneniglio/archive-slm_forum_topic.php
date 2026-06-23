<?php get_header(); ?>

<main id="primary" class="site-main forum-page">
    <div class="container">
        <div class="forum-layout">
            <div class="forum-sidebar">
                <div class="forum-categories">
                    <h3>Categorie</h3>
                    <?php
                    $categories = get_terms(array('taxonomy' => 'slm_forum_category', 'hide_empty' => false));
                    if (!empty($categories) && !is_wp_error($categories)) : ?>
                    <ul class="forum-cat-list">
                        <li><a href="<?php echo esc_url(get_post_type_archive_link('slm_forum_topic')); ?>">Tutte le categorie</a></li>
                        <?php foreach ($categories as $cat) : ?>
                        <li><a href="<?php echo esc_url(get_term_link($cat)); ?>"><?php echo esc_html($cat->name); ?></a></li>
                        <?php endforeach; ?>
                    </ul>
                    <?php endif; ?>
                </div>
                <?php if (is_user_logged_in()) : ?>
                <a href="<?php echo esc_url(home_url('/forum')); ?>#new-topic-form" class="btn btn-primary btn-new-topic" style="display:block;text-align:center"><i class="fas fa-plus"></i> Nuova Discussione</a>
                <?php else : ?>
                <div class="forum-login-cta">
                    <p>Accedi per partecipare.</p>
                    <a href="<?php echo esc_url(wp_login_url(home_url('/forum'))); ?>" class="btn btn-primary">Accedi</a>
                    <a href="<?php echo esc_url(slm_get_registration_url()); ?>" class="btn btn-secondary">Registrati</a>
                </div>
                <?php endif; ?>
            </div>

            <div class="forum-content">
                <div class="forum-topics-header">
                    <h2>Discussioni</h2>
                    <span class="topic-count"><?php global $wp_query; printf('%d discussioni', $wp_query->found_posts); ?></span>
                </div>

                <?php if (have_posts()) : ?>
                <div class="forum-topics-list">
                    <?php while (have_posts()) : the_post();
                        $status = get_post_meta(get_the_ID(), '_slm_topic_status', true) ?: 'open';
                        $is_pinned = get_post_meta(get_the_ID(), '_slm_topic_pinned', true);
                        $reply_count = slm_get_forum_topic_reply_count(get_the_ID());
                    ?>
                    <article class="forum-topic-item <?php echo $status === 'closed' ? 'closed' : ''; ?> <?php echo $is_pinned ? 'pinned' : ''; ?>">
                        <div class="topic-indicator">
                            <?php if ($is_pinned) : ?><span class="pinned-badge"><i class="fas fa-thumbtack"></i></span><?php endif; ?>
                            <?php if ($status === 'closed') : ?><span class="closed-badge"><i class="fas fa-lock"></i></span><?php endif; ?>
                        </div>
                        <div class="topic-main">
                            <h3 class="topic-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                            <div class="topic-meta">
                                <span class="topic-author">Da <?php the_author_posts_link(); ?></span>
                                <span class="topic-date"><?php echo get_the_date(); ?></span>
                            </div>
                        </div>
                        <div class="topic-stats">
                            <span class="topic-replies"><i class="fas fa-comment"></i> <?php echo intval($reply_count); ?></span>
                        </div>
                    </article>
                    <?php endwhile; ?>
                </div>
                <div class="forum-pagination">
                    <?php echo paginate_links(array(
                        'prev_text' => '&laquo;',
                        'next_text' => '&raquo;',
                    )); ?>
                </div>
                <?php else : ?>
                <div class="forum-no-topics"><p>Ancora nessuna discussione.</p></div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>

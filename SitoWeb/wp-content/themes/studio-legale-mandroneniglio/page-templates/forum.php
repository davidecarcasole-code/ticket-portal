<?php
/**
 * Template Name: Forum
 */
get_header(); ?>

<main id="primary" class="site-main forum-page">
    <div class="container">
        <div class="forum-layout">
            <div class="forum-sidebar">
                <div class="forum-categories">
                    <h3><?php esc_html_e('Categorie', 'studio-legale-mandroneniglio'); ?></h3>
                    <?php
                    $categories = get_terms(array(
                        'taxonomy'   => 'slm_forum_category',
                        'hide_empty' => false,
                    ));
                    if (!empty($categories) && !is_wp_error($categories)) : ?>
                    <ul class="forum-cat-list">
                        <li class="<?php echo !get_query_var('categoria-forum') ? 'active' : ''; ?>">
                            <a href="<?php echo esc_url(get_permalink()); ?>"><?php esc_html_e('Tutte le categorie', 'studio-legale-mandroneniglio'); ?></a>
                        </li>
                        <?php foreach ($categories as $cat) : ?>
                        <li class="<?php echo get_query_var('categoria-forum') === $cat->slug ? 'active' : ''; ?>">
                            <a href="<?php echo esc_url(get_term_link($cat)); ?>"><?php echo esc_html($cat->name); ?></a>
                        </li>
                        <?php endforeach; ?>
                    </ul>
                    <?php endif; ?>
                </div>

                <?php if (is_user_logged_in()) : ?>
                <a href="#new-topic-form" class="btn btn-primary btn-new-topic">
                    <i class="fas fa-plus"></i> <?php esc_html_e('Nuova Discussione', 'studio-legale-mandroneniglio'); ?>
                </a>
                <?php else : ?>
                <div class="forum-login-cta">
                    <p><?php esc_html_e('Accedi per partecipare alle discussioni.', 'studio-legale-mandroneniglio'); ?></p>
                    <a href="<?php echo esc_url(wp_login_url(get_permalink())); ?>" class="btn btn-primary"><?php esc_html_e('Accedi', 'studio-legale-mandroneniglio'); ?></a>
                    <a href="<?php echo esc_url(slm_get_registration_url()); ?>" class="btn btn-secondary"><?php esc_html_e('Registrati', 'studio-legale-mandroneniglio'); ?></a>
                </div>
                <?php endif; ?>
            </div>

            <div class="forum-content">
                <?php
                $paged = get_query_var('paged') ? get_query_var('paged') : 1;
                $forum_args = array(
                    'post_type'      => 'slm_forum_topic',
                    'posts_per_page' => 15,
                    'paged'          => $paged,
                    'post_status'    => 'publish',
                );

                $category_slug = get_query_var('categoria-forum');
                if ($category_slug) {
                    $forum_args['tax_query'] = array(array(
                        'taxonomy' => 'slm_forum_category',
                        'field'    => 'slug',
                        'terms'    => $category_slug,
                    ));
                }

                $forum_query = new WP_Query($forum_args);
                ?>
                <div class="forum-topics-header">
                    <h2><?php esc_html_e('Discussioni', 'studio-legale-mandroneniglio'); ?></h2>
                    <span class="topic-count"><?php printf(__('%d discussioni', 'studio-legale-mandroneniglio'), $forum_query->found_posts); ?></span>
                </div>

                <?php if ($forum_query->have_posts()) : ?>
                <div class="forum-topics-list">
                    <?php while ($forum_query->have_posts()) : $forum_query->the_post();
                        $status = get_post_meta(get_the_ID(), '_slm_topic_status', true) ?: 'open';
                        $is_pinned = get_post_meta(get_the_ID(), '_slm_topic_pinned', true);
                        $is_resolved = get_post_meta(get_the_ID(), '_slm_topic_resolved', true);
                        $reply_count = slm_get_forum_topic_reply_count(get_the_ID());
                    ?>
                    <article class="forum-topic-item <?php echo $status === 'closed' ? 'closed' : ''; ?> <?php echo $is_pinned ? 'pinned' : ''; ?>">
                        <div class="topic-indicator">
                            <?php if ($is_pinned) : ?><span class="pinned-badge" title="<?php esc_attr_e('In evidenza', 'studio-legale-mandroneniglio'); ?>"><i class="fas fa-thumbtack"></i></span><?php endif; ?>
                            <?php if ($is_resolved) : ?><span class="resolved-badge" title="<?php esc_attr_e('Risolto', 'studio-legale-mandroneniglio'); ?>"><i class="fas fa-check-circle"></i></span><?php endif; ?>
                            <?php if ($status === 'closed') : ?><span class="closed-badge" title="<?php esc_attr_e('Chiuso', 'studio-legale-mandroneniglio'); ?>"><i class="fas fa-lock"></i></span><?php endif; ?>
                        </div>
                        <div class="topic-main">
                            <h3 class="topic-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                            <div class="topic-meta">
                                <span class="topic-author"><?php esc_html_e('Da', 'studio-legale-mandroneniglio'); ?> <?php the_author_posts_link(); ?></span>
                                <span class="topic-date"><?php echo get_the_date(); ?></span>
                                <?php
                                $cats = get_the_terms(get_the_ID(), 'slm_forum_category');
                                if ($cats && !is_wp_error($cats)) :
                                    $cat_links = array();
                                    foreach ($cats as $c) {
                                        $cat_links[] = '<a href="' . esc_url(get_term_link($c)) . '">' . esc_html($c->name) . '</a>';
                                    }
                                    echo '<span class="topic-cats">' . implode(', ', $cat_links) . '</span>';
                                endif;
                                ?>
                            </div>
                        </div>
                        <div class="topic-stats">
                            <span class="topic-replies"><i class="fas fa-comment"></i> <?php echo intval($reply_count); ?></span>
                            <span class="topic-last-reply">
                                <?php
                                $last_reply = get_posts(array(
                                    'post_type'      => 'slm_forum_reply',
                                    'meta_key'       => '_slm_reply_to',
                                    'meta_value'     => get_the_ID(),
                                    'posts_per_page' => 1,
                                    'orderby'        => 'date',
                                    'order'          => 'DESC',
                                ));
                                if ($last_reply) {
                                    echo esc_html(get_the_author_meta('display_name', $last_reply[0]->post_author));
                                }
                                ?>
                            </span>
                        </div>
                    </article>
                    <?php endwhile; ?>
                </div>

                <div class="forum-pagination">
                    <?php
                    echo paginate_links(array(
                        'total'     => $forum_query->max_num_pages,
                        'current'   => $paged,
                        'prev_text' => '&laquo;',
                        'next_text' => '&raquo;',
                    ));
                    ?>
                </div>
                <?php else : ?>
                <div class="forum-no-topics">
                    <p><?php esc_html_e('Ancora nessuna discussione. Sii il primo a partecipare!', 'studio-legale-mandroneniglio'); ?></p>
                </div>
                <?php endif; wp_reset_postdata(); ?>

                <?php if (is_user_logged_in()) : ?>
                <div id="new-topic-form" class="new-topic-form">
                    <h3><?php esc_html_e('Nuova Discussione', 'studio-legale-mandroneniglio'); ?></h3>
                    <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
                        <div class="form-field">
                            <label for="topic_title"><?php esc_html_e('Titolo *', 'studio-legale-mandroneniglio'); ?></label>
                            <input type="text" id="topic_title" name="topic_title" required>
                        </div>
                        <div class="form-field">
                            <label for="topic_category"><?php esc_html_e('Categoria', 'studio-legale-mandroneniglio'); ?></label>
                            <select id="topic_category" name="topic_category">
                                <option value="">— <?php esc_html_e('Seleziona', 'studio-legale-mandroneniglio'); ?> —</option>
                                <?php
                                $cats = get_terms(array('taxonomy' => 'slm_forum_category', 'hide_empty' => false));
                                foreach ($cats as $cat) : ?>
                                <option value="<?php echo esc_attr($cat->term_id); ?>"><?php echo esc_html($cat->name); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="form-field">
                            <label for="topic_content"><?php esc_html_e('Messaggio *', 'studio-legale-mandroneniglio'); ?></label>
                            <?php
                            wp_editor('', 'topic_content', array(
                                'media_buttons' => false,
                                'textarea_rows' => 10,
                                'teeny'         => true,
                                'quicktags'     => false,
                            ));
                            ?>
                        </div>
                        <div class="form-field">
                            <?php wp_nonce_field('slm_new_topic', 'slm_new_topic_nonce'); ?>
                            <input type="hidden" name="action" value="slm_new_topic">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-paper-plane"></i> <?php esc_html_e('Pubblica Discussione', 'studio-legale-mandroneniglio'); ?>
                            </button>
                        </div>
                    </form>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
</main>

<?php get_footer(); ?>

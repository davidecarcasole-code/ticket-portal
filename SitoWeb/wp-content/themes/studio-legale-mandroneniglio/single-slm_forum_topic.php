<?php
get_header();
$status = get_post_meta(get_the_ID(), '_slm_topic_status', true) ?: 'open';
$is_resolved = get_post_meta(get_the_ID(), '_slm_topic_resolved', true);
?>

<main id="primary" class="site-main single-forum-topic">
    <div class="container">
        <div class="topic-single">
            <article id="topic-<?php the_ID(); ?>" class="topic-main-post">
                <div class="topic-header">
                    <h1 class="topic-title"><?php the_title(); ?></h1>
                    <div class="topic-badges">
                        <?php if ($is_resolved) : ?><span class="resolved-badge"><i class="fas fa-check-circle"></i> Risolto</span><?php endif; ?>
                        <?php if ($status === 'closed') : ?><span class="closed-badge"><i class="fas fa-lock"></i> Chiuso</span><?php endif; ?>
                    </div>
                </div>

                <div class="topic-author-box">
                    <div class="author-avatar"><?php echo get_avatar(get_the_author_meta('ID'), 60); ?></div>
                    <div class="author-info">
                        <strong><?php the_author_posts_link(); ?></strong>
                        <span class="author-title">
                            <?php
                            $prof = get_user_meta(get_the_author_meta('ID'), 'slm_profession', true);
                            $professions = array('avvocato' => 'Avvocato', 'praticante' => 'Praticante', 'cliente' => 'Cliente', 'studente' => 'Studente');
                            echo isset($professions[$prof]) ? esc_html($professions[$prof]) : 'Utente';
                            ?>
                        </span>
                        <span class="topic-date"><?php echo get_the_date(); ?> alle <?php echo get_the_time(); ?></span>
                    </div>
                </div>

                <div class="topic-content">
                    <?php the_content(); ?>
                </div>
            </article>

            <div class="topic-replies">
                <h2>Risposte</h2>
                <?php
                $replies = get_posts(array(
                    'post_type'      => 'slm_forum_reply',
                    'meta_key'       => '_slm_reply_to',
                    'meta_value'     => get_the_ID(),
                    'posts_per_page' => -1,
                    'orderby'        => 'date',
                    'order'          => 'ASC',
                ));
                if ($replies) :
                    foreach ($replies as $reply) : ?>
                    <div class="reply-item" id="reply-<?php echo intval($reply->ID); ?>">
                        <div class="reply-author-box">
                            <div class="author-avatar"><?php echo get_avatar($reply->post_author, 50); ?></div>
                            <div class="author-info">
                                <strong><?php echo esc_html(get_the_author_meta('display_name', $reply->post_author)); ?></strong>
                                <span class="reply-date"><?php echo get_the_date('', $reply->ID); ?></span>
                            </div>
                        </div>
                        <div class="reply-content"><?php echo wp_kses_post($reply->post_content); ?></div>
                    </div>
                    <?php endforeach;
                else : ?>
                <div class="no-replies"><p>Ancora nessuna risposta. Sii il primo a rispondere!</p></div>
                <?php endif; ?>
            </div>

            <?php if (is_user_logged_in() && $status !== 'closed') : ?>
            <div class="reply-form">
                <h3>La tua risposta</h3>
                <form action="<?php echo esc_url(admin_url('admin-post.php')); ?>" method="post">
                    <div class="form-field">
                        <label for="reply_content">Risposta *</label>
                        <textarea id="reply_content" name="reply_content" rows="8" required></textarea>
                    </div>
                    <div class="form-field">
                        <?php wp_nonce_field('slm_new_reply', 'slm_new_reply_nonce'); ?>
                        <input type="hidden" name="action" value="slm_new_reply">
                        <input type="hidden" name="topic_id" value="<?php the_ID(); ?>">
                        <button type="submit" class="btn btn-primary"><i class="fas fa-reply"></i> Invia Risposta</button>
                    </div>
                </form>
            </div>
            <?php elseif ($status === 'closed') : ?>
            <div class="topic-closed-notice"><p><i class="fas fa-lock"></i> Questa discussione è chiusa.</p></div>
            <?php else : ?>
            <div class="reply-login-cta">
                <p>Devi accedere per rispondere.</p>
                <a href="<?php echo esc_url(wp_login_url(get_permalink())); ?>" class="btn btn-primary">Accedi</a>
                <a href="<?php echo esc_url(slm_get_registration_url()); ?>" class="btn btn-secondary">Registrati</a>
            </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php get_footer(); ?>

<?php if (post_password_required()) return; ?>

<div id="comments" class="comments-area">
    <?php if (have_comments()) : ?>
        <h2 class="comments-title">
            <?php
            $comment_count = get_comments_number();
            printf(_n('1 commento', '%d commenti', $comment_count, 'studio-legale-mandroneniglio'), $comment_count);
            ?>
        </h2>
        <ol class="comment-list">
            <?php
            wp_list_comments(array(
                'style'       => 'ol',
                'short_ping'  => true,
                'avatar_size' => 60,
            ));
            ?>
        </ol>
        <?php
        the_comments_pagination(array(
            'prev_text' => '&laquo;',
            'next_text' => '&raquo;',
        ));
    endif;

    if (!comments_open() && get_comments_number() && post_type_supports(get_post_type(), 'comments')) : ?>
        <p class="no-comments"><?php esc_html_e('I commenti sono chiusi.', 'studio-legale-mandroneniglio'); ?></p>
    <?php endif;

    $args = array(
        'title_reply_before' => '<h3 id="reply-title" class="comment-reply-title">',
        'title_reply_after'  => '</h3>',
        'class_submit'       => 'btn btn-primary',
    );
    comment_form($args); ?>
</div>

<?php
class SLM_Recent_Posts_Widget extends WP_Widget {
    public function __construct() {
        parent::__construct('slm_recent_posts', __('SLM Post Recenti', 'studio-legale-mandroneniglio'), array(
            'description' => __('Mostra i post recenti con stile Studio Legale', 'studio-legale-mandroneniglio'),
        ));
    }

    public function widget($args, $instance) {
        echo $args['before_widget'];
        $title = !empty($instance['title']) ? apply_filters('widget_title', $instance['title']) : __('Articoli Recenti', 'studio-legale-mandroneniglio');
        echo $args['before_title'] . esc_html($title) . $args['after_title'];

        $recent = new WP_Query(array(
            'posts_per_page' => !empty($instance['number']) ? $instance['number'] : 5,
            'post_status'    => 'publish',
            'ignore_sticky_posts' => true,
        ));

        if ($recent->have_posts()) : ?>
            <ul class="slm-recent-posts">
            <?php while ($recent->have_posts()) : $recent->the_post(); ?>
                <li>
                    <?php if (has_post_thumbnail()) : ?>
                        <a href="<?php the_permalink(); ?>" class="post-thumb"><?php the_post_thumbnail('thumbnail'); ?></a>
                    <?php endif; ?>
                    <div class="post-info">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        <span class="post-date"><?php echo get_the_date(); ?></span>
                    </div>
                </li>
            <?php endwhile; ?>
            </ul>
        <?php endif;
        wp_reset_postdata();
        echo $args['after_widget'];
    }

    public function form($instance) {
        $title  = !empty($instance['title']) ? $instance['title'] : '';
        $number = !empty($instance['number']) ? $instance['number'] : 5;
        ?>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php esc_html_e('Titolo:', 'studio-legale-mandroneniglio'); ?></label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('number')); ?>"><?php esc_html_e('Numero post:', 'studio-legale-mandroneniglio'); ?></label>
            <input class="tiny-text" id="<?php echo esc_attr($this->get_field_id('number')); ?>" name="<?php echo esc_attr($this->get_field_name('number')); ?>" type="number" value="<?php echo esc_attr($number); ?>" min="1">
        </p>
        <?php
    }

    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title']  = sanitize_text_field($new_instance['title']);
        $instance['number'] = intval($new_instance['number']);
        return $instance;
    }
}

class SLM_Forum_Categories_Widget extends WP_Widget {
    public function __construct() {
        parent::__construct('slm_forum_categories', __('SLM Categorie Forum', 'studio-legale-mandroneniglio'), array(
            'description' => __('Mostra le categorie del forum', 'studio-legale-mandroneniglio'),
        ));
    }

    public function widget($args, $instance) {
        echo $args['before_widget'];
        $title = !empty($instance['title']) ? apply_filters('widget_title', $instance['title']) : __('Categorie Forum', 'studio-legale-mandroneniglio');
        echo $args['before_title'] . esc_html($title) . $args['after_title'];

        $categories = get_terms(array(
            'taxonomy'   => 'slm_forum_category',
            'hide_empty' => false,
        ));
        if (!empty($categories) && !is_wp_error($categories)) : ?>
            <ul class="slm-forum-cats">
            <?php foreach ($categories as $cat) :
                $count = new WP_Query(array(
                    'post_type' => 'slm_forum_topic',
                    'tax_query' => array(array('taxonomy' => 'slm_forum_category', 'field' => 'term_id', 'terms' => $cat->term_id)),
                    'fields' => 'ids',
                ));
            ?>
                <li>
                    <a href="<?php echo esc_url(get_term_link($cat)); ?>">
                        <?php echo esc_html($cat->name); ?>
                        <span class="cat-count">(<?php echo intval($count->found_posts); ?>)</span>
                    </a>
                </li>
            <?php endforeach; ?>
            </ul>
        <?php endif;
        echo $args['after_widget'];
    }

    public function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : '';
        ?>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php esc_html_e('Titolo:', 'studio-legale-mandroneniglio'); ?></label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        <?php
    }

    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = sanitize_text_field($new_instance['title']);
        return $instance;
    }
}

function slm_register_widgets() {
    register_widget('SLM_Recent_Posts_Widget');
    register_widget('SLM_Forum_Categories_Widget');
}
add_action('widgets_init', 'slm_register_widgets');

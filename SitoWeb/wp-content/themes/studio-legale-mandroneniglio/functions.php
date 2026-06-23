<?php
define('SLM_THEME_VERSION', '1.0.0');
define('SLM_THEME_DIR', get_template_directory());
define('SLM_THEME_URI', get_template_directory_uri());

require_once SLM_THEME_DIR . '/inc/theme-setup.php';
require_once SLM_THEME_DIR . '/inc/enqueue.php';
require_once SLM_THEME_DIR . '/inc/custom-post-types.php';
require_once SLM_THEME_DIR . '/inc/forum.php';
require_once SLM_THEME_DIR . '/inc/users.php';
require_once SLM_THEME_DIR . '/inc/widgets.php';
require_once SLM_THEME_DIR . '/inc/helpers.php';

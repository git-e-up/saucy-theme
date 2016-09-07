<?php
/**
 * Sage includes
 *
 * The $sage_includes array determines the code library included in your theme.
 * Add or remove files to the array as needed. Supports child theme overrides.
 *
 * Please note that missing files will produce a fatal error.
 *
 * @link https://github.com/roots/sage/pull/1042
 */
$sage_includes = [
  'lib/assets.php',    // Scripts and stylesheets
  'lib/extras.php',    // Custom functions
  'lib/setup.php',     // Theme setup
  'lib/titles.php',    // Page titles
  'lib/wrapper.php',   // Theme wrapper class
  'lib/customizer.php' // Theme customizer
];

foreach ($sage_includes as $file) {
  if (!$filepath = locate_template($file)) {
    trigger_error(sprintf(__('Error locating %s for inclusion', 'sage'), $file), E_USER_ERROR);
  }

  require_once $filepath;
}
unset($file, $filepath);


add_action( 'init', 'create_posttype' );
function create_posttype() {
  register_post_type( 'hot_sauces',
    array(
      'labels' => array(
        'name' => __( 'Hot Sauces' ),
        'singular_name' => __( 'Hot Sauce' )
      ),
      'public' => true,
      'has_archive' => true,
      'show_ui' => true,
      'show_in_rest' => true,
      'hierarchical' => true,
      'rewrite' => array('slug' => 'hot_sauces'),
    )
  );
}

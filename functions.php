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
  'lib/customizer.php', // Theme customizer
  'lib/posts.php'      // Add posts to hot sauces
];

foreach ($sage_includes as $file) {
  if (!$filepath = locate_template($file)) {
    trigger_error(sprintf(__('Error locating %s for inclusion', 'sage'), $file), E_USER_ERROR);
  }

  require_once $filepath;
}
unset($file, $filepath);




// add_action( 'init', 'setting_my_first_cookie' );
//
// function setting_my_first_cookie() {
//   setcookie( '_wpnonce', wp_create_nonce('wp_json'), 30 * DAYS_IN_SECONDS, COOKIEPATH, COOKIE_DOMAIN );
//
//     setcookie( 'nonce', wp_create_nonce('wp_json'), 30 * DAYS_IN_SECONDS, COOKIEPATH, COOKIE_DOMAIN );
// }

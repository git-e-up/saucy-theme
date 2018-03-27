<?php

namespace Roots\Sage\Posts;
use Roots\Sage\Extras;

add_action( 'fm_post_post', function() {
  $fm = new \Fieldmanager_Media( array(
    'name' => 'demo-media',
  ) );
  $fm->add_meta_box('Media Field', array( 'post' ));
} );


add_action( 'rest_api_init', __NAMESPACE__ . '\\response_register_feat_img' );
function response_register_feat_img() {
    register_rest_field( 'post',
        'featured_image_url',
        array(
            'get_callback'    => __NAMESPACE__ . '\\response_get_feat_img',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}

function response_get_feat_img( $object, $request ) {
     return wp_get_attachment_url( get_post_thumbnail_id( $object[ 'id' ] ) );
}
//autocomplete on featured products
add_action( 'fm_post_hot_sauces', function() {

  $fm = new \Fieldmanager_Group( array(
    'name'           => 'repeatable_autocomplete',
    'limit'          => 0,
    'add_more_label' => 'Add another related product',
    'sortable'       => true,
    'label'          => 'Posts',
    'children'       => array(
        'product_id' 	=> new \Fieldmanager_Autocomplete( array(
            'label'  			=> 'Begin typing product name to search posts',
            'datasource' 	=> new \Fieldmanager_Datasource_Post( array(
              'query_args' => array ( 'post_type'=>'post')
            ) )
          ) )
    )
  ) );
  $fm->add_meta_box( 'Related Products', 'hot_sauces' );
} );


add_action( 'init', __NAMESPACE__ . '\\create_posttype' );
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


add_action( 'rest_api_init', __NAMESPACE__ . '\\slug_register_hot_posts' );
function slug_register_hot_posts() {
    register_rest_field( 'hot_sauces',
        'repeatable_autocomplete',
        array(
            'get_callback'    => __NAMESPACE__ . '\\slug_get_hot_posts',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}

/**
 * Get the value of the "repeatable_autocomplete" field
 *
 * @param array $object Details of current post.
 * @param string $field_name Name of field.
 * @param WP_REST_Request $request Current request
 *
 * @return mixed
 */
function slug_get_hot_posts( $object, $field_name, $request ) {
    //get list of post IDs from fieldmanager
    $post_ids = get_post_meta( $object[ 'id' ], $field_name, true );

    // If no repeatables, bail
    if( !$post_ids )
      return json_encode( '' );

    // $post_ids is two levels deep, we only care about the value at the
    // second depth, let's flatten the array

    // ex:
    // array(
    //  0 => array(
    //     product_id => 2
    //   )
    //   1 => array(
    //     product_id => 15
    //   )
    // )

    $tmpPosts = (object) array('posts' => array());
            array_walk_recursive($post_ids, create_function('&$v, $k, &$t', '$t->flatPosts[] = $v;'), $tmpPosts);

    // becomes:
    // $tmpPosts->flatPosts = array(2,15)
    // $hot_posts_ids is a flattened array of just the post ids
    $hot_post_ids = $tmpPosts->flatPosts;

    $hot_posts = get_posts(array( 'post__in' => $hot_post_ids ) );

    foreach( $hot_posts as $key => $value){
      $post = $hot_posts[$key];

      $url = wp_get_attachment_url( get_post_thumbnail_id($value->ID) );

      $post->featured_image_url = $url;

      $hot_posts[$key] = $post;
    }

    return json_encode( $hot_posts );


}

add_action( 'rest_api_init', __NAMESPACE__ . '\\register_svgs' );
function register_svgs() {
  header( 'Access-Control-Allow-Origin: *' );
  header( 'Access-Control-Allow-Methods: GET' );
  $svgs = array('matthew', 'name');
  foreach ($svgs as $svg){
    register_rest_route( 'wp/v2/svgs',
        $svg,
        array(
          'methods' => 'GET',
          'callback' => __NAMESPACE__ . '\\my_awesome_svg_' . $svg,
        )
    );
  }
}
function my_awesome_svg_matthew(){
  get_template_part( 'templates/matthew' );
  exit;
}
function my_awesome_svg_name(){
  get_template_part( 'templates/new', 'photo' );
  exit;
}
  // get_template_part( 'templates/new', 'photo' );

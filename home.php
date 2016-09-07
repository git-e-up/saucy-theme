


<?php
// $post_id = 7;

$args = array(
	'post_type' => 'hot_sauces',
  'posts_per_page' => 1,
  'orderby' => 'date',
  'order' => 'ASC',
);

$query = new WP_Query( $args );


if ( $query->have_posts() ) :

	while ( $query->have_posts() ) :
		$query->the_post(); ?>
		<div class="col-xs-12 text-center info-container">
      <!-- <h2><?php echo esc_html($post->post_title); ?></h2>
      <h4><?php the_content(); ?></h4> -->
    </div>
	<?php endwhile;

	/* Restore original Post Data */

endif;
?>

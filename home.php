


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
		$query->the_post();
    // only put that div there if there are posts
    ?>
    <ul class="side-nav">

    </ul>
		<section class="col-xs-12 text-center info-container">

    </section>
	<?php endwhile;

endif;
?>

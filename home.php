<?php get_template_part( 'templates/matthew' ); ?>

<?php


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
    <ul class="main-nav">

    </ul>
		<section class="col-xs-12 text-center info-container">
			<h1 class="init-header" style="display:none;">Hi There</h1>
    </section>

	<?php endwhile;
endif;
?>

<div class="modal-background"></div>

<?php while (have_posts()) : the_post(); ?>
  <article <?php post_class(); ?>>
    <header>
      <h1 class="entry-title"><?php the_title(); ?></h1>
      <?php get_template_part('templates/entry-meta'); ?>
    </header>
    <div class="entry-content">
      <?php the_content(); ?>
      <?php the_post_thumbnail();
      $meta_id=  get_post_meta( get_the_ID(), 'demo-media', true );
      $img_id = wp_get_attachment_metadata( $meta_id, $unfiltered );

       ?>
       <img src="<?php echo get_site_url(). '/wp-content/uploads/' .$img_id['file']; ?>">
    </div>
    <footer>
      <?php wp_link_pages(['before' => '<nav class="page-nav"><p>' . __('Pages:', 'sage'), 'after' => '</p></nav>']); ?>
    </footer>
    <?php comments_template('/templates/comments.php'); ?>
  </article>
<?php endwhile; ?>




<?php
$post_id = 7;
$queried_post = get_post($post_id);
$title = $queried_post->post_title; ?>
<div class="col-xs-12 text-center info-container">
  <h2><?php echo esc_html($title); ?></h2>
  <h4><?php echo esc_html($queried_post->post_content); ?></h4>
</div>

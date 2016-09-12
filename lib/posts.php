<?php

namespace Roots\Sage\Posts;
use Roots\Sage\Extras;


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
            'label'  			=> 'Begin typing product name to search store',
            'datasource' 	=> new \Fieldmanager_Datasource_Post( array(
              'query_args' => array ( 'post_type'=>'post')
            ) )
          ) )
    )
  ) );
  $fm->add_meta_box( 'Related Products', 'hot_sauces' );
} );

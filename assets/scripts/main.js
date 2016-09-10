/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Sage = {
    // All pages
    'common': {
      init: function() {

        $.ajax({
          url: 'wp-json/wp/v2/hot_sauces?filter[orderby]=date&order=asc',
          success: function(response) {
            $.each(response,function(index, el){

              $('.side-nav').append('<li data-slug="'+el.slug+'" data-postIndex="'+parseInt(response.indexOf(el)+2)+'">' + el.title.rendered + '</li>');
              // $('li').attr('data-postIndex', response.indexOf(el));
            });
          }
        });


        var postCount=1;
        $(document).on('click', '.side-nav li', function(){
          postCount = $(this).attr('data-postIndex');
          // console.log(postCount);
        });

        function getNextPost(i){
          // console.log(postCount);
          $.ajax({
            url: 'wp-json/wp/v2/hot_sauces?per_page=1&filter[orderby]=date&order=asc&page='+postCount,
            success: function(response) {
              // console.log(response);

              if(response.length === 1){
                $('.info-container').attr('data-slug', response[0].slug);

                // console.log(response[0].slug);
                $('.info-container').html('<h2>'+response[0].title.rendered+'</h2><h4>' + response[0].content.rendered+ '</h4>');
                postCount++;
              }else{
                postCount=1;
                getNextPost(postCount);
              }
            }
          });
        }


        // if .info-container exists (which will only happen after php puts it there), get the first post on initial load
        if( $('.info-container').length > 0){
            getNextPost(postCount);
            $('.info-container').attr('data-postIndex', '0');
        }

        $('.info-container').click(function(){
          getNextPost(postCount);
        });

        $(document).on('click', '.side-nav li', function(e){
          var slug = $(this).data('slug');
          // console.log(postCount);
          $.ajax({
            url: 'wp-json/wp/v2/hot_sauces',
            success: function(response) {
              // console.log(response);
              $.each(response,function(index, el){
                // response.reverse();
                if (slug == el.slug){

                  // $('.info-container').attr('data-postIndex', response.indexOf(el));
                  $('.info-container').html('<h2>'+el.title.rendered+'</h2><h4>' + el.content.rendered+ '</h4>');
                }
              });
            }
          });
        });


      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page
      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
      }
    },
    // About us page, note the change from about-us to about_us.
    'about_us': {
      init: function() {
        // JavaScript to be fired on the about us page
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Sage;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.

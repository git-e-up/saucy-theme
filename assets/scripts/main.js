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
        // JavaScript to be fired on all pages
        var postCount=1;
        function getNextPost(i){
          $.ajax({
            url: 'wp-json/wp/v2/hot_sauces?per_page=1&page='+postCount,
            success: function(response) {
              console.log(response);

              if(response.length === 1){

                $('.info-container').html('<h2>'+response[0].title.rendered+'</h2><h4>' + response[0].content.rendered)+ '</h4>';
                postCount++;
              }else{
                postCount=1;
                getNextPost(postCount);
              }
            }
          });
        }

        $('.info-container').click(function(){
          getNextPost(postCount);
        });

        /*
        $('.info-container').click(function(){

          $.ajax({
            url: 'wp-json/wp/v2/hot_sauces?per_page=1&page='+postCount,
            success: function(response) {
              if()
              console.log(response);

              // $.each(response,function(index,post){
              //   $('.info-container').html('<h2>'+post.title.rendered+'</h2><h4>' + post.content.rendered)+ '</h4>';
              //   console.log(post);
              // });

              var arNum = response.length;
              var i=0;
              $('.info-container').html(response);
              // $('.info-container').html('<h2>'+response[i].title.rendered+'</h2><h4>' + response[i].content.rendered)+ '</h4>';


              // while (i > arNum) {
              //   i++
              // }


              // for (var i = 0; i < arNum; i++) {
              //   // if (i > arNum) {
              //     i =-1;
              //   // }
              // }

              console.log(i);



              // for (var i = 0; i < arNum; i++) {
              //   console.log(i);
              //   $('.info-container').html('<h2>'+response[i].title.rendered+'</h2><h4>' + response[i].content.rendered)+ '</h4>';
              // }

              // console.log(response[0].title, response[0].content);



              // console.log(response.length);
              // console.log(response.order);
            }
          })
        })
        */
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

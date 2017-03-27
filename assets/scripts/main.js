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
        $('[data-toggle="tooltip"]').tooltip();  

        $.ajax({
          url: 'wp-json/wp/v2/hot_sauces?filter[orderby]=date&order=asc',
          success: function(response) {
            $.each(response,function(index, el){

              $('.main-nav').append('<li data-slug="'+el.slug+'" data-postIndex="'+parseInt(response.indexOf(el)+2)+'">' + el.title.rendered + '</li>');
              $('.init-header').fadeIn(1000);
            });
          }
        });


        var postCount=1;

        $(document).on('click', '.main-nav li', function(){
          postCount = $(this).attr('data-postIndex');
          $('.main-nav li').removeClass('bouncing');
          $(this).addClass('bouncing');
          $('.info-container').removeClass('sliding-up, sliding-right');
          // console.log(postCount);
        });

        function getNextPost(i){


          $('.main-nav li').removeClass('bouncing');
          $('.main-nav li:nth-of-type('+postCount+')').addClass('bouncing');
          $.ajax({
            url: 'wp-json/wp/v2/hot_sauces?per_page=1&filter[orderby]=date&order=asc&page='+postCount,
            success: function(response) {

              if(response.length === 1){
                if( JSON.parse( response[0].repeatable_autocomplete ) ){
                    var repeatables = JSON.parse( response[0].repeatable_autocomplete );
                    // console.log(repeatables);
                };

                $('.info-container').attr('data-slug', response[0].slug);

                // console.log(response[0].slug);


                setTimeout(function(){
                  $('.info-container').html('<span class="left-arrow"></span><span class="right-arrow"></span><h2>'+response[0].title.rendered+'</h2><div class="info-container-body">' + response[0].content.rendered+ '</div>'+ '<ul></ul>');

                  $.each(repeatables, function(index,el){
                    // console.log(el['post_name']);
                    $('.info-container > ul').append( "<li><div class='popup-preview'><div class='thumbnail-container' style='background:url("+el.featured_image_url+") center center no-repeat; background-size:cover'></div><h4>" + el.post_title + "</h4></div><section class='popup'><span class='x-close'></span>"+el.post_content+"</section></li>");
                  });
                }, 1500);
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
          setTimeout(function(){
            getNextPost(postCount);

            $('.info-container').attr('data-postIndex', '0').addClass('sliding-up');
            //add bouncing on init load
            $('.main-nav li:first-of-type').addClass('bouncing');
          }, 2000)

        }

        $('.info-container').on('click', '.right-arrow', function(){
          $('.info-container').addClass('sliding-right').removeClass('sliding-left, sliding-up');
          getNextPost(postCount);
          // console.log(postCount);
          setTimeout(function(){
            $('.info-container').removeClass('sliding-right');
          }, 3000);
        });

        $('.info-container').on('click', '.left-arrow', function(){
          $('.info-container').addClass('sliding-left').removeClass('sliding-right, sliding-up');
          postCount = postCount-1;
          postCount--;

          if (postCount <= 0) {

            postCount = $('.main-nav li').length;
          }
          getNextPost(postCount);
          // console.log(postCount);
          setTimeout(function(){
            $('.info-container').removeClass('sliding-left');
          }, 3000);
        });

        $(document).on('click', '.main-nav li', function(e){
          var slug = $(this).data('slug');
          // console.log(postCount);
          $('.info-container').removeClass('sliding-right, sliding-up');
          $.ajax({
            url: 'wp-json/wp/v2/hot_sauces',
            success: function(response) {
              $.each(response,function(index, el){
                if (slug == el.slug){
                  if( JSON.parse( el.repeatable_autocomplete ) ){
                      var repeatables = JSON.parse( el.repeatable_autocomplete )
                  };

                  $('.info-container').addClass('sliding-up');
                  $('.info-container').attr('data-slug', el.slug);

                  setTimeout(function(){
                    $('.info-container').html('<span class="left-arrow"></span><span class="right-arrow"></span><h2>'+el.title.rendered+'</h2><div class="info-container-body">' + el.content.rendered+ '</div>' + '<ul></ul>');

                    $.each(repeatables, function(index,el){
                      $('.info-container > ul').append( "<li><div class='popup-preview'><div class='thumbnail-container' style='background:url("+el.featured_image_url+") center center no-repeat; background-size:cover'></div><h4>" + el.post_title + "</h4></div><section class='popup'><span class='x-close'></span>"+el.post_content+"</section></li>")
                    });


                  },1500);
                }
              });
            }
          });
        });

        $('body').on('click', '.popup-preview', function() {
          $(this).siblings('.popup').addClass('show-popup');
          $('.modal-background').addClass('modal-background-open');
        });

        $('.modal-background').click(function(){
          $(this).removeClass('modal-background-open');
          $('.popup').removeClass('show-popup');
        });

        $('body').on('click', '.x-close', function(){
          $('.modal-background').removeClass('modal-background-open');
          $('.popup').removeClass('show-popup');
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

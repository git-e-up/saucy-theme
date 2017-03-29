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

              $('.main-nav').append('<li class="main-nav__item" data-slug="'+el.slug+'" data-postIndex="'+parseInt(response.indexOf(el)+2)+'">' + el.title.rendered + '</li>');
              $('.init-header').fadeIn(1000);
            });
          }
        });


        var postCount=1;

        $(document).on('click', '.main-nav__item', function(){
          postCount = $(this).attr('data-postIndex');
          $('.main-nav__item').removeClass('main-nav__item--bouncing');
          $(this).addClass('main-nav__item--bouncing');
          $('.info').removeClass('info--sliding-up, info--sliding-right');
                    $('.info__left-arrow, .info__right-arrow').addClass('arrow--sliding');
        });

        function getNextPost(i){

          $('.main-nav__item').removeClass('main-nav__item--bouncing');
          $('.main-nav__item:nth-of-type('+postCount+')').addClass('main-nav__item--bouncing');
          $.ajax({
            url: 'wp-json/wp/v2/hot_sauces?per_page=1&filter[orderby]=date&order=asc&page='+postCount,
            success: function(response) {

              if(response.length === 1){
                if( JSON.parse( response[0].repeatable_autocomplete ) ){
                    var repeatables = JSON.parse( response[0].repeatable_autocomplete );
                };

                $('.info').attr('data-slug', response[0].slug);


                setTimeout(function(){
                  $('.info').html('<span class="info__left-arrow"></span><span class="info__right-arrow"></span><h2>'+response[0].title.rendered+'</h2><div class="info__body">' + response[0].content.rendered+ '</div>'+ '<ul class="info__list"></ul>');

                  $.each(repeatables, function(index,el){
                    // console.log(el['post_name']);
                    $('.info__list').append( "<li class='info__list__item'><div class='info__popup__preview'><div class='thumbnail-container' style='background:url("+el.featured_image_url+") center center no-repeat; background-size:cover'></div><h4>" + el.post_title + "</h4></div><section class='info__popup'><span class='x-close'></span>"+el.post_content+"</section></li>");
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



        // if .info exists (which will only happen after php puts it there), get the first post on initial load
        if( $('.info').length > 0){
          setTimeout(function(){
            getNextPost(postCount);

            $('.info').attr('data-postIndex', '0').addClass('info--sliding-up');
            //add main-nav__item--bouncing on init load
            $('.main-nav__item:first-of-type').addClass('main-nav__item--bouncing');
          }, 2000)

        }

        $('.info').on('click', '.info__right-arrow', function(){
          $('.info').addClass('info--sliding-right').removeClass('info--sliding-left, info--sliding-up');
          $('.info__left-arrow, .info__right-arrow').addClass('arrow--sliding');
          getNextPost(postCount);

          setTimeout(function(){
            $('.info').removeClass('info--sliding-right');
          }, 3000);
        });

        $('.info').on('click', '.info__left-arrow', function(){
          $('.info').addClass('info--sliding-left').removeClass('info--sliding-right, info--sliding-up');
          $('.info__left-arrow, .info__right-arrow').addClass('arrow--sliding');
          postCount = postCount-1;
          postCount--;

          if (postCount <= 0) {

            postCount = $('.main-nav__item').length;
          }
          getNextPost(postCount);

          setTimeout(function(){
            $('.info').removeClass('info--sliding-left');
          }, 3000);
        });

        $(document).on('click', '.main-nav__item', function(e){
          var slug = $(this).data('slug');

          $('.info').removeClass('info--sliding-right, info--sliding-up');
          $.ajax({
            url: 'wp-json/wp/v2/hot_sauces',
            success: function(response) {
              $.each(response,function(index, el){
                if (slug == el.slug){
                  if( JSON.parse( el.repeatable_autocomplete ) ){
                      var repeatables = JSON.parse( el.repeatable_autocomplete )
                  };

                  $('.info').addClass('info--sliding-up');
                  $('.info').attr('data-slug', el.slug);

                  setTimeout(function(){
                    $('.info').html('<span class="info__left-arrow"></span><span class="info__right-arrow"></span><h2>'+el.title.rendered+'</h2><div class="info__body">' + el.content.rendered+ '</div>' + '<ul class="info__list"></ul>');

                    $.each(repeatables, function(index,el){
                      $('.info__list').append( "<li class='info__list__item'><div class='info__popup__preview'><div class='thumbnail-container' style='background:url("+el.featured_image_url+") center center no-repeat; background-size:cover'></div><h4>" + el.post_title + "</h4></div><section class='info__popup'><span class='x-close'></span>"+el.post_content+"</section></li>")
                    });


                  },1500);
                }
              });
            }
          });
        });

        $('body').on('click', '.info__popup__preview', function() {
          $(this).siblings('.info__popup').addClass('info--show-popup');
          $('.modal-background').addClass('modal-background--open');
          $('body').css('overflow', 'hidden');
        });

        $('.modal-background').click(function(){
          $(this).removeClass('modal-background--open');
          $('.info__popup').removeClass('info--show-popup');
          $('body').css('overflow', 'auto');
        });

        $('body').on('click', '.x-close', function(){
          $('.modal-background').removeClass('modal-background--open');
          $('.info__popup').removeClass('info--show-popup');
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

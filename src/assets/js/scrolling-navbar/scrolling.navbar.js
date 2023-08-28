'use strict';

(function($) {
  let $lastScrollTop = 0

  $(window).on('scroll', function() {
    const $positionScroll = $(this).scrollTop(),
      $navbar = $('header')

    if ($positionScroll > 100) {
      $navbar.addClass('header_fixed-hidden')

      setTimeout(() => {
        $navbar.addClass('header_fixed-visible')
      }, 100)

    } else if ($positionScroll === 0) {
      $navbar.add('header_absolute-visible')
      $navbar.removeClass('header_fixed-hidden')
      setTimeout(() => {
        $navbar.removeClass('header_absolute-visible')
        $navbar.removeClass('header_fixed-visible')
      }, 300)
    }

    $lastScrollTop = $positionScroll
  })
}(jQuery))

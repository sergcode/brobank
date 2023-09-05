(function($) {
  let $lastScrollTop = 0

  $(window).on('scroll', function() {
    const $positionScroll = $(this).scrollTop(),
          $navbar = $('header')

    if ($navbar.offset().top > 76) {
      $navbar.addClass("top-nav-collapse");

      if ($positionScroll > $lastScrollTop) {
        $navbar.addClass("scrollDown");

      } else {
        $navbar.removeClass('scrollDown');
      }

    } else {
      $navbar.removeClass("top-nav-collapse");
    }

    $lastScrollTop = $positionScroll
  })
}(jQuery))

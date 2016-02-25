function debounce(func, wait, immediate) {
  // taken from Underscore.js
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) {
        func.apply(context, args);
      }
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
      func.apply(context, args);
    }
	};
}

(function(){
  var btns = {'btn-home': $('#home'),
            'btn-about': $('#about'),
            'btn-skills': $('#skills'),
            'btn-projects': $('#projects'),
            'btn-contact': $('#contact')
            };

  function smoothScroll(time) {
    function animate(e) {
      // smooth scrolling from @rahul_send89 function
      // http://stackoverflow.com/a/26094310/1405004
      var elem = btns[e.target.id][0];
      var to = elem.offsetTop;
      var from = window.scrollY;
      var start = new Date().getTime(),
          timer = setInterval(function() {
            var step = Math.min(1,(new Date().getTime()-start)/time);
                window.scrollTo(0,(from+step*(to-from))+1);
                if( step === 1){
                  clearInterval(timer);
                }
          },25);
          window.scrollTo(0,(from+1));
    }
    return animate;
  }

  // «¡Hola!» svg drawing animation
  var $paths = $('#paths');
  var greeting = new Vivus('greeting',  {
    type: "oneByOne",
    duration: 225,
    pathTimingFunction: Vivus.LINEAR,
		animTimingFunction: Vivus.LINEAR
  }, function () {
    $paths.addClass('drawn');
  });

  // smooth scrolling
  {
    let $btns = $('.nav-link');
    $btns.on('click', smoothScroll(200));
  }

  // menu mobile
  var $mobilemenu = $('#mobile-menu');
  var $menuMobileContainer = $('#navbar-mobile-menu-container');
  // sectionsLinks used in toggleFoldedMenu and fireActionOnScroll
  var $sectionLinks = $('.nav-link');
  var [home, about, skills, projects, contact] = ['home', 'about', 'skills', 'projects', 'contact'].map(section => $('#btn-' + section));

  function toggleFoldedMenu() {
    var folded = $menuMobileContainer.attr('data-folded');
    if (folded === 'true') {
      $menuMobileContainer.attr('data-folded', 'false');
      $sectionLinks.on('click', toggleFoldedMenu);
    } else {
      $menuMobileContainer.attr('data-folded', 'true');
      $sectionLinks.off('click', toggleFoldedMenu);
    }
  }

  $mobilemenu.on('click', toggleFoldedMenu);

  // Fire animations and update navbar when scroll to the proper section
  var sections = new Map();
  ["home", "about", "skills", "projects", "contact"].forEach(section => sections.set(section, $('#' + section)[0].offsetTop));
  var $chartBars = $('.chart-bar');

  function toggleClassAllocationNodeList(nodeTarget, nodeList, className) {
    // remove «className» from other nodes of nodeList and add it to nodeTarget
    if (!nodeTarget.hasClass(className)) {
        nodeList.removeClass(className);
        nodeTarget.addClass(className);
      }
  }

  function fireActionOnScroll(e) {
    var scrollPos = (e.pageY)? e.pageY + 100: e.currentTarget.pageYOffset + 100;
    if ((scrollPos < sections.get('about')) || Number.isNaN(scrollPos)) {
      // do something in home
      toggleClassAllocationNodeList(home, $sectionLinks, 'current-section');
    } else if (scrollPos < sections.get('skills')) {
      // do something in about
      toggleClassAllocationNodeList(about, $sectionLinks, 'current-section');
    } else if (scrollPos < sections.get('projects')) {
      // do something in skills
      toggleClassAllocationNodeList(skills, $sectionLinks, 'current-section');
      $chartBars.addClass('animate-bar');
    } else if (scrollPos < sections.get('contact')) {
      // do something in projects
      toggleClassAllocationNodeList(projects, $sectionLinks, 'current-section');
    } else {
      // do something in contact
      toggleClassAllocationNodeList(contact, $sectionLinks, 'current-section');
    }
  }

  var fireOnScroll = debounce(fireActionOnScroll, 100);

  $(window).on('scroll', fireOnScroll);

  // carousel
  {
    let autoplay = true;
    let src, alt;
    let $carouselControl = $('#carousel-control');
    let $carouselControlBtn = $('#carousel-control-btn');
    let panelWidth = $carouselControl[0].clientWidth;
    let $carousel = $('#carousel');
    let totalWidth = $carousel[0].clientWidth;
    let $carouselScrollIcons = $('.carousel-scroll-icon')
    let translate = 0;

    function panelToTheRight() {
      if (translate < 0) {
        translate += panelWidth;
      } else {
        translate = -totalWidth + panelWidth;
      }
      $carousel.css('transform', 'translateX(' + translate + 'px)');
    }

    function panelToTheLeft() {
      if ((translate <= 0) && (translate > -totalWidth + panelWidth)) {
        translate -= panelWidth;
      } else {
        translate = 0;
      }
      $carousel.css('transform', 'translateX(' + translate + 'px)');
    }
    // carousel scroll control
    function scrollCarousel(e) {
      e.preventDefault();
      if(e.deltaY < 0) {
        panelToTheRight()
      } else {
        panelToTheLeft();
      }
    }
    // carousel control toggle
    $carouselControlBtn.on('click', function() {
      autoplay = (autoplay)? false: true;
      $carousel.toggleClass('carousel-animation');

      if(autoplay) {
        src = 'assets/images/pause.svg';
        alt = 'Pause';
        translate = 0;
        $carousel.css('transform', 'translateX(' + translate + 'px)');
        $carousel.off('wheel', scrollCarousel);
      } else {
        src = 'assets/images/play.svg';
        alt = 'Play';
        $carousel.on('wheel', scrollCarousel);
      }
      $carouselControlBtn.attr({'src': src, 'alt': alt});
      $carouselScrollIcons.toggleClass('hide');
    });

    // carousel touch control
    let carousel = document.getElementById('carousel');
    let hammer = new Hammer.Manager(carousel);

    hammer.add( new Hammer.Swipe({direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10}));
    hammer.on('swiperight', panelToTheRight);
    hammer.on('swipeleft', panelToTheLeft);
  }

  // add email address
  {
     $('#email').attr('href', 'mailto:juanriqgon@gmail.com');
  }
})();
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

  function onMarkerClick(e) {
      e.target.openPopup();
  }

  {
    // render the map of contact section
    let map = L.map('map', {
      center: [37.9410106, -1.1398814],
      doubleClickZoom: 'center',
      dragging: false,
      scrollWheelZoom: false,
      zoom: 11
    });
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoianVhbnJpcWdvbiIsImEiOiJjaWs5MGR2bTAwMDA4d2xsdjNwOXQ3eXQ1In0.Y7PbFkq-Wxa2Kn5O1CWgUg', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
      id: 'juanriqgon.p2ln61p7',
      accessToken: 'pk.eyJ1IjoianVhbnJpcWdvbiIsImEiOiJjaWs5MGR2bTAwMDA4d2xsdjNwOXQ3eXQ1In0.Y7PbFkq-Wxa2Kn5O1CWgUg'
    }).addTo(map);
    L.Icon.Default.imagePath = '../assets/images';
    let marker = L.marker([37.9410106, -1.1398814]).addTo(map);
    marker.bindPopup("I live around here.");
    marker.addEventListener('click', onMarkerClick);
  }

  // render the contact form
  var $contactWays = $('#contact-ways');
  var contactForm = '<form class="contact-form" action="http://pooleapp.com/stash/52a1c0eb-dcc6-45b9-8923-73309fbb729b/" method="post">\n\t<input type="hidden" name="redirect_to" value="{YOUR-THANKS-PAGE}" />\n\t<p>\n\t\t<label for="name">Name\n\t\t\t<input class="contact-field" type="text" name="name" id="name" placeholder="What\'s your name?" />\n\t\t</label>\n\t</p>\n\t<p>\n\t\t<label for="e-mail">E-mail\n\t\t\t<input class="contact-field" type="email" name="email" id="email" placeholder="An email to answer you">\n\t\t</label>\n\t</p>\n\t<p>\n\t\t<label for="message">Message\n\t\t\t<textarea class="message" id="message" name="message" rows="5" placeholder="Your message"></textarea>\n\t\t</label>\n\t</p>\n\t<p>\n\t\t<input class="submit" type="submit" value="Submit" />\n\t</p>\n</form>';
  $contactWays.append(contactForm);

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
    let $carouselControl = $('#carousel-control-btn');
    let $carousel = $('#carousel');
    let $carouselScrollIcons = $('.carousel-scroll-icon')
    let degs = 0;
    function scrollCarousel(e) {
      e.preventDefault();
      degs = ((e.deltaY < 0)? degs + 10: degs - 10);
      $carousel.css('transform', 'rotateY(-' + degs +'deg)');
    }
    // carousel control toggle
    $carouselControl.on('click', function() {
      autoplay = (autoplay)? false: true;
      $carousel.toggleClass('carousel-animation');

      if(autoplay) {
        src = 'assets/images/pause.svg';
        alt = 'Pause';
        $carousel.off('wheel', scrollCarousel);
      } else {
        src = 'assets/images/play.svg';
        alt = 'Play';
        $carousel.on('wheel', scrollCarousel);
      }
      $carouselControl.attr({'src': src, 'alt': alt});
      $carouselScrollIcons.toggleClass('hide');
    });

    // carousel manual pan
    let carousel = document.getElementById('carousel');
    let hammer = new Hammer.Manager(carousel);

    hammer.add( new Hammer.Swipe({direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10}));
    hammer.on('swiperight', function(e) {
        degs -= 60;
        $carousel.css('transform', 'rotateY(-' + degs + 'deg)');
    });
    hammer.on('swipeleft', function(e) {
      degs += 60;
      $carousel.css('transform', 'rotateY(-' + degs + 'deg)');
    });
  }
})();
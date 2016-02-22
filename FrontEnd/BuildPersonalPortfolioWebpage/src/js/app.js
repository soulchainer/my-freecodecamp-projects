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

function hasClass(el, className) {
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return el.className.indexOf(className) !== new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
}
function addClass(el, className) {
  if (el.classList) {
    if (!hasClass(el, className)) {
      el.classList.add(className);
    }
  } else {
    el.className += ' ' + className;
  }
}

function removeClass(el, className) {
  if (hasClass(el, className)) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
      el.className.replace(new RegExp('(^| )' + className + '( |$)', 'g'), '');
    }
  }
}


(function(){
  var btns = {'btn-home': document.getElementById('home'),
            'btn-about': document.getElementById('about'),
            'btn-projects': document.getElementById('projects'),
            'btn-contact': document.getElementById('contact')
            };
  function smoothScroll(time) {
    function animate(e) {
      // smooth scrolling from @rahul_send89 function
      // http://stackoverflow.com/a/26094310/1405004
      var elem = btns[e.target.id];
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
  var paths = document.getElementById('paths');
  var greeting = new Vivus('greeting',  {
    type: "oneByOne",
    duration: 225,
    pathTimingFunction: Vivus.LINEAR,
		animTimingFunction: Vivus.LINEAR
  }, function () {
    paths.classList.add('drawn');
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
  var contactWays = document.getElementById('contact-ways');
  var contactForm = '<form class="contact-form" action="http://pooleapp.com/stash/52a1c0eb-dcc6-45b9-8923-73309fbb729b/" method="post">\n\t<input type="hidden" name="redirect_to" value="{YOUR-THANKS-PAGE}" />\n\t<p>\n\t\t<label for="name">Name\n\t\t\t<input class="contact-field" type="text" name="name" id="name" placeholder="What\'s your name?" />\n\t\t</label>\n\t</p>\n\t<p>\n\t\t<label for="e-mail">E-mail\n\t\t\t<input class="contact-field" type="email" name="email" id="email" placeholder="An email to answer you">\n\t\t</label>\n\t</p>\n\t<p>\n\t\t<label for="message">Message\n\t\t\t<textarea class="message" id="message" name="message" rows="5" placeholder="Your message"></textarea>\n\t\t</label>\n\t</p>\n\t<p>\n\t\t<input class="submit" type="submit" value="Submit" />\n\t</p>\n</form>';
  contactWays.insertAdjacentHTML('beforeend', contactForm);

  // smooth scrolling
  {
    let btns = document.querySelectorAll('.nav-link');
    for (let i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', smoothScroll(200));
    }
  }

  // menu mobile
  var mobilemenu = document.getElementById('mobile-menu');
  var menuMobileContainer = document.getElementById('navbar-mobile-menu-container');
  // sectionsLinks used in toggleFoldedMenu and fireActionOnScroll
  var sectionLinks = document.querySelectorAll('.nav-link');
  var [home, about, skills, projects, contact] = sectionLinks;
  function toggleFoldedMenu() {
    var folded = menuMobileContainer.getAttribute('data-folded');
    if (folded === 'true') {
      menuMobileContainer.setAttribute('data-folded', 'false');
      [home, about, skills, projects, contact].forEach(el => el.addEventListener('click', toggleFoldedMenu));
      return;
    }
    menuMobileContainer.setAttribute('data-folded', 'true');
  }

  mobilemenu.addEventListener('click', toggleFoldedMenu);

  // Fire animations and update navbar when scroll to the proper section
  var sections = new Map();
  ["home", "about", "skills", "projects", "contact"].forEach(section => sections.set(section, document.getElementById(section).offsetTop));
  var chartBars = document.querySelectorAll('.chart-bar');

  function toggleClassAllocationNodeList(nodeTarget, nodeList, className) {
    // remove «className» from other nodes of nodeList and add it to nodeTarget
    if (!hasClass(nodeTarget, className)) {
        Array.prototype.forEach.call(nodeList, el=>removeClass(el, className));
      }
      addClass(nodeTarget, className);
  }

  function fireActionOnScroll(e) {
    var scrollPos = e.pageY + 100;
    if (scrollPos < sections.get('about')) {
      // do something in home
      toggleClassAllocationNodeList(home, sectionLinks, 'current-section');
    } else if (scrollPos < sections.get('skills')) {
      // do something in about
      toggleClassAllocationNodeList(about, sectionLinks, 'current-section');
    } else if (scrollPos < sections.get('projects')) {
      // do something in skills
      toggleClassAllocationNodeList(skills, sectionLinks, 'current-section');
      Array.prototype.forEach.call(chartBars, el => addClass(el, 'animate-bar'));
    } else if (scrollPos < sections.get('contact')) {
      // do something in projects
      toggleClassAllocationNodeList(projects, sectionLinks, 'current-section');
    } else {
      // do something in contact
      toggleClassAllocationNodeList(contact, sectionLinks, 'current-section');
    }
  }

  var fireOnScroll = debounce(fireActionOnScroll, 100);

  window.addEventListener('scroll', fireOnScroll);

  // carousel
  {
    let autoplay = true;
    let carouselControl = document.getElementById('carousel-control');
    let carousel = document.getElementById('carousel');
    let degs = 0;
    function scrollCarousel(e) {
      e.preventDefault();
      degs = ((e.deltaY < 0)? degs + 10: degs - 10);
      carousel.style.transform = "rotateY(-" + degs +"deg)";
    }
    // carousel control toggle
    carouselControl.addEventListener('click', function() {
      autoplay = (autoplay)? false: true;

      if(autoplay) {
        carouselControl.textContent = 'Autoplay';
        addClass(carousel, 'carousel-animation');
        carousel.removeEventListener('wheel', scrollCarousel);
      } else {
        carouselControl.textContent = 'Swipe';
        removeClass(carousel, 'carousel-animation');
        carousel.addEventListener('wheel', scrollCarousel);
      }
    });

    // carousel manual pan
    let hammer = new Hammer.Manager(carousel);

    hammer.add( new Hammer.Swipe({direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10}));
    hammer.on('swiperight', function(e) {
        degs -= 60;
        carousel.style.transform = "rotateY(-" + degs +"deg)";
    });
    hammer.on('swipeleft', function(e) {
      degs += 60;
      carousel.style.transform = "rotateY(-" + degs +"deg)";
    });
  }
})();
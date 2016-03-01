(function(){

  'use strict';

  // «¡Hola!» svg drawing animation
  function drawLogo() {
    var $paths = $('#paths');
    var greeting = new Vivus('greeting',  {
      type: "oneByOne",
      duration: 225,
      pathTimingFunction: Vivus.LINEAR,
      animTimingFunction: Vivus.LINEAR
    }, function () {
      $paths.addClass('drawn');
    });
  }

  // All the scroll related functionality
  function ScrollManager() {
  }

  ScrollManager.prototype.smoothScroll = function(time, obj) {
    var self = obj;
    var animate = function(e) {
      // smooth scrolling from @rahul_send89 function
      // http://stackoverflow.com/a/26094310/1405004
      var to = self.smoothMap.get(e.target.id)[0].offsetTop;
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
    };
    return animate;
  };
  // init smooth scroll from the elements matching selector to the elements
  // specified in attribute data-to of that elements
  ScrollManager.prototype.initSmoothScroll = function(selector, time=200) {
    var self = this;
    self.items = $(selector);
    // Map of pairs «id» origin button → DOM element to scroll
    self.smoothMap = new Map(self.items.toArray()
    .map(el => [el.id, $('#' + $(el).attr('data-to'))]));

    self.items.on('click', self.smoothScroll(time, self));
  };
  // Fire functions when scroll to the proper section
  ScrollManager.prototype.fireOnScroll = function(e, breakpoints, offset) {
    // breakpoints is a Map of node → function to execute when scroll near it
    // nodes should be in order and should be the bottom bound who delimited
    // the wanted area, nor the upper one: fireOnScroll executes a function
    // when you get just before the breakpoint, not after
    var scrollPos = (e.pageY)? e.pageY + offset: e.currentTarget.pageYOffset + offset;

    var brks = breakpoints.keys();

    for (let node of brks) {
      if(scrollPos < node[0].offsetTop) {
        breakpoints.get(node)();
        break;
      }
    }
  };

  ScrollManager.prototype.initFireOnScroll = function(breakpoints, offset=100) {
    let self = this;
    $(window).on('scroll', ((e) => self.fireOnScroll(e, breakpoints, offset)));
  };

  // menu mobile
  function MenuMobile() {
    this.menu = $('#mobile-menu');
    this.menuContainer = $('#navbar-mobile-menu-container');
    this.sectionLinks = $('.nav-link');
    this.body = $('body');
  }
  // fold/unfold the menu
  MenuMobile.prototype.toggleFoldedMenu = function(obj) {
    var self = obj;
    var folded = self.menuContainer.attr('data-folded');

    if (folded === 'true') {
      self.menuContainer.attr('data-folded', 'false');
    } else {
      self.menuContainer.attr('data-folded', 'true');
    }
    self.body.toggleClass('noscroll');
  };
  MenuMobile.prototype.init = function() {
    var self = this;
    this.menu.on('click', (() => self.toggleFoldedMenu(self)));
    this.sectionLinks.on('click', (() => self.toggleFoldedMenu(self)));
  };

  // carousel
  function Carousel() {
    this.autoplay = true;
    this.controlBtn = $('#carousel-control-btn');
    this.panelWidth = $('#projects-device')[0].clientWidth;
    this.panels = $('#carousel');
    this.allPanelsWidth = this.panels[0].clientWidth;
    this.swipeBtn = $('#swipe');
    this.swipeStartPos = null;
    this.translatePanels = 0;
  }

  // start the carousel
  Carousel.prototype.init = function() {
    this.addSwipeListener();
    this.togglePlayMode();
    this.watchPanelWidth();
  };

  // carousel panel movement
  Carousel.prototype.panelsToTheRight = function() {
    if (this.translatePanels < 0) {
      this.translatePanels += this.panelWidth;
    } else {
      this.translatePanels = -this.allPanelsWidth + this.panelWidth;
    }
    this.panels.css('transform', 'translateX(' + this.translatePanels + 'px)');
  };
  Carousel.prototype.panelsToTheLeft = function() {
    if ((this.translatePanels <= 0) &&
        (this.translatePanels > -this.allPanelsWidth + this.panelWidth)) {
      this.translatePanels -= this.panelWidth;
    } else {
      this.translatePanels = 0;
    }
    this.panels.css('transform', 'translateX(' + this.translatePanels + 'px)');
  };

  // carousel desktop swipe control
  Carousel.prototype.startSwipe = function(e) {
    this.swipeStartPos = e.deltaX;
  };
  Carousel.prototype.endSwipe = function(e) {
    if((this.swipeStartPos - e.deltaX) < 0) {
      this.panelsToTheRight();
    } else {
      this.panelsToTheLeft();
    }
  };

  // carousel touch control
  Carousel.prototype.addSwipeListener = function() {
    let panels = document.getElementById('carousel');
    let hammer = new Hammer.Manager(panels);
    let carousel = this;

    hammer.add( new Hammer.Swipe({direction: Hammer.DIRECTION_HORIZONTAL, threshold: 10}));
    hammer.on('swiperight', (()=>carousel.panelsToTheRight()));
    hammer.on('swipeleft', (()=>carousel.panelsToTheLeft()));
  };

  // carousel control toggle
  Carousel.prototype.togglePlayMode = function() {
    let alt = null;
    let carousel = this;

    this.controlBtn.on('click', function(e, self=carousel) {
      let $this = $(this);
      self.autoplay = (self.autoplay)? false: true;
      self.panels.toggleClass('carousel-animation');

      if(self.autoplay) {
        self.translatePanels = 0;
        self.panels
        .css('transform', 'translateX(' + self.translatePanels + 'px)');
        alt = 'Stop';
        self.panels.off('dragstart', self.startSwipe);
        self.panels.off('dragend', self.endSwipe);
      } else {
        alt = 'Autoplay';
        self.panels.on('dragstart', self.startSwipe);
        self.panels.on('dragend', self.endSwipe);
      }
      $this.attr('alt', alt);
      $this.toggleClass('icon-stop');
      $this.toggleClass('icon-play');
      self.swipeBtn.toggleClass('hide');
      self.swipeBtn.toggleClass('swipe');
    });
  };

  // get panel width after window resize
  Carousel.prototype.watchPanelWidth = function() {
    let self = this;
    let updatePanelWidths = function(self) {
      function updateWidths () {
        self.panelWidth = $('#projects-device')[0].clientWidth;
        self.allPanelsWidth = self.panels[0].clientWidth;
      }
      return updateWidths;
    };
    $(window).on('resize', updatePanelWidths(self));
  };

  // Main
  {
    // drawn the main logo
    drawLogo();
    // menu mobile functionality
    var menuMobile = new MenuMobile();
    menuMobile.init();

    // scroll functionality
    var scroll = new ScrollManager();
    scroll.initSmoothScroll('.nav-link');

    var className = 'current-section';
    var sectionLinks =  $('.nav-link');

    var toggleOnlyListClass = function(nodeTarget, nodeList, className) {
    // remove «className» from other nodes of nodeList and add it to nodeTarget
      if (!nodeTarget.hasClass(className)) {
          nodeList.removeClass(className);
          nodeTarget.addClass(className);
        }
    };
    // breakpoints for execute actions according to scroll position
    var breaks = new Map();
    breaks.set($('#about'), (()=>toggleOnlyListClass($('#btn-home'), sectionLinks, className)));
    breaks.set($('#skills'), (()=>toggleOnlyListClass($('#btn-about'), sectionLinks, className)));
    breaks.set($('#projects'), function() {
      toggleOnlyListClass($('#btn-skills'), sectionLinks, className);
      $('.chart-bar').addClass('animate-bar');
    });
    breaks.set($('#contact'), (()=>toggleOnlyListClass($('#btn-projects'), sectionLinks, className)));
    breaks.set($('#footer'), (()=>toggleOnlyListClass($('#btn-contact'), sectionLinks, className)));

    scroll.initFireOnScroll(breaks);

    // carousel functionality
    var carousel = new Carousel();
    carousel.init();

    // add mail address
    $('#mail').attr('href', 'mailto:juanriqgon@gmail.com');
  }
})();
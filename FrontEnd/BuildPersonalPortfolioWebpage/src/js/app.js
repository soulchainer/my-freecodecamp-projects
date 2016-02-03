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


(function(){
  var Vivus = require('vivus');

  var paths = document.getElementById('paths');
  var greeting = new Vivus('greeting',  {
    type: "oneByOne",
    pathTimingFunction: Vivus.LINEAR,
		animTimingFunction: Vivus.LINEAR
  }, function () {
    paths.classList.add('drawn');
  });
  greeting.play(1);

  // smooth scrolling
  var btns = document.querySelectorAll('.nav-link>a');
  for (let i = 0; i < btns.length; i++) {
    btns[i].addEventListener('click', smoothScroll(200));
  }
})();
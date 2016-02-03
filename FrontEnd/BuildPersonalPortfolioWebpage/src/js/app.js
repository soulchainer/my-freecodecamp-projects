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
})();
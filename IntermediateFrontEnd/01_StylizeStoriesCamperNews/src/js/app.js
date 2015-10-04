(function(){
  var app = angular.module('campernews', ['angularLazyImg']).config(['lazyImgConfigProvider', function(lazyImgConfigProvider){ // config for lazy loading images
    var scrollable = document.querySelector('#scrollable');
    lazyImgConfigProvider.setOptions({
      errorClass: 'error', // in case of loading image failure what class should be added
       successClass: 'success', // in case of loading image success what class should be added
      onError: function(image){ // fired on loading image error
        image.$elem[0].setAttribute("src", "img/camper-image-placeholder.png");
      }
    });
  }]);

  app.directive('news', ['$http', function($http){
    return {
      restrict: 'E',
      templateUrl: 'templates/news.html',
      controller: function($http){
        var camperNews = this;
        camperNews.placeholder = "img/camper-image-placeholder.png";
        camperNews.articles = [];
        $http.get('http://www.freecodecamp.com/news/hot').success(function(data){
          camperNews.articles = data;
        });
      },
      controllerAs: 'news',
    };
  }]);
})();
smoothScroll.init();

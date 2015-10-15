(function(){
  var app = angular.module('wikiviewer', []);
  var baseURL = 'https://en.wikipedia.org/w/api.php?&format=json&callback=JSON_CALLBACK&';
  var searchInput = document.getElementById("search");
  angular.element(window).on('resize', function(event){
    var touched = angular.element(searchInput).hasClass('ng-touched');
    if (!touched) {
      event.preventDefault();
    }
  });

  function encodeQueryValue(str) {
    return encodeURIComponent(str.toLowerCase());
  }

  app.controller('SearchController', ['$scope', '$http', function($scope, $http) {
    var search = $scope;
    search.keywords = '';
    search.showSuggestions = false;
    search.makeRequest = function(keywords) {
      search.results = [];
      if (keywords) {
        var query = baseURL + 'action=opensearch&search='+
                    encodeQueryValue(keywords) +
                    '&limit=10&namespace=0&redirects=resolve&utf8=';
        $http.jsonp(query, {cache: true})
          .then(function successCallback(response) {
            var data = response.data;
            var titles = data[1];
            if (titles.length) {
              search.noResults = false;
              var details = data[2];
              var urls = data[3];
              for (var i = 0; i < titles.length; i++) {
                search.results.push({
                  'title': titles[i],
                  'details': details[i],
                  'url': urls[i]
                });
              }
            } else {
              search.noResults = true;
            }
            searchInput.blur();
            search.showSuggestions = false;
          }, function errorCallback(response){
            console.log('The request failed: ' + response);
          });
      }
    };
    search.getSuggestions = function(keywords) {
      searchInput.focus();
      if (keywords) {
        var query = baseURL + 'action=cirrus-suggest&text=' +
                    encodeQueryValue(keywords) + '&limit=10';
        $http.jsonp(query, {cache: true})
          .then(function successCallback(response){
            search.suggestions = response.data.suggest;
            search.showSuggestions = true;
          }, function errorCallback(response){
            console.log('The request failed: ' + response);
          });
      } else {
        search.showSuggestions = false;
      }
    };
    search.getRandomPage = function() {
      var query = baseURL +
      'action=query&list=random&rnnamespace=0&rnlimit=1&formatversion=2';
      $http.jsonp(query).success(function(data){
        var randomID = data.query.random[0].id;
        var url = "http://en.wikipedia.org/?curid=" + randomID;
        window.open(url, '_blank');
        search.showSuggestions = false;
        search.keywords = '';
      });
    };
  }]);
})();

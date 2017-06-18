var myApp = angular.module('myApp', []);
myApp.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('{$');
    $interpolateProvider.endSymbol('$}');
});

myApp.directive('fileImage', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileImage);
      var modelSetter = model.assign;
      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);

myApp.directive('fileVideo', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.fileVideo);
      var modelSetter = model.assign;
      element.bind('change', function(){
        scope.$apply(function(){
          modelSetter(scope, element[0].files[0]);
        });
      });
    }
  };
}]);

myApp.controller('myCtrl', ['$scope', '$http', '$timeout', function($scope, $http, $timeout){
  $scope.markers = [];
  $timeout(function(){
    $http.get("save_data", {})
    .then(function (d){
      $scope.comments = d.data['comments'];
      $scope.markers = d.data;
      var flags = [];
	    for (var key in d.data) {
	      if(key == "comments"){ continue; }
		    var dict = {};
		    dict.x = parseInt(key);
		    dict.title = (d.data[key][0]).substring(0, 35);
		    flags.push(dict);
	    }
	    $scope.show_graph(flags);
    },
    function (error){
      alert("error saving the record!");
    });
  });
  
  $scope.GetFormattedDate = function(dt) {
    var month = (dt.getMonth() + 1);
    var day = (dt.getDate());
    var year = (dt.getFullYear());
    if(month < 10){ month = "0" + month }
    if(day < 10){ day = "0" + day}
    return year + "-" + month + "-" + day;
  }
  
  $scope.fun_clicked = function(tm){
    try{
      var id = $scope.markers[tm][3];
      for (var key in $scope.markers) {
        if(key == "comments"){ continue; }
		    angular.element("#collapseOne" + $scope.markers[key][3]).removeClass("in");
	    }
      angular.element("#collapseOne" + id).addClass("in");
      angular.element("#collapseOnePost").removeClass("in");
    }
    catch(err){
      for (var key in $scope.markers) {
        if(key == "comments"){ continue; }
		    angular.element("#collapseOne" + $scope.markers[key][3]).removeClass("in");
	    }
	    var dt = new Date(tm);
	    dt = $scope.GetFormattedDate(dt);
	    angular.element("#date").val(dt).trigger('change');
      angular.element("#collapseOnePost").addClass("in");
    }
  }
  
  $scope.show_graph = function(flags){
    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {
	    Highcharts.stockChart('container', {
        rangeSelector: { selected: 0 },
        title: { text: 'USD to EUR exchange rate' },
        tooltip: { style: {width: '200px'}, valueDecimals: 4, shared: true },
        yAxis: { title: { text: 'Exchange rate' } },
        plotOptions: {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click: function (e) { $scope.fun_clicked(this.x); }
              }
            },
            marker: { lineWidth: 1 }
          }
        },
        series: [{ name: 'USD to EUR', data: data, id: 'dataseries' },
        { type: 'flags', data: flags, onSeries: 'dataseries', shape: 'squarepin', width: 200 }]
      });
    });
  }
  
  $scope.uploadFile = function(){
    var image = $scope.myImage;
    var video = $scope.myVideo;
    var comment = $scope.comment;
    var date = $scope.comment_date;
    var uploadUrl = "save_data";
    var fd = new FormData();
    fd.append('comment', comment);
    fd.append('date', date);
    fd.append('image', image);
    fd.append('video', video);
        
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
    .then(function (d){
      //alert("Saved successfully!");
      $scope.comments = d.data['comments'];
      $scope.markers = d.data;
      var flags = [];
		  for (var key in d.data) {
		    if(key == "comments"){ continue; }
			  var dict = {};
			  dict.x = parseInt(key);
			  dict.title = (d.data[key][0]).substring(0, 35);
			  flags.push(dict);
		  }
		  angular.element("#collapseOnePost").removeClass("in");
		  $scope.show_graph(flags);
		  
    },
    function (error){
      alert("error saving the record!");
    });
  };
  
  $scope.deleteRecord = function(id){
    $http.get("delete_record", {params:{'id':id}})
    .then(function (d){
      alert("Record deleted successfully!");
      $scope.comments = d.data['comments'];
      $scope.markers = d.data;
      var flags = [];
		  for (var key in d.data) {
		    if(key == "comments"){ continue; }
			  var dict = {};
			  dict.x = parseInt(key);
			  dict.title = (d.data[key][0]).substring(0, 35);
			  flags.push(dict);
		  }
		  $scope.show_graph(flags);
    },
    function (error){
      alert("Error while deleting the record!");
    });
  }
  
}]);

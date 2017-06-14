var markers = [];
$( document ).ready(function() {
  function GetFormattedDate(dt) {
    var month = (dt.getMonth() + 1);
    var day = (dt.getDate());
    var year = (dt.getFullYear());
    return year + "-" + month + "-" + day;
  }
  
  function fn(tm){
    //$('#selectedDate').val(tm);
    try{
      var id = markers[tm][3];
      for (var key in markers) {
		    $("#collapseOne" + markers[key][3]).removeClass('in');
	    }
      $("#collapseOne" + id).addClass('in');
    }
    catch(err){
      //angular.element(document.getElementById('popup_controller')).scope().open('lg');
      //angular.element('#create_new').triggerHandler('click');
    }
  }
  
  $.ajax({
	  url: 'get_comments',
	  type: 'get',
	  success: function(data) {
		  markers = data;
		  var flags = [];
		  for (var key in data) {
			  var dict = {};
			  dict.x = parseInt(key);
			  dict.title = (data[key][0]).substring(0, 35);
			  flags.push(dict);
		  }
		  show_graph(flags);
	  },
	  failure: function() {
		  alert('Issue downloading comments!');
	  }
  });

  function show_graph(flags){
	  $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function (data) {
		    Highcharts.stockChart('container', {
	        rangeSelector: {
	            selected: 0
	        },
	        title: {
	            text: 'USD to EUR exchange rate'
	        },
	        tooltip: {
	            style: {
	                width: '200px'
	            },
	            valueDecimals: 4,
	            shared: true
	        },
	        yAxis: {
	            title: {
	                text: 'Exchange rate'
	            }
	        },
	        plotOptions: {
	            series: {
	                cursor: 'pointer',
	                point: {
	                    events: {
	                        click: function (e) {
	                            fn(this.x);
	                        }
	                    }
	                },
	                marker: {
	                    lineWidth: 1
	                }
	            }
	        },
	        series: [{
	            name: 'USD to EUR',
	            data: data,
	            id: 'dataseries',
	        },
	        {
	            type: 'flags',
	            data: flags,
	            onSeries: 'dataseries',
	            shape: 'squarepin',
	            width: 200
	        }]
	    });
	  });
  }
});


angular.module('ui.bootstrap.demo', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
angular.module('ui.bootstrap.demo').directive('jqdatepicker', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
         link: function (scope, element, attrs, ngModelCtrl) {
            element.datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function (date) {
                    scope.date = date;
                    scope.$apply();
                }
            });
        }
    };
});

angular.module('ui.bootstrap.demo').controller('ModalDemoCtrl', function ($uibModal, $log, $document) {
  var $ctrl = this;
  $ctrl.items = ['item1', 'item2', 'item3'];

  $ctrl.animationsEnabled = true;

  $ctrl.open = function (size, parentSelector) {
    var parentElem = parentSelector ? 
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      controllerAs: '$ctrl',
      size: size,
      appendTo: parentElem,
      resolve: {
        items: function () {
          return $ctrl.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  $ctrl.openComponentModal = function () {
    var modalInstance = $uibModal.open({
      animation: $ctrl.animationsEnabled,
      component: 'modalComponent',
      resolve: {
        items: function () {
          return $ctrl.items;
        }
      }
    });

    modalInstance.result.then(function (selectedItem) {
      $ctrl.selected = selectedItem;
    }, function () {
      $log.info('modal-component dismissed at: ' + new Date());
    });
  };

  $ctrl.openMultipleModals = function () {
    $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title-bottom',
      ariaDescribedBy: 'modal-body-bottom',
      templateUrl: 'stackedModal.html',
      size: 'sm',
      controller: function($scope) {
        $scope.name = 'bottom';  
      }
    });

    $uibModal.open({
      animation: $ctrl.animationsEnabled,
      ariaLabelledBy: 'modal-title-top',
      ariaDescribedBy: 'modal-body-top',
      templateUrl: 'stackedModal.html',
      size: 'sm',
      controller: function($scope) {
        $scope.name = 'top';  
      }
    });
  };

  $ctrl.toggleAnimation = function () {
    $ctrl.animationsEnabled = !$ctrl.animationsEnabled;
  };
});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

angular.module('ui.bootstrap.demo').controller('ModalInstanceCtrl', function ($uibModalInstance, items) {
  var $ctrl = this;
  $ctrl.items = items;
  $ctrl.selected = {
    item: $ctrl.items[0]
  };

  $ctrl.ok = function () {
    $uibModalInstance.close($ctrl.selected.item);
  };

  $ctrl.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});

// Please note that the close and dismiss bindings are from $uibModalInstance.

angular.module('ui.bootstrap.demo').component('modalComponent', {
  templateUrl: 'myModalContent.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  controller: function () {
    var $ctrl = this;

    $ctrl.$onInit = function () {
      $ctrl.items = $ctrl.resolve.items;
      $ctrl.selected = {
        item: $ctrl.items[0]
      };
    };

    $ctrl.ok = function () {
      $ctrl.close({$value: $ctrl.selected.item});
    };

    $ctrl.cancel = function () {
      $ctrl.dismiss({$value: 'cancel'});
    };
  }
});

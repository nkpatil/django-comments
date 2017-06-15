var markers = [];
$( document ).ready(function() {
  function GetFormattedDate(dt) {
    var month = (dt.getMonth() + 1);
    var day = (dt.getDate());
    var year = (dt.getFullYear());
    if(month < 10){
      month = "0" + month
    }
    if(day < 10){
      day = "0" + day
    }
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
      $("#collapseOnePost").removeClass('in');
    }
    catch(err){
      for (var key in markers) {
		    $("#collapseOne" + markers[key][3]).removeClass('in');
	    }
	    var dt = new Date(tm);
	    dt = GetFormattedDate(dt);
	    $("#date").val(dt).trigger('change');
      $("#collapseOnePost").addClass('in');
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

var app = angular.module("youdrawit", []);

app.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});

app.controller('DrawingController', ['$scope', function($scope){
	$scope.showDebug = false;
	$scope.showControls = false;
	$scope.drawing = false;
	$scope.size = 11;
	$scope.color = "#4bf";
	$scope.increment = 5;
	$scope.maxSize = 500;
	$scope.minSize = 1;
	$scope.cursorX = 0;
	$scope.cursorY = 0;
	$scope.svg = d3.select(document.getElementById('svg'));
	
	$scope.getCursorX = function(){
		return $scope.cursorX - ($scope.size/2);
	};
	
	$scope.getCursorY = function(){
		return $scope.cursorY - ($scope.size/2);
	};
}]);

app.directive('keyboard',function(){
	return function (scope, element, attr) {
	
		element.on('keydown', function(e){

			switch(e.keyCode) {
				case 27: // escape - clear svg
					if(e.shiftKey) {
						event.preventDefault();
						if(confirm("Are you sure you want to clear the canvas?")) scope.svg.selectAll("*").remove();
					}
					break;
				case 38: // up - larger size
					scope.size = Math.min(scope.maxSize, scope.size + scope.increment);
					scope.$apply();
					break;
				case 40: // down - smaller size
					scope.size = Math.max(scope.minSize, scope.size - scope.increment);
					scope.$apply();
					break;
				case 39: // right - next tool
					
					break;
				case 37: // left - previous tool
					
					break;
				case 67:
					if(e.shiftKey)
					{
						 event.preventDefault();
						// toggle showControls
						scope.showControls = (scope.showControls) ? false : true;
						scope.$apply();
					}
					break;
				case 68:
					if(e.shiftKey)
					{
						 event.preventDefault();
						// toggle showDebug
						scope.showDebug = (scope.showDebug) ? false : true;
						scope.$apply();
					}
					break;
				case 90:
					if(e.shiftKey)
					{
						// undo
					}
					break;
			}
		});
	};
});
app.directive('drawing', ['socket', function(socket){
	
	return function (scope, element, attr) {
		var lastX;
		var lastY;
			
		element.on('mousedown', function() {
			lastX = event.layerX;
			lastY = event.layerY;
			scope.drawing = true;
			scope.$apply();
		});
		
		element.on('mouseup', function() {
			scope.drawing = false;
			scope.$apply();
		});
		
		element.on('mousemove', function() {
			// do some drawing
			if (scope.drawing) {
				var data = {x1:lastX, y1:lastY, x2:event.layerX, y2:event.layerY, color:scope.color, size:scope.size};
				draw(data);
				socket.emit('data', data);
				lastX = event.layerX;
				lastY = event.layerY;
			}
			
			scope.cursorX = event.layerX;
			scope.cursorY = event.layerY;
			scope.$apply();
		});
		
		element.on('mouseleave', function() {
			scope.drawing = false;
			scope.$apply();
		});
		
		socket.on('data', function(data){			
			draw(data);
		});
		
		socket.on('startup', function(data){
			console.log(data);
			if(data != null)
			{
				for(var i = 0; i < data.length; i++)
				{
					draw(data[i]);
				}
			}
		});
		
		function draw(data) {
			
			scope.svg.append('line')
				.attr("data-id", 8)
				.attr("x1", data.x1)
				.attr("y1", data.y1)
				.attr("x2", data.x2)
				.attr("y2", data.y2)
				.attr("stroke-linecap", "round")
				.attr("stroke-width", data.size)
				.attr("stroke", data.color);
		}
	};
}]);

app.directive('controls', function() {
  return {
    templateUrl: 'controls.html'
  };
});

app.directive('debugger', function() {
  return {
    templateUrl: 'debugger.html'
  };
});

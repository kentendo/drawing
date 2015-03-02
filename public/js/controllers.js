
app.controller('DrawingController', ['$scope', function($scope) {
	$scope.showDebug = false;
	$scope.showControls = true;
	$scope.size = 11;
	$scope.zoom = 100;
	$scope.maxSize = 300;
	$scope.minSize = 1;
	$scope.colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF'];
	$scope.color = $scope.colors[Math.round(Math.random() * ($scope.colors.length-1))];
	$scope.brushes = ['round', 'butt', 'square'];
	$scope.brush = "round";
	$scope.cursorX = 0;
	$scope.cursorY = 0;
	$scope.width = window.innerWidth;
	$scope.height = window.innerHeight;
	$scope.offsetX = 0;
	$scope.offsetY = 0;
	$scope.offsetIncrement = 50;
	$scope.zoomIncrement = 10;
	$scope.svg = d3.select(document.getElementById('drawing'));
	$scope.line = [];
	
	$scope.getZoom = function(){
		return $scope.zoom / 100;
	};
	
	$scope.doZoom = function(){
		return 100 / $scope.zoom;
	};
	
	$scope.getCursorX = function() {
		return $scope.cursorX - ($scope.size / 2);
	};

	$scope.getCursorY = function() {
		return $scope.cursorY - ($scope.size / 2);
	};
	
	$scope.getSize = function(){
		return $scope.doZoom() * $scope.size;
	};
	
}]);
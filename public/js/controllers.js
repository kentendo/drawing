app.controller('SettingsController', ['$scope', function($scope){
	
}]);

app.controller('DrawController', ['$scope', function($scope){
	
}]);

app.controller('DrawingController', ['$scope', function($scope) {
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

	$scope.getCursorX = function() {
		return $scope.cursorX - ($scope.size / 2);
	};

	$scope.getCursorY = function() {
		return $scope.cursorY - ($scope.size / 2);
	};
	
	$scope.drawPicker = function(){
		var canvas = angular.element('#color-picker');
		console.log(canvas);
	};
	
}]);
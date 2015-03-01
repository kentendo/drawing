
app.directive('keyboard', function() {
	return function(scope, element, attr) {
		element.on('keydown', function(e) {
			switch(e.keyCode) {
			case 27:
				// escape - clear svg
				if (e.shiftKey) {
					if (confirm("Are you sure you want to clear the canvas?"))
						scope.svg.selectAll("*").remove();
				}
				break;
			case 38: // up
				if(e.ctrlKey)
					scope.zoom += scope.zoomIncrement;
				else 
					scope.offsetY -= scope.offsetIncrement;
				break;
			case 40: // down
				if(e.ctrlKey)
					scope.zoom -= scope.zoomIncrement;
				else 
					scope.offsetY += scope.offsetIncrement;
				break;
			case 39: // right
				scope.offsetX += scope.offsetIncrement;
				break;
			case 37: // left
				scope.offsetX -= scope.offsetIncrement;
				break;
			case 67: // c 
				// toggle showControls
				scope.showControls = (scope.showControls) ? false : true;
				break;
			case 68: // d
				// toggle showDebug
				scope.showDebug = (scope.showDebug) ? false : true;
				scope.$apply();
				break;
			case 90: // z
				if (e.shiftKey) {
					// undo
				}
				break;
			}
			
			event.preventDefault();
			scope.$apply();
		});
	};
});

app.directive('drawing', ['socket',
function(socket) {

	return function(scope, element, attr) {
		var lastX;
		var lastY;
		var mouseDown;
		var points = [];
		
		element.on('mousedown', function(event) {
			lastX = event.layerX;
			lastY = event.layerY;
			mouseDown = true;
		});

		element.on('mouseup', function(event) {
			mouseDown = false;
		});

		element.on('mousemove', function(event) {
			// do some drawing
			if (mouseDown) {
				var data = {
					x1 : lastX + scope.offsetX,
					y1 : lastY + scope.offsetY,
					x2 : event.layerX + scope.offsetX,
					y2 : event.layerY + scope.offsetY,
					brush : scope.brush,
					color : scope.color,
					size : scope.size
				};
				draw(data);
				socket.emit('data', data);
				lastX = event.layerX;
				lastY = event.layerY;
			}

			scope.cursorX = event.layerX;
			scope.cursorY = event.layerY;
			scope.$apply();
		});

		element.on('mouseleave', function(event) {
			mouseDown = false;
		});

		socket.on('data', function(data) {
			draw(data);
		});

		socket.on('startup', function(data) {
			if (data != null) {
				for (var i = 0; i < data.length; i++) {
					draw(data[i]);
				}
			}
		});

		function draw(data) {
			scope.svg.append('line').attr("data-id", 8).attr("x1", data.x1).attr("y1", data.y1).attr("x2", data.x2).attr("y2", data.y2).attr("stroke-linecap", data.brush).attr("stroke-width", data.size).attr("stroke", data.color);
			//scope.svg.innerHTML += '<line x1="'+data.x1+'" y1="'+data.y1+'" x2="'+data.x2+'" y2="'+data.y2+'" stroke-linecap="'+data.brush+'" stroke-width="'+data.size+'" stroke="'+data.color+'"></line>';
		}

	};
}]);

app.directive('colorpicker', function() {
	return function(scope, element, attr) {		
		document.getElementById("colorpicker").value = scope.color;
		element.on('change', function() {
			scope.color = element.val();
		});
	};
});

app.directive('brushsize', function() {
	return function(scope, element, attr) {
		element.on('input', function() {
			scope.size = element.val();
			scope.$apply();
		});
	};
});

app.directive('debugger', function() {
	return {
		templateUrl : 'partials/debugger.html'
	};
});

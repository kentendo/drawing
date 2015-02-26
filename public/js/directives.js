app.directive('keyboard', function() {
	return function(scope, element, attr) {

		element.on('keydown', function(e) {

			switch(e.keyCode) {
			case 27:
				// escape - clear svg
				if (e.shiftKey) {
					event.preventDefault();
					if (confirm("Are you sure you want to clear the canvas?"))
						scope.svg.selectAll("*").remove();
				}
				break;
			case 38:
				// up - larger size
				scope.size = Math.min(scope.maxSize, scope.size + scope.increment);
				scope.$apply();
				break;
			case 40:
				// down - smaller size
				scope.size = Math.max(scope.minSize, scope.size - scope.increment);
				scope.$apply();
				break;
			case 39:
				// right - next tool

				break;
			case 37:
				// left - previous tool

				break;
			case 67:
				if (e.shiftKey) {
					event.preventDefault();
					// toggle showControls
					scope.showControls = (scope.showControls) ? false : true;
					scope.$apply();
				}
				break;
			case 68:
				if (e.shiftKey) {
					event.preventDefault();
					// toggle showDebug
					scope.showDebug = (scope.showDebug) ? false : true;
					scope.$apply();
				}
				break;
			case 90:
				if (e.shiftKey) {
					// undo
				}
				break;
			}
		});
	};
});

app.directive('drawing', ['socket',
function(socket) {

	return function(scope, element, attr) {
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
				var data = {
					x1 : lastX,
					y1 : lastY,
					x2 : event.layerX,
					y2 : event.layerY,
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

		element.on('mouseleave', function() {
			scope.drawing = false;
			scope.$apply();
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

			scope.svg.append('line').attr("data-id", 8).attr("x1", data.x1).attr("y1", data.y1).attr("x2", data.x2).attr("y2", data.y2).attr("stroke-linecap", "round").attr("stroke-width", data.size).attr("stroke", data.color);
		}

	};
}]);

app.directive('colorpicker', function() {
	return function(scope, element, attr) {

		var width = element.width();
		var height = element.height();
		var context;
		var imageData;
		var pixels;
				
		try {
			
			width = 5;
			height = 15;
			
			context = element[0].getContext('2d');
			imageData = context.createImageData(width, height);
			pixels = imageData.data;
			
			console.log(width);
			console.log(height);
			console.log(context);
			console.log(imageData);
			console.log(pixels);
			
			var i = 0;
			for (y = 0; y < height; y++) {
				
				console.log('start row');
				
				for (x = 0; x < width; x++, i++) {
					
					console.log('pixel: ' + i);
					console.log('y: ' + y + ' x: ' + x);
					
					
					
					
					//pixels[i] = 
					
					// console.log('i: ' + i);
					// console.log('y: ' + y);
					// console.log('x: ' + x);
					
					// rx = x - cx;
					// ry = y - cy;
					// d = rx * rx + ry * ry;
					// if (d < radius * radius) {
						// hue = 6 * (Math.atan2(ry, rx) + Math.PI) / (2 * Math.PI);
						// sat = Math.sqrt(d) / radius;
						// g = Math.floor(hue);
						// f = hue - g;
						// u = 255 * (1 - sat);
						// v = 255 * (1 - sat * f);
						// w = 255 * (1 - sat * (1 - f));
						// pixels[i] = [255, v, u, u, w, 255, 255][g];
						// pixels[i + 1] = [w, 255, 255, v, u, u, w][g];
						// pixels[i + 2] = [u, u, w, 255, 255, v, u][g];
						// pixels[i + 3] = 255;
					// }
				}
			}
			
			console.log(imageData);
			
			context.putImageData(imageData, 0, 0);

		} catch (e) {
			console.log(e);
		}

		console.log(width);
		console.log(height);

	};
});

app.directive('debugger', function() {
	return {
		templateUrl : 'debugger.html'
	};
}); 
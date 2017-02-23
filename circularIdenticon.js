function drawCircularIdenticon(id){
	var canvas = document.getElementById('circularIdenticonCanvas');
	var ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	var size = Math.min(canvas.width, canvas.height);

	var idHash = string2ByteArray(md5(id));

	ctx.fillStyle = '#' + padFront(idHash[13].toString(16), 2) +
	                padFront(idHash[14].toString(16), 2) +
	                padFront(idHash[15].toString(16), 2);

	var shells = 4;
	var innerRadius = Math.floor(size / ((shells * 2) + 1));
	var centerx = Math.floor(size / 2);
	var centery = centerx;

	ctx.arc(centerx, centery, innerRadius + 1, 0, 2 * Math.PI, false);
	ctx.fill();
	for(var i = 1; i < shells; ++i){
		var theta1 = 360 * (idHash[(i * 2) + 0] / 0xFF);
		var theta2 = 360 * (idHash[(i * 2) + 1] / 0xFF);

		if(theta2 < theta1){
			var temp = theta1;
			theta1 = theta2;
			theta2 = temp;
		}

		var r1 = innerRadius * i;
		var r2 = innerRadius * (i + 1) + 1;
		
		var largeArcFlag = (theta2 - theta1) < 180 ? 0 : 1;

		var d = 'M ' + (centerx + polar2CartesianX(r2, theta1)) + ' ' + (centery + polar2CartesianY(r2, theta1)) +
				' A ' + r2 + ' ' + r2 + ' 0 ' + largeArcFlag + ' 1 ' + (centerx + polar2CartesianX(r2, theta2)) + ' ' + (centery + polar2CartesianY(r2, theta2)) +
				' L ' + (centerx + polar2CartesianX(r1, theta2)) + ' ' + (centery + polar2CartesianY(r1, theta2)) +
				' A ' + r1 + ' ' + r1 + ' 0 ' + largeArcFlag + ' 0 ' + (centerx + polar2CartesianX(r1, theta1)) + ' ' + (centery + polar2CartesianY(r1, theta1)) +
				' Z';
		var p = new Path2D(d);

		ctx.fill(p);
	}
}

function circularIdenticonSVG(width, height, id){
	var idHash = string2ByteArray(md5(id));
	var size = Math.min(width, height);
	var svg = '<svg width="' + width + '" height="' + height + '">';

	var fillColor = "#" + padFront(idHash[13].toString(16), 2) +
	                padFront(idHash[14].toString(16), 2) +
	                padFront(idHash[15].toString(16), 2);

	var shells = 4;
	var innerRadius = Math.floor(size / ((shells * 2) + 1));
	var centerx = Math.floor(size / 2);
	var centery = centerx;

	svg += '<circle cx="' + centerx + '" cy="' + centery + '" r="' + (innerRadius + 1) + '" fill="' + fillColor + '" />';
	for(var i = 1; i < shells; ++i){
		var theta1 = 360 * (idHash[(i * 2) + 0] / 0xFF);
		var theta2 = 360 * (idHash[(i * 2) + 1] / 0xFF);

		if(theta2 < theta1){
			var temp = theta1;
			theta1 = theta2;
			theta2 = temp;
		}

		var r1 = innerRadius * i;
		var r2 = innerRadius * (i + 1) + 1;
		
		var largeArcFlag = (theta2 - theta1) < 180 ? 0 : 1;

		var d = 'M ' + (centerx + polar2CartesianX(r2, theta1)) + ' ' + (centery + polar2CartesianY(r2, theta1)) +
				' A ' + r2 + ' ' + r2 + ' 0 ' + largeArcFlag + ' 1 ' + (centerx + polar2CartesianX(r2, theta2)) + ' ' + (centery + polar2CartesianY(r2, theta2)) +
				' L ' + (centerx + polar2CartesianX(r1, theta2)) + ' ' + (centery + polar2CartesianY(r1, theta2)) +
				' A ' + r1 + ' ' + r1 + ' 0 ' + largeArcFlag + ' 0 ' + (centerx + polar2CartesianX(r1, theta1)) + ' ' + (centery + polar2CartesianY(r1, theta1)) +
				' Z';

		svg += '<path d="' + d + '" fill="' + fillColor + '" />';
	}

	svg += '</svg>';
	return svg;
}

function string2ByteArray(string){
	var bytes = [];
	for(var i = 0; i < string.length; ++i){
		bytes[i] = parseInt(string.substr(i * 2, 2), 16);
	}
	return bytes;
}

function polar2CartesianX(r, theta){
	var radians = Math.PI * (theta - 90) / 180;
	return r * Math.cos(radians);
}

function polar2CartesianY(r, theta){
	var radians = Math.PI * (theta - 90) / 180;
	return r * Math.sin(radians);
}

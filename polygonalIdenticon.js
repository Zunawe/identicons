function polygonalIdenticonSVG(width, height, id, edges, shells){
	var idHash = string2ByteArray(md5(id));
	var size = Math.min(width, height);

	var fillColor = "#" + padFront(idHash[13].toString(16), 2) +
	                padFront(idHash[14].toString(16), 2) +
	                padFront(idHash[15].toString(16), 2);

	edges = edges || 3;
	shells = shells || 4;
	var innerRadius = Math.floor(size / ((shells * 2) + 1));
	var centerx = Math.floor(width / 2);
	var centery = Math.floor(height / 2);

	svgNS = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(svgNS, 'svg');

	svg.setAttribute('width', width);
	svg.setAttribute('height', height);
	svg.setAttribute('xmlns', svgNS);
	//svg.setAttribute('shape-rendering', 'crispEdges');

	// TODO: Draw "arc" instead of each edge to avoid seams
	for(var i = 0; i < shells; ++i){
		for(var j = 0; j < edges; ++j){
			if(!i || getBit(((i * shells) + j) % idHash.length, idHash)){
				var theta1 = (360 / edges) * j;
				var theta2 = (360 / edges) * (j + 1);

				if(theta2 < theta1){
					var temp = theta1;
					theta1 = theta2;
					theta2 = temp;
				}

				var r1 = innerRadius * i;
				var r2 = innerRadius * (i + 1);
				r2 -= (r2 - r1) / 10;

				var d = 'M ' + (centerx + polar2CartesianX(r2, theta1)) + ' ' + (centery + polar2CartesianY(r2, theta1)) +
				        ' L ' + (centerx + polar2CartesianX(r2, theta2)) + ' ' + (centery + polar2CartesianY(r2, theta2)) +
				        ' L ' + (centerx + polar2CartesianX(r1, theta2)) + ' ' + (centery + polar2CartesianY(r1, theta2)) +
				        ' L ' + (centerx + polar2CartesianX(r1, theta1)) + ' ' + (centery + polar2CartesianY(r1, theta1)) +
				        ' Z';

				var edge = document.createElementNS(svgNS, 'path');

				edge.setAttribute('d', d);
				edge.setAttribute('fill', fillColor);

				svg.appendChild(edge);
			}
		}
	}

	return svg;
}

function polar2CartesianX(r, theta){
	var radians = Math.PI * (theta - 90) / 180;
	return r * Math.cos(radians);
}

function polar2CartesianY(r, theta){
	var radians = Math.PI * (theta - 90) / 180;
	return r * Math.sin(radians);
}

function getBit(n, bytes){
	var byteIndex = Math.floor(n / 8) % bytes.length;
	var bitIndex = 7 - ((n % (8 * bytes.length)) - (byteIndex * 8));

	return (bytes[byteIndex] & (0x01 << bitIndex)) >> bitIndex;
}

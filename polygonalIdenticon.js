function polygonalIdenticonSVG(size, id, hashFunction, options){
	var idHash = string2ByteArray(hashFunction(id));

	var fillColor = "#" + idHash[idHash.length - 3].padFront(16, 2) +
	                      idHash[idHash.length - 3].padFront(16, 2) +
	                      idHash[idHash.length - 3].padFront(16, 2);

	var edges = (options && options['edges']) || 5;
	var shells = (options && options['shells']) || 4;
	var innerRadius = Math.floor(size / ((shells * 2) + 1));
	var centerx = Math.floor(size / 2);
	var centery = Math.floor(size / 2);

	svgNS = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(svgNS, 'svg');

	svg.setAttribute('width', size);
	svg.setAttribute('height', size);
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

				var d = `M ${centerx + polar2CartesianX(r2, theta1)} ${centery + polar2CartesianY(r2, theta1)} ` +
				        `L ${centerx + polar2CartesianX(r2, theta2)} ${centery + polar2CartesianY(r2, theta2)} ` +
				        `L ${centerx + polar2CartesianX(r1, theta2)} ${centery + polar2CartesianY(r1, theta2)} ` +
				        `L ${centerx + polar2CartesianX(r1, theta1)} ${centery + polar2CartesianY(r1, theta1)} ` +
				        'Z';

				var edge = document.createElementNS(svgNS, 'path');

				edge.setAttribute('d', d);
				edge.setAttribute('fill', fillColor);

				svg.appendChild(edge);
			}
		}
	}

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

function getBit(n, bytes){
	var byteIndex = Math.floor(n / 8) % bytes.length;
	var bitIndex = 7 - ((n % (8 * bytes.length)) - (byteIndex * 8));

	return (bytes[byteIndex] & (0x01 << bitIndex)) >> bitIndex;
}

Number.prototype.padFront = function (base, size){
	var s = this.toString(base);
	while(s.length < size){
		s = '0' + s;
	}
	return s;
}

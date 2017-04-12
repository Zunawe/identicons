function circularIdenticonSVG(size, id, options){
	var idHash = string2ByteArray(md5(id));

	var fillColor = "#" + padFront(idHash[13].toString(16), 2) +
	                padFront(idHash[14].toString(16), 2) +
	                padFront(idHash[15].toString(16), 2);

	var shells = (options && options['shells']) || 4;
	var segments = (options && options['segments']) || Infinity;
	var symmetry = (options && options['symmetry']) || 'none';
	var innerRadius = Math.floor(size / ((shells * 2) + 1));
	var centerx = Math.floor(size / 2);
	var centery = Math.floor(size / 2);
	
	var svgNS = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(svgNS, 'svg');

	svg.setAttribute('width', size);
	svg.setAttribute('height', size);
	svg.setAttribute('xmlns', svgNS);

	var innerCircle = document.createElementNS(svgNS, 'circle');

	innerCircle.setAttribute('cx', centerx);
	innerCircle.setAttribute('cy', centery);
	innerCircle.setAttribute('r', innerRadius + 1);
	innerCircle.setAttribute('fill', fillColor);

	svg.appendChild(innerCircle);

	for(var i = 1; i < shells; ++i){
		var theta1;
		var theta2;
		switch(symmetry){
			case 'vertical':
				theta1 = floorToMultiple(180 * (idHash[i] / 0xFF), 360 / segments);
				theta2 = 360 - theta1;
				break;
			case 'horizontal':
				theta1 = floorToMultiple(180 * (idHash[i] / 0xFF), 360 / segments) - 90;
				theta2 = 180 - theta1;
				break;
			default:
				theta1 = floorToMultiple(360 * (idHash[(i * 2) + 0] / 0xFF), 360 / segments);
				theta2 = floorToMultiple(360 * (idHash[(i * 2) + 1] / 0xFF), 360 / segments);
		}

		if(theta2 < theta1){
			var temp = theta1;
			theta1 = theta2;
			theta2 = temp;
		}

		var r1 = innerRadius * i;
		var r2 = innerRadius * (i + 1) + 1;
		
		var largeArcFlag = (theta2 - theta1) < 180 ? 0 : 1;

		var d = `M ${centerx + polar2CartesianX(r2, theta1)} ${centery + polar2CartesianY(r2, theta1)} ` +
		        `A ${r2} ${r2} 0 ${largeArcFlag} 1 ${centerx + polar2CartesianX(r2, theta2)} ${centery + polar2CartesianY(r2, theta2)} ` +
		        `L ${centerx + polar2CartesianX(r1, theta2)} ${centery + polar2CartesianY(r1, theta2)} ` +
		        `A ${r1} ${r1} 0 ${largeArcFlag} 0 ${centerx + polar2CartesianX(r1, theta1)} ${centery + polar2CartesianY(r1, theta1)} ` +
		        'Z';

		var arc = document.createElementNS(svgNS, 'path');

		arc.setAttribute('d', d);
		arc.setAttribute('fill', fillColor);

		svg.appendChild(arc);
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

function floorToMultiple(n, m){
	if(!m){
		return n;
	}
	n /= m;
	n = Math.floor(n);
	return n * m;
}

function squareIdenticonSVG(size, id){
	var idHash = string2ByteArray(md5(id));

	var svgNS = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(svgNS, 'svg');

	svg.setAttribute('width', size);
	svg.setAttribute('height', size);
	svg.setAttribute('xmlns', svgNS);
	svg.setAttribute('shape-rendering', 'crispEdges');

	var pixelMap = [[], [], [], [], []];
	for(var i = 0; i < 5; ++i){
		for(var j = 0; j < 3; ++j){
			pixelMap[i][j] = !getBit((i * 3) + j, idHash);
		}
		pixelMap[i][3] = pixelMap[i][1];
		pixelMap[i][4] = pixelMap[i][0];
	}

	var fillColor = '#' + padFront(idHash[13].toString(16), 2) +
	                padFront(idHash[14].toString(16), 2) +
	                padFront(idHash[15].toString(16), 2);
	var boxSize = Math.floor(size / 6);
	var marginSize = Math.floor((boxSize / 2) + ((size % 6) / 2));

	for(var i = 0; i < 5; ++i){
		for(var j = 0; j < 5; ++j){
			if(pixelMap[i][j]){
				var rect = document.createElementNS(svgNS, 'rect');

				rect.setAttribute('x', marginSize + (j * boxSize));
				rect.setAttribute('y', marginSize + (i * boxSize));
				rect.setAttribute('width', boxSize);
				rect.setAttribute('height', boxSize);
				rect.setAttribute('fill', fillColor);

				svg.appendChild(rect);
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

function getBit(n, bytes){
	var byteIndex = Math.floor(n / 8) % bytes.length;
	var bitIndex = 7 - ((n % (8 * bytes.length)) - (byteIndex * 8));

	return (bytes[byteIndex] & (0x01 << bitIndex)) >> bitIndex;
}

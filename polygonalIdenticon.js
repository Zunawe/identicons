/**
 * @callback hasher
 * @param {String} input - The string to be hashed
 * @return {String} - A string in hexadecimal of some hash
 */

/**
 * Turns an id and a hashing function into a unique square identicon SVG element
 * @param {Number} - Side length in pixels of the image
 * @param {String} id - The id to be hashed
 * @param {hasher} hashFunction - A function that hashes strings (e.g. md5, sha-1, etc...)
 * @param {Object} [options] - An object containing options for customizing the identicon
 * @param {Number} [options.shells=4] - The number of shells to generate (min 1, max 8)
 * @param {Number} [options.edges=5] - The number of edges (i.e. 6 makes a regular hexagon shape)
 * @return {Object} - An SVG element object
 */
 function polygonalIdenticonSVG(size, id, hashFunction, options){
	var idHash = string2ByteArray(hashFunction(id));

	// Color is just the rgb hex of the last 3 bytes
	var fillColor = "#" + idHash[idHash.length - 3].padFront(16, 2) +
	                      idHash[idHash.length - 3].padFront(16, 2) +
	                      idHash[idHash.length - 3].padFront(16, 2);

	// Gets options and known values and/or sets defaults
	var edges = (options && options['edges']) || 5;
	var shells = (options && options['shells']) || 4;
	var innerRadius = Math.floor(size / ((shells * 2) + 1));
	var centerx = Math.floor(size / 2);
	var centery = Math.floor(size / 2);

	// Sets up SVG object
	svgNS = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(svgNS, 'svg');

	svg.setAttribute('width', size);
	svg.setAttribute('height', size);
	svg.setAttribute('xmlns', svgNS);
	//svg.setAttribute('shape-rendering', 'crispEdges');

	// TODO: Draw "arc" instead of each edge to avoid seams
	// Loop fills pieces for each shell
	for(var i = 0; i < shells; ++i){
		// Check each edge for being filled or not
		for(var j = 0; j < edges; ++j){
			if(!i || getBit(((i * shells) + j) % idHash.length, idHash)){
				// Angles are used to determine the locations of the vertices
				var theta1 = (360 / edges) * j;
				var theta2 = (360 / edges) * (j + 1);

				// Make theta1 < theta2
				if(theta2 < theta1){
					var temp = theta1;
					theta1 = theta2;
					theta2 = temp;
				}

				// Create gaps between shells
				var r1 = innerRadius * i;
				var r2 = innerRadius * (i + 1);
				r2 -= (r2 - r1) / 10;

				// The d attribute of the path element
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

/**
 * Turns a string of hexadecimal into an array of byte-sized numbers
 * @param {String} string - The input to convert
 * @return {Number[]} - An array with size half the length of the input string
 */
function string2ByteArray(string){
	var bytes = [];
	for(var i = 0; i < string.length / 2; ++i){
		bytes[i] = parseInt(string.substr(i * 2, 2), 16);
	}
	return bytes;
}

/**
 * Gets the x-coordinate in Cartesian coordinates from polar coordinates
 * @param {Number} r - The distance from the origin
 * @param {Number} theta - The angle from the reference axis in degrees
 * @return {Number}
 */
function polar2CartesianX(r, theta){
	var radians = Math.PI * (theta - 90) / 180;
	return r * Math.cos(radians);
}

/**
 * Gets the y-coordinate in Cartesian coordinates from polar coordinates
 * @param {Number} r - The distance from the origin
 * @param {Number} theta - The angle from the reference axis in degrees
 * @return {Number}
 */
function polar2CartesianY(r, theta){
	var radians = Math.PI * (theta - 90) / 180;
	return r * Math.sin(radians);
}

/**
 * Gets the nth bit from an array of bytes
 * @param {Number} n - The index of the bit (0 is the lowest-order bit, 8 is the first bit of the second byte, etc...)
 * @param {Number[]} bytes - The array of bytes to look through
 * @return {Number} - 0 or 1
 */
function getBit(n, bytes){
	var byteIndex = Math.floor(n / 8) % bytes.length;
	var bitIndex = 7 - ((n % (8 * bytes.length)) - (byteIndex * 8));

	return (bytes[byteIndex] & (0x01 << bitIndex)) >> bitIndex;
}

/**
 * Turns a number into a string padded on the left with zeroes until it's at least some length
 * @param {Number} base - Convert the number to this base
 * @param {Number} size - The width of the output
 * @return {String}
 */
Number.prototype.padFront = function (base, size){
	var s = this.toString(base);
	while(s.length < size){
		s = '0' + s;
	}
	return s;
}

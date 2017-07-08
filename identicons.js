/* MIT License
 * 
 * Copyright (c) 2017 Bryce Wilson
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Turns an id and a hashing function into a unique square identicon SVG element
 * @param {Number} size - Side length in pixels of the image
 * @param {String} hash - A string representing a hexadecimal number. Ideally, this is the output of a hash function such as MD5 or SHA-1.
 * @return {Object} An SVG element object
 */
function squareIdenticonSVG(size, hash){
	var bytes = _string2ByteArray(hash);

	var svgNS = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(svgNS, 'svg');

	// crispEdges prevents seams between blocks (we know everything is 90 degree angles anyway)
	svg.setAttribute('width', size);
	svg.setAttribute('height', size);
	svg.setAttribute('xmlns', svgNS);
	svg.setAttribute('shape-rendering', 'crispEdges');

	// Inner loop stops at 3 for symmetry
	var pixelMap = [[], [], [], [], []];
	for(var i = 0; i < 5; ++i){
		for(var j = 0; j < 3; ++j){
			pixelMap[i][j] = !!_getBit((i * 3) + j, bytes);
		}
		pixelMap[i][3] = pixelMap[i][1];
		pixelMap[i][4] = pixelMap[i][0];
	}

	var fillColor = '#' + bytes[bytes.length - 3].padFront(16, 2) +
	                      bytes[bytes.length - 2].padFront(16, 2) +
	                      bytes[bytes.length - 1].padFront(16, 2);
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

/**
 * Turns an id and a hashing function into a unique square identicon SVG element
 * @param {Number} size - Side length in pixels of the image
 * @param {String} hash - A string representing a hexadecimal number. Ideally, this is the output of a hash function such as MD5 or SHA-1.
 * @param {Object} [options] - An object containing options for customizing the identicon
 * @param {Number} [options.shells=4] - The number of shells to generate (min 1, max 8)
 * @param {Number} [options.segments=Infinity] - The number of segments of equal angle to snap the arcs to
 * @param {Number} [options.symmetryAxisTilt] - If defined, makes the SVG symmetric about the line defined here in polar coordinates (degrees)
 * @return {Object} An SVG element object
 */
function circularIdenticonSVG(size, hash, options){
	var bytes = _string2ByteArray(hash);

	var fillColor = "#" + bytes[bytes.length - 3].padFront(16, 2) +
	                      bytes[bytes.length - 2].padFront(16, 2) +
	                      bytes[bytes.length - 1].padFront(16, 2);

	var shells = (options && options['shells']) || 4;
	shells = Math.min(shells, 8);
	var segments = (options && options['segments']) || Infinity;
	var symmetryAxisTilt = options && Number(options['symmetryAxisTilt']) % 180;
	var innerRadius = Math.floor(size / ((shells * 2) + 1));
	var centerx = Math.floor(size / 2);
	var centery = Math.floor(size / 2);
	
	var svgNS = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(svgNS, 'svg');

	svg.setAttribute('width', size);
	svg.setAttribute('height', size);
	svg.setAttribute('xmlns', svgNS);

	// The inner circle always exists, so we create it outside the loop with just a circle element
	var innerCircle = document.createElementNS(svgNS, 'circle');

	innerCircle.setAttribute('cx', centerx);
	innerCircle.setAttribute('cy', centery);
	innerCircle.setAttribute('r', innerRadius + 1);
	innerCircle.setAttribute('fill', fillColor);

	svg.appendChild(innerCircle);

	for(var i = 1; i < shells; ++i){
		/**
		 * Generates the path attribute for an arc given a shell and two angles.
		 * @param {Number} shell - The shell to draw the arc for (affects radii)
		 * @param {Number} theta1 - The starting angle for drawing the arc (0, 360) (degrees)
		 * @param {Number} theta1 - The end angle for drawing the arc, theta2 > theta1 (0, 360) (degrees)
		 * @return {String} A string containing the value of the d attribute for the path element
		 */
		var getArcPath = function (shell, theta1, theta2){
			var r1 = innerRadius * shell;
			var r2 = innerRadius * (i + 1) + 1;

			var largeArcFlag = (theta2 - theta1) < 180 ? 0 : 1;

			return `M ${centerx + _polar2CartesianX(r2, theta1)} ${centery + _polar2CartesianY(r2, theta1)} ` +
			       `A ${r2} ${r2} 0 ${largeArcFlag} 1 ${centerx + _polar2CartesianX(r2, theta2)} ${centery + _polar2CartesianY(r2, theta2)} ` +
			       `L ${centerx + _polar2CartesianX(r1, theta2)} ${centery + _polar2CartesianY(r1, theta2)} ` +
			       `A ${r1} ${r1} 0 ${largeArcFlag} 0 ${centerx + _polar2CartesianX(r1, theta1)} ${centery + _polar2CartesianY(r1, theta1)} ` +
			       'Z';
		}

		// Using _floorToMultiple snaps the angles for segmenting
		var theta1 = _floorToMultiple(360 * (bytes[(i * 2) + 0] / 0xFF), 360 / segments);
		var theta2 = _floorToMultiple(360 * (bytes[(i * 2) + 1] / 0xFF), 360 / segments);

		if(theta2 < theta1){
			var temp = theta1;
			theta1 = theta2;
			theta2 = temp;
		}

		var arc = document.createElementNS(svgNS, 'path');
		arc.setAttribute('d', getArcPath(i, theta1, theta2));
		arc.setAttribute('fill', fillColor);
		svg.appendChild(arc);

		if(isFinite(symmetryAxisTilt)){
			var temp = theta1;
			theta1 = (symmetryAxisTilt * 2) - theta2;
			theta2 = (symmetryAxisTilt * 2) - temp;

			arc = document.createElementNS(svgNS, 'path');
			arc.setAttribute('d', getArcPath(i, theta1, theta2));
			arc.setAttribute('fill', fillColor);
			svg.appendChild(arc);
		}
	}

	return svg;
}

/**
 * Turns an id and a hashing function into a unique square identicon SVG element
 * @param {Number} size - Side length in pixels of the image
 * @param {String} hash - A string representing a hexadecimal number. Ideally, this is the output of a hash function such as MD5 or SHA-1.
 * @param {Object} [options] - An object containing options for customizing the identicon
 * @param {Number} [options.shells=4] - The number of shells to generate (min 1, max 8)
 * @param {Number} [options.edges=5] - The number of edges (i.e. 6 makes a regular hexagon shape)
 * @return {Object} An SVG element object
 */
function polygonalIdenticonSVG(size, hash, options){
	var bytes = _string2ByteArray(hash);

	var fillColor = "#" + bytes[bytes.length - 3].padFront(16, 2) +
	                      bytes[bytes.length - 2].padFront(16, 2) +
	                      bytes[bytes.length - 1].padFront(16, 2);

	var edges = (options && options['edges']) || 5;
	var shells = (options && options['shells']) || 4;
	var innerRadius = Math.floor(size / ((shells * 2) + 1));
	var centerx = Math.floor(size / 2);
	var centery = Math.floor(size / 2);

	svgNS = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(svgNS, 'svg');

	// Using crispEdges removes seams but also anti-aliasing
	// At the moment, seams are more acceptable than aliasing
	svg.setAttribute('width', size);
	svg.setAttribute('height', size);
	svg.setAttribute('xmlns', svgNS);
	//svg.setAttribute('shape-rendering', 'crispEdges');

	// TODO: Draw "arc" instead of each edge to avoid seams
	// Loop fills pieces for each shell
	for(var i = 0; i < shells; ++i){
		for(var j = 0; j < edges; ++j){
			if(!i || _getBit(((i * shells) + j) % bytes.length, bytes)){
				// Angles are used to determine the locations of the vertices
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

				// See MDN documentation on the SVG path element's d attribute
				var d = `M ${centerx + _polar2CartesianX(r2, theta1)} ${centery + _polar2CartesianY(r2, theta1)} ` +
				        `L ${centerx + _polar2CartesianX(r2, theta2)} ${centery + _polar2CartesianY(r2, theta2)} ` +
				        `L ${centerx + _polar2CartesianX(r1, theta2)} ${centery + _polar2CartesianY(r1, theta2)} ` +
				        `L ${centerx + _polar2CartesianX(r1, theta1)} ${centery + _polar2CartesianY(r1, theta1)} ` +
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
 * @access private
 * @param {String} string - The input to convert
 * @return {Number[]} An array with size half the length of the input string
 */
function _string2ByteArray(string){
	var bytes = [];
	for(var i = 0; i < string.length / 2; ++i){
		bytes[i] = parseInt(string.substr(i * 2, 2), 16);
	}
	return bytes;
}

/**
 * Gets the x-coordinate in Cartesian coordinates from polar coordinates
 * @access private
 * @param {Number} r - The distance from the origin
 * @param {Number} theta - The angle from the reference axis in degrees
 * @return {Number}
 */
function _polar2CartesianX(r, theta){
	var radians = Math.PI * (theta - 90) / 180;
	return r * Math.cos(radians);
}

/**
 * Gets the y-coordinate in Cartesian coordinates from polar coordinates
 * @access private
 * @param {Number} r - The distance from the origin
 * @param {Number} theta - The angle from the reference axis in degrees
 * @return {Number}
 */
function _polar2CartesianY(r, theta){
	var radians = Math.PI * (theta - 90) / 180;
	return r * Math.sin(radians);
}

/**
 * Used to segment arcs. Reduces a number to a multiple of some other number
 * @access private
 * @param {Number} n - The number to floor
 * @param {Number} m - The number to floor to a multiple of
 * @return {Number} Multiple of m closest to but not greater than n
 */
function _floorToMultiple(n, m){
	if(!m){
		return n;
	}
	n /= m;
	n = Math.floor(n);
	return n * m;
}

/**
 * Gets the nth bit from an array of bytes
 * @access private
 * @param {Number} n - The index of the bit (0 is the lowest-order bit, 8 is the first bit of the second byte, etc...)
 * @param {Number[]} bytes - The array of bytes to look through
 * @return {Number} 0 or 1
 */
function _getBit(n, bytes){
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

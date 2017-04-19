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
 * @param {Number} [options.segments=Infinity] - The number of segments of equal angle to snap the arcs to
 * @param {Number} [options.symmetryAxisTilt] - If defined, makes the SVG symmetric about the line defined here in polar coordinates (degrees)
 * @return {Object} - An SVG element object
 */
function circularIdenticonSVG(size, id, hashFunction, options){
	var idHash = string2ByteArray(hashFunction(id));

	// Color is just the rgb hex of the last 3 bytes
	var fillColor = "#" + idHash[idHash.length - 3].padFront(16, 2) +
	                      idHash[idHash.length - 2].padFront(16, 2) +
	                      idHash[idHash.length - 1].padFront(16, 2);

	// Gets options and known values and/or sets defaults
	var shells = (options && options['shells']) || 4;
	shells = Math.min(shells, 8);
	var segments = (options && options['segments']) || Infinity;
	var symmetryAxisTilt = options && Number(options['symmetryAxisTilt']) % 180;
	var innerRadius = Math.floor(size / ((shells * 2) + 1));
	var centerx = Math.floor(size / 2);
	var centery = Math.floor(size / 2);
	
	// Sets up SVG object
	var svgNS = 'http://www.w3.org/2000/svg';
	var svg = document.createElementNS(svgNS, 'svg');

	svg.setAttribute('width', size);
	svg.setAttribute('height', size);
	svg.setAttribute('xmlns', svgNS);

	// The inner circle always exists, so we create it outside the loop with just a circle
	var innerCircle = document.createElementNS(svgNS, 'circle');

	innerCircle.setAttribute('cx', centerx);
	innerCircle.setAttribute('cy', centery);
	innerCircle.setAttribute('r', innerRadius + 1);
	innerCircle.setAttribute('fill', fillColor);

	svg.appendChild(innerCircle);

	// Loop creates an arc for each shell
	for(var i = 1; i < shells; ++i){
		/**
		 * Generates the path attribute for an arc given a shell and two angles.
		 * @param {Number} shell - The shell to draw the arc for (affects radii)
		 * @param {Number} theta1 - The starting angle for drawing the arc (0, 360) (degrees)
		 * @param {Number} theta1 - The end angle for drawing the arc, theta2 > theta1 (0, 360) (degrees)
		 * @return {String} - A string containing the value of the d attribute for the path element
		 */
		var getArcPath = function (shell, theta1, theta2){
			var r1 = innerRadius * shell;
			var r2 = innerRadius * (i + 1) + 1;

			var largeArcFlag = (theta2 - theta1) < 180 ? 0 : 1;

			return `M ${centerx + polar2CartesianX(r2, theta1)} ${centery + polar2CartesianY(r2, theta1)} ` +
			       `A ${r2} ${r2} 0 ${largeArcFlag} 1 ${centerx + polar2CartesianX(r2, theta2)} ${centery + polar2CartesianY(r2, theta2)} ` +
			       `L ${centerx + polar2CartesianX(r1, theta2)} ${centery + polar2CartesianY(r1, theta2)} ` +
			       `A ${r1} ${r1} 0 ${largeArcFlag} 0 ${centerx + polar2CartesianX(r1, theta1)} ${centery + polar2CartesianY(r1, theta1)} ` +
			       'Z';
		}

		// Generate two angles randomly from the hash
		// Also snaps the angles to the edges of the segments
		var theta1 = floorToMultiple(360 * (idHash[(i * 2) + 0] / 0xFF), 360 / segments);
		var theta2 = floorToMultiple(360 * (idHash[(i * 2) + 1] / 0xFF), 360 / segments);

		// Makes theta1 < theta2
		if(theta2 < theta1){
			var temp = theta1;
			theta1 = theta2;
			theta2 = temp;
		}

		// Create a new path that is a single arc.
		var arc = document.createElementNS(svgNS, 'path');
		arc.setAttribute('d', getArcPath(i, theta1, theta2));
		arc.setAttribute('fill', fillColor);
		svg.appendChild(arc);

		// If the symmetry option is specified, create another path and reflect it around the specified angle
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
 * Reduces a number to a multiple of some other number
 * @param {Number} n - The number to floor
 * @param {Number} m - The number to floor to a multiple of
 * @return {Number} - Multiple of m closest to but not greater than n
 */
function floorToMultiple(n, m){
	if(!m){
		return n;
	}
	n /= m;
	n = Math.floor(n);
	return n * m;
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

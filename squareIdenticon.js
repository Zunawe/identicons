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
 */
function squareIdenticonSVG(size, id, hashFunction){
	var idHash = string2ByteArray(hashFunction(id.toString()));

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

	var fillColor = '#' + idHash[idHash.length - 3].padFront(16, 2) +
	                      idHash[idHash.length - 2].padFront(16, 2) +
	                      idHash[idHash.length - 1].padFront(16, 2);
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

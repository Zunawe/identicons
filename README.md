# Identicons
While the GitHub-style identicons are well-designed and widely implemented, they're square. And while this is perfectly acceptable in many designs, variety in choice is never a bad thing. This project aims to apply the simplicity of GitHub identicons to other shapes and styles.

I'd love to hear how you use these!

## Use
The functions expect to be passed the result of some hash as a string. It is up to you to provide the hash, whether you build it yourself or use an existing implementation. I would recommend using the MD5 implementation [here](https://github.com/Zunawe/md5-js) that hashes strings and is compatible. In a proper result, all substrings of the string must be parseable by `parseInt(str, 16)`. That is, something that looks like a single hexadecimal number. The length of the string must be divisible by 2 (so that it can be interpreted as bytes), and it must be greater than or equal to 8 (at least 4 bytes).

The functions `squareIdenticonSVG()`, `circularIdenticonSVG()`, and `polygonalIdenticonSVG()` return an SVG element that can be added to the DOM.

The functions are required to be run in a browser for the creation of namespaces for the SVG. However, the algorithm itself could easily be adapted outside a browser context.

### Square
```
squareIdenticonSVG(size, hash);
```
* **size**: *number*
  * The side length in pixels to define for the SVG
* **hash**: *string*
  * A string representing a hexadecimal number. Ideally, this is the output of a hash function such as MD5 or SHA-1

### Circular
```
circularIdenticonSVG(size, hash, [options]);
```
* **size**: *number*
  * The side length in pixels to define for the SVG
* **hash**: *string*
  * A string representing a hexadecimal number. Ideally, this is the output of a hash function such as MD5 or SHA-1
* **options**: *object* (optional)
  * **shells**: *number* = 4
    * The number of shells to create (including the inner circle). (Max 8)
  * **segments**: *number* = Infinity
    * Separates each shell into the provided number of segments, effectively snapping the edges of each arc to certain angles. Lower numbers increase the size of the smallest possible arclength, but provide slightly less overall variation (not enough to cause frequent collisions)
  * **symmetricAxisTilt**: *number*
    * Simultaneously forces the identicon to be symmetric across a single axis and sets the angle of this axis in degrees. (NOTE: This is not the same thing as rotating the identicon. It will look different at each angle mod 180).

### Polygonal
```
polygonalIdenticonSVG(size, hash, [options]);
```
* **size**: *number*
  * The side length in pixels to define for the SVG
* **hash**: *string*
  * A string representing a hexadecimal number. Ideally, this is the output of a hash function such as MD5 or SHA-1.
* **options**: *object* (optional)
  * **shells**: *number* = 4
    * The number of shells to create (including the inner shape)
  * **edges**: *number* = 5
    * The number of sides for the regular n-gon created (i.e. a value of 5 means a regular pentagon).

# Identicons
While the GitHub-style identicons are well-designed and widely implemented, they're square. And while this is perfectly acceptable in many designs, variety in choice is never a bad thing. This project aims to apply the simplicity of GitHub identicons to other shapes and styles.

## Use
The identicon files rely on a function named md5() that takes a single input and returns the MD5 hash of the input in the form of a string. This project includes an md5.min.js file with this function (from [this repository](https://github.com/Zunawe/md5-js)).

The minified versions already include the contents of md5.min.js, and may be safely used as a single inclusion.

The functions squareIdenticonSVG(), circularIdenticonSVG(), and polygonalIdenticonSVG() return an SVG element that may be appended to elements via JavaScript.

### Square
```
squareIdenticonSVG(size, id);
```
* **size**: *number*
  * The side length in pixels to define for the SVG
* **id**: *string*
  * The id to be hashed for this identicon

### Circular
```
circularIdenticonSVG(size, id, [options]);
```
* **size**: *number*
  * The side length in pixels to define for the SVG
* **id**: *string*
  * The id to be hashed for this identicon
* **options**: *object* (optional)
  * **shells**: *number* = 4
    * The number of shells to create (including the inner circle). (Max 8)
  * **segments**: *number* = Infinity
    * Separates each shell into the provided number of segments, effectively snapping the edges of each arc to certain angles. Lower numbers increase the size of the smallest possible arclength, but provide slightly less overall variation (not enough to cause frequent collisions)
  * **symmetricAxisTilt**: *number*
    * Simultaneously forces the identicon to be symmetric across a single axis and sets the angle of this axis in degrees. (NOTE: This is not the same thing as rotating the identicon. It will look different at each angle mod 180).

### Polygonal
```
polygonalIdenticonSVG(size, id, [options]);
```
* **size**: *number*
  * The side length in pixels to define for the SVG
* **id**: *string*
  * The id to be hashed for this identicon
* **options**: *object* (optional)
  * **shells**: *number* = 4
    * The number of shells to create (including the inner shape)
  * **edges**: *number* = 5
    * The number of sides for the regular n-gon created (i.e. a value of 5 means a regular pentagon).

The included file index.html gives a small example implementation in HTML.

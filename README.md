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
    * The number of shells to create (including the inner circle)
  * **segments**: *number* = Infinity
    * Separates each shell into the provided number of segments, effectively snapping the edges of each arc to certain angles. Lower numbers increase the size of the smallest possible arclength, but provide slightly less overall variation (not enough to cause frequent collisions)

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

## Algorithms
Here is a description of the algorithms used to generate each type of identicon. The particular hash function used in this project is MD5 (for its speed broad usability), but the principles can be applied to any reasonable hashing function for strings. The hashed data will be referred to as `hash`, and will be considered an array of bytes where `hash[0]` is the least significant byte and `hash[15]` is the most significant byte.

### Square
![Square Identicon Example](./examples/boxy.png "Boxy")

Following the style of our friends at GitHub, this creates a 5x5 grid of pixels.

1. The size of a pixel is determined to be 1/6th (rounded down) the dimensions of the canvas size (which is square).
2. Each margin is 1/12th the dimensions of the canvas plus the amount truncated from the calculation of the pixel size.
3. Color is determined by hexadecimal RGB with `hash[13]`, `hash[14]`, and `hash[15]` as values respectively.
4. From low- to high-order bits, and from left to right and top to bottom, the bit determines whether a pixel in the grid is filled or empty. This is calculated for the first three pixels of each row and then mirrored to the other side. Bit four corresponds to the second row, first pixel.

### Circular
![Circular Identicon Example](./examples/curvy.png "Curvy")

This style creates a circular icon with so many partially filled rings.

1. Each shell is a circle with a radius that is a multiple of the radius `r = (size / ((num_shells * 2) + 1))`.
2. The nth ring moving outward from the center has inner radius `n * r` and inouterner radius `(n + 1) * r` (`n = 0` is the innermost ring).
3. Color is determined by hexadecimal RGB with `hash[13]`, `hash[14]`, and `hash[15]` as values respectively.
4. The innermost ring is a filled circle with radius `r` for every identicon.
5. Starting from the inside and moving outward, the nth arc is drawn with inner radius `n * r` and outer radius `(n + 1) * r`. Calculations are done in polar coordinates.
  * Two angles are calculated:
    * ```theta1 = 2\pi * (hash[(n * 2) + 0] / 0xFF)```
    * ```theta2 = 2\pi * (hash[(n * 2) + 1] / 0xFF)```
  * The arc is drawn from smaller angle to bigger angle.
  * Each ring has exactly 1 arc in it.

### Polygonal
![Polygonal Identicon Example](./examples/poly.png "Poly")

The polygonal option is the most versatile so far. It produces a shell of polygons where some edges are filled and others are empty (similar to circular, but with edges).

1. The vertices of the each shell are based on a circle of radius `r = (size / ((num_shells * 2) + 1))`.
2. The nth shell moving outward from the center has outer radius `n * r` and inner radius `((n + 1) * r) * 0.9` (`n = 0` is the innermost shape).
3. Color is determined by hexadecimal RGB with `hash[13]`, `hash[14]`, and `hash[15]` as values respectively.
4. The innermost shape is always filled completely.
5. For each shell, going from inner shell to outer shell, from low- to high-order bits, starting at an angle of 0 degrees and moving counterclockwise, the bit determines whether an edge is filled or empty. A polygon of `m` sides has a radial length of `360 / m`.

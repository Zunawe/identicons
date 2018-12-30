# Identicons

While the GitHub-style identicons are well-designed and widely implemented, they're square. And while this is perfectly acceptable in many designs, variety in choice is never a bad thing. This project aims to apply the simplicity of GitHub identicons to other shapes and styles.

I'd love to hear how you use these!

## Use

The first thing you need to do is find a hashing function. The function should take a string as its first argument and return a string representing the hash (e.g. `"Hello, world!" => "6cd3556deb0da54bca060b4c39479839"`). The hash is understood as the hexadecimal spelling of data, so every two characters represent a byte (`"f1"` is `11110001` in binary). The function should produce a minimum of 5 bytes for square identicons (more for more complex shapes). [This](https://github.com/Zunawe/md5-js) MD5 implementation is compatible.

Then you'll need to construct a generator:

```
var identicons = new IdenticonGenerator(myHashFunction);
```

You can also change the hash function later by setting the `hashFunction` attribute of the `IdenticonGenerator`. You can also change the default options with the second argument of the constructor or by editing the `defaultOptions` attribute of the `IdenticonGenerator`.

Generated identicons are returned as SVG elements that can be attached to the DOM.

### Generation

The best way to learn what the options do is to try them out [here](https://zunawe.github.io/identicons/).

```
generate(id, [options])
```

* **id**: *string*
  * A string id to be represented by an identicon.
* **options**: *object* (optional)
  * **type**: *string* = `'square'`
    * The type of identicon to generate ('square', 'circular', or 'polygonal').
  * **size**: *number* = `512`
    * The dimension of the image in pixels.
  * **shells**: *number* = `4`
    * The number of shells to generate.
  * **segments**: *number* = `Infinity`
    * Separates each shell into the provided number of segments, effectively snapping the edges of each arc to certain angles. Lower numbers increase the size of the smallest possible arclength, but provide slightly less overall variation (not enough to cause frequent collisions)
  * **symmetricAxisTilt**: *number* = `null`
    * Simultaneously forces the identicon to be symmetric across a single axis and sets the angle of this axis in degrees. (NOTE: This is not the same thing as rotating the identicon. It will look different at each angle mod 180). To have no symmetry, set this value to `null`.
  * **edges**: *number* = `5`
    * The number of sides for the regular n-gon created (i.e. a value of 5 means a regular pentagon).

#### Square

![Square Identicon Example](examples/boxy.png)

```
options.type = 'square'
```

Other options used:
* **size**

#### Circular

![Circular Identicon Example](examples/curvy.png)

```
options.type = 'circular'
```

Other options used:
* **size**
* **shells**
* **segments**
* **symmetricAxisTilt**


#### Polygonal

![Polygonal Identicon Example](examples/poly.png)

```
options.type = 'polygonal'
```

Other options used:
* **size**
* **shells**
* **edges**

# Identicons

While the GitHub-style identicons are well-designed and widely implemented, they're square. And while this is perfectly acceptable in many designs, variety in choice is never a bad thing. This project aims to apply the simplicity of GitHub identicons to other shapes and styles.

I'd love to hear how you use these!

## Use

The first thing you need to do is find a way to hash the data you want to "identify" with an identicon. For example, you could use MD5 to produce this transformation: `"Hello, world!" => '6cd3556deb0da54bca060b4c39479839'`). The hash doesn't need to be enormous, but should be more than 9 bytes. The function doesn't need to be complex, but each bit in the hash should have about a 50/50 chance of being 1 or 0. The less random the hash is, the more predictable the image will be, so just using incremental user ids is probably not enough for variation.

This hash can either be a string of hexadecimal digits or an `ArrayBuffer`.

An important note: this code is open source (obviously), does no further processing on the provided hashes, and may or may not use the entirety of the hash to generate an image. **DO NOT** use these identicons to represent sensitive data, even if you use some supposedly secure hashing algorithm. While it may be tempting to use something like the hex representation of a scrambled user email as a hash, please don't. That's equivalent to setting your user's public username to their email. Identicons are **not** encryption.

### Generation

The best way to learn what the options do is to try them out [here](https://zunawe.github.io/identicons/).

```js
const identicon = require('svg-identicon')
identicon(options)
```

Not every option is used for every `type` of identicon.

* **options**: *object*
  * **hash**: *string*
    * A string of hexadecimal digits used to generate the identicon.
  * **type**: *string*
    * The type of identicon to generate (`'SQUARE'`, `'CIRCULAR'`, or `'POLYGONAL'`).
  * **width**: *number* = `128`
    * The dimension of the image in pixels.
  * **size**: *number*
    * A sort of dimension describing the complexity of the identicon. For squares identicons, it's the number of boxes on a side. For circular it's the number of shells.
  * **segments**: *number*
    * Separates each shell into the provided number of segments.
  * **symmetricAxisTilt**: *number* = `null`
    * Simultaneously forces the identicon to be symmetric across a single axis and sets the angle of this axis in degrees. (NOTE: This is not the same thing as rotating the identicon. It will look different at each angle mod 180). To have no symmetry, set this value to `null`.
  * **background**: *object*
    * **color**: *string* = `'#EEEEEE'`
    * **width**: *number* = `options.width`
    * **rx**: *number* = `0`

##### Square

![Square Identicon Example](examples/boxy.png)

Required Options:
* **type** = `'SQUARE'`
* **hash**

Other Options:
* **size**
* **width**

##### Circular

![Circular Identicon Example](examples/curvy.png)

Required Options:
* **type** = `'CIRCULAR'`
* **hash**

Other Options:
* **size**
* **width**
* **segments**
* **symmetricAxisAngle**

##### Polygonal

![Polygonal Identicon Example](examples/poly.png)

Required Options:
* **type** = `'POLYGONAL'`
* **hash**

Other Options:
* **size**
* **width**
* **segments**

#### Output

The return value of `identicon` is the string representation of an SVG. You can save this to a file, parse it, add it to a DOM, log it, etc...

Node:
```js
const fs = require('fs')

let svg = identicon({ type: 'SQUARE', hash: '1234567890ABCDEF' })

fs.writeFile(./'identicon.svg', svg, console.log)
```

Browser (after using webpack):
```js
let svg = identicon({ type: 'SQUARE', hash: '1234567890ABCDEF' })

let container = document.getElementById("container");
container.innerHTML = svg;
```

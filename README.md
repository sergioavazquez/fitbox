# FitBox

[![npm version](https://badge.fury.io/js/react-fitbox.svg)](https://badge.fury.io/js/react-fitbox)
![MIT](https://badgen.net/badge/license/MIT/blue)

`FitBox` is a scalable box that allows you to absolutely position elements inside it to compose visuals.

Scaling animations, text and visuals can get tricky very fast. Depeding on layout design, scaling everything properly is sometimes time consuming and challenging, specially if the layout was not well thaught through.

[Live Example Here](https://sergioavazquez.github.io/fitbox-demo/)


# Install
```
npm i react-fitbox
```

# Minimal Configuration

```
<FitBox ratio={.5} size={256}>
  // place content here.
</FitBox>
```

It creates a square box of `256px` and centers it in the middle of the screen. Inside this box there's absolute positioning `256` x `256` just like if you where inside and `SVG` with a viewport that size.

Since no `container` (more on this later) is used it assumes the entire `height` and `width` of the screen are available.

Depending on screen size it will either scale that box up or down to match the ratio provided. In this example `0.5` or 50%.

By default, `FitBox` will scale content to fit vertically without boundaries. You can also configure it to fit content horizontally and set up independant scale boudaries for width and height.


# Advanced example

```
<div className='app'>
  <Navigation className="nav" />
  <div ref={containerRef} className="container">
    <FitBox ratio={.5} size={{ w: 500, h: 360 }} fitWidth container={containerRef} >
      <span className="text">500px x 360px</span>
    </FitBox>
  </div>
</div>
```

IMPORTANT!!! : `.container` element __MUST__ have defined `height` and `width` for this to work.

```
.app{
  height: 100vh;
  width: 100vw;
}

.nav{
  height: 45px;
  width: 100%;
}

.container{
  height: calc(100% - 45px);
  width: 100%;
}

```

`containerRef` is a reference to the element we want to use as the outer boundary. In this case, everything but the navigation bar.
```
const containerRef = useRef();
```

`size` is now a rect: `{ w: 500, h: 360 }`

`ratio` is still `.5`.

This means our `500px` high box, is going to take half of the screen with any screen size.

> Full HD desktop:

![1920_1080](https://i.imgur.com/lf0kWj0.png "1920 x 1080")

> Small phone landscape

![640_360](https://i.imgur.com/DsGacRf.png "640 x 360")


In the example above `fitWidth` is also enabled which means it's not only going to scale vertically but horizontally.

If fitting vertically and horizontally at the same time it will always pick the smallest scale.

> Small phone portrait

![360_640](https://i.imgur.com/bD5kQNh.png "360 x 640")

`limitHeight` and `limitWitdh` can have `min`, `max` boudaries, one of them or none. The limits are expressed in `ratio`s. Meaning the minimum and maximum ratios that can be assigned to the scalable box.

This is useful, for example,  if using a `500px` box with a `1000px` image on it, `max` should be `2` at most to avoid image quality loss when up-scaling.

# Props

| prop            | Type                                 | Default   |
| --------------- |:------------------------------------:| ---------:|
| `size`          | `Number` or {h:`Number` w:`Number` } |   256     |
| `ratio`         | `Number` or {h:`Number` w:`Number` } |   0.5     |
| `fitHeight`     | `bool`                               |   false   |
| `fitWidth`      | `bool`                               |   true    |
| `limitHeight`   | {min:`Number`, max:`Number`}         |   0 - Inf |
| `limitWidth`    | {min:`Number`, max:`Number`}         |   0 - Inf |
| `container`     | `ref`                                |   false   |
| `debug`         | `bool`                               |   false   |


# Want to try it out?

[Fitbox](https://github.com/sergioavazquez/fitbox)

- `git clone`
- `yarn install`
- `yarn start` (demo)

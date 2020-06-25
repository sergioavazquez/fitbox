var defaultConfig = {
  ratio: {
    h: 0.5,
    w: 0.5
  },
  size: {
    h: 320,
    w: 320
  },
  limitHeight: {
    min: 0,
    max: Infinity
  },
  limitWidth: false
};
var noLimit = {
  min: 0,
  max: Infinity
};

var isObject = function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
};

var fetchPropObject = function fetchPropObject(prop, value) {
  if (value === undefined || value === null) {
    return defaultConfig[prop];
  }

  return isObject(value) ? {
    h: value.h,
    w: value.w
  } : {
    h: value,
    w: value
  };
};

var lastArgs = null; // args during last call.

var cachedResult = null; // last result (parsed props)

var parseProps = function parseProps() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      args = Object.assign({}, _ref);

  var ratio = args.ratio,
      size = args.size,
      limitHeight = args.limitHeight,
      limitWidth = args.limitWidth,
      fitHeight = args.fitHeight,
      fitWidth = args.fitWidth;
  var shouldUpdate = true; // Cache results

  if (lastArgs && isObject(lastArgs)) {
    // use _.equal() for better performance. (Used to avoid adding dependencies)
    shouldUpdate = JSON.stringify(args) !== JSON.stringify(lastArgs);
  }

  if (!shouldUpdate && cachedResult) {
    return cachedResult;
  }

  lastArgs = args; // parse ratio

  var r = fetchPropObject('ratio', ratio); // parse size

  var s = fetchPropObject('size', size);
  var lh = false;

  if (fitHeight !== false) {
    if (isObject(limitHeight)) {
      lh = {};
      var min = Object.keys(limitHeight).includes("min") ? limitHeight.min : defaultConfig.limitHeight.min;
      var max = Object.keys(limitHeight).includes("max") ? limitHeight.max : defaultConfig.limitHeight.max;
      lh = {
        min: min,
        max: max
      };
    } else {
      lh = defaultConfig.limitHeight;
    }
  }

  var lw = false;

  if (fitWidth) {
    if (isObject(limitWidth)) {
      lw = {};

      var _min = Object.keys(limitWidth).includes("min") ? limitWidth.min : defaultConfig.limitWidth.min;

      var _max = Object.keys(limitWidth).includes("max") ? limitWidth.max : defaultConfig.limitWidth.max;

      lw = {
        min: _min,
        max: _max
      };
    } else {
      lw = noLimit;
    }
  }

  cachedResult = {
    ratio: r,
    size: s,
    limitHeight: lh,
    limitWidth: lw
  };
  return cachedResult;
};

var calculateScale = function calculateScale(_ref2) {
  var config = _ref2.config,
      availableHeight = _ref2.availableHeight,
      availableWidth = _ref2.availableWidth;
  var vScaleH = false;

  if (config.limitHeight) {
    // config.limitHeight only exists if fitHeight = true;
    var scaleH = Math.round(availableHeight * config.ratio.h / config.size.h * 100) / 100;
    vScaleH = scaleH < config.limitHeight.min ? config.limitHeight.min : scaleH;
    vScaleH = scaleH > config.limitHeight.max ? config.limitHeight.max : vScaleH;
  }

  var vScaleW = false;

  if (config.limitWidth) {
    // config.limitWidth only exists if fitWidth = true;
    var scaleW = Math.round(availableWidth * config.ratio.w / config.size.w * 100) / 100;
    vScaleW = scaleW < config.limitWidth.min ? config.limitWidth.min : scaleW;
    vScaleW = scaleW > config.limitWidth.max ? config.limitWidth.max : vScaleW;
  }

  var scale = vScaleW || vScaleH;

  if (config.limitHeight && config.limitWidth) {
    scale = Math.min(vScaleH, vScaleW);
  }

  scale = scale === false ? 1 : scale;
  return scale;
};

export { parseProps, calculateScale, defaultConfig };
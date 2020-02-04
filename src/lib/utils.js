
const defaultConfig = {
  ratio: { h: 0.5, w: 0.5 },
  size: { h: 320, w: 320 },
  limitHeight: { min: 0, max: Infinity },
  limitWidth: false
};

const noLimit = { min: 0, max: Infinity };

const isObject = (value) => {
  return value && typeof value === 'object' && value.constructor === Object;
}

const fetchPropObject = (prop, value) => {
  if (value === undefined || value === null) {
    return defaultConfig[prop];
  }
  return isObject(value) ? { h: value.h, w: value.w } : { h: value, w: value };
}

let lastArgs = null; // args during last call.
let cachedResult = null; // last result (parsed props)
const parseProps = ({ ...args }) => {
  const { ratio, size, limitHeight, limitWidth, fitHeight, fitWidth } = args;
  let shouldUpdate = true;
  // Cache results
  if (lastArgs && isObject(lastArgs)) {
    // use _.equal() for better performance. (Used to avoid adding dependencies)
    shouldUpdate = JSON.stringify(args) !== JSON.stringify(lastArgs);
  }
  if (!shouldUpdate && cachedResult) {
    return cachedResult;
  }
  lastArgs = args;
  // parse ratio
  const r = fetchPropObject('ratio', ratio);
  // parse size
  const s = fetchPropObject('size', size);

  let lh = false;
  if (fitHeight !== false) {
    if (isObject(limitHeight)) {
      lh = {};
      const min = Object.keys(limitHeight).includes("min") ? limitHeight.min : defaultConfig.limitHeight.min;
      const max = Object.keys(limitHeight).includes("max") ? limitHeight.max : defaultConfig.limitHeight.max;
      lh = { min, max };
    } else {
      lh = defaultConfig.limitHeight;
    }
  }

  let lw = false;
  if (fitWidth) {
    if (isObject(limitWidth)) {
      lw = {};
      const min = Object.keys(limitWidth).includes("min") ? limitWidth.min : defaultConfig.limitWidth.min;
      const max = Object.keys(limitWidth).includes("max") ? limitWidth.max : defaultConfig.limitWidth.max;
      lw = { min, max };
    } else {
      lw = noLimit;
    }
  }
  cachedResult = { ratio: r, size: s, limitHeight: lh, limitWidth: lw };
  return cachedResult;
}

const calculateScale = ({ config, availableHeight, availableWidth }) => {

  let vScaleH = false;
  if (config.limitHeight) {
    // config.limitHeight only exists if fitHeight = true;
    const scaleH = Math.round(((availableHeight * config.ratio.h) / config.size.h) * 100) / 100;
    vScaleH = scaleH < config.limitHeight.min ? config.limitHeight.min : scaleH;
    vScaleH = scaleH > config.limitHeight.max ? config.limitHeight.max : vScaleH;
  }
  let vScaleW = false;
  if (config.limitWidth) {
    // config.limitWidth only exists if fitWidth = true;
    const scaleW = Math.round(((availableWidth * config.ratio.w) / config.size.w) * 100) / 100;
    vScaleW = scaleW < config.limitWidth.min ? config.limitWidth.min : scaleW;
    vScaleW = scaleW > config.limitWidth.max ? config.limitWidth.max : vScaleW;
  }
  let scale = vScaleW || vScaleH;
  if (config.limitHeight && config.limitWidth) {
    scale = Math.min(vScaleH, vScaleW);
  }
  scale = scale === false ? 1 : scale;
  return scale;
}

export { parseProps, calculateScale, defaultConfig };

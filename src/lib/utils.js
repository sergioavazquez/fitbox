
const defaultConfig = {
  ratio: { h: 0.5, w: 0.5 },
  size: { h: 320, w: 320 },
  limitHeight: { min: 0, max: Infinity },
  limitWidth: { min: 0, max: Infinity }
};

const isObject = (value) => {
  return value && typeof value === 'object' && value.constructor === Object;
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
  let r;
  try {
    r = isObject(ratio) ? { h: ratio.h, w: ratio.w } : { h: ratio, w: ratio };
  } catch (e) {
    console.error("FitBox: `ratio` format is not valid. ")
    r = defaultConfig.ratio;
  }
  // parse size
  let s;
  try {
    s = isObject(size) ? { h: size.h, w: size.w } : { h: size, w: size };
  } catch (e) {
    console.error("FitBox: `size` format is not valid. ")
    s = defaultConfig.size;
  }
  // parse limitHeight
  let lh = false;
  if (fitHeight !== false) {
    lh = {};
    if (isObject(limitHeight)) {
      const min = Object.keys(limitHeight).includes("min") ? limitHeight.min : defaultConfig.limitHeight.min;
      const max = Object.keys(limitHeight).includes("max") ? limitHeight.max : defaultConfig.limitHeight.max;
      lh = { min, max };
    } else {
      lh = defaultConfig.limitHeight;
    }
  }

  let lw = false;
  if (fitWidth) {
    lw = {};
    if (isObject(limitWidth)) {
      const min = Object.keys(limitWidth).includes("min") ? limitWidth.min : defaultConfig.limitWidth.min;
      const max = Object.keys(limitWidth).includes("max") ? limitWidth.max : defaultConfig.limitWidth.max;
      lw = { min, max };
    } else {
      lw = defaultConfig.limitWidth;
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
    console.log({ vScaleH, vScaleW, availableHeight, availableWidth });
    scale = Math.min(vScaleH, vScaleW);
  }
  scale = scale === false ? 1 : scale;
  return scale;
}

export { parseProps, calculateScale };

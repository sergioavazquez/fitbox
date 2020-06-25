import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { calculateScale, parseProps } from './utils';
import './fitBox.css';
var styles = {
  fitBoxWrapper: 'fitBox__wrapper',
  fitBox: 'fitBox__main',
  debug: 'debug'
};

var FitBox = function FitBox(_ref) {
  var children = _ref.children,
      ratio = _ref.ratio,
      size = _ref.size,
      limitHeight = _ref.limitHeight,
      limitWidth = _ref.limitWidth,
      fitHeight = _ref.fitHeight,
      fitWidth = _ref.fitWidth,
      container = _ref.container,
      enabled = _ref.enabled,
      debug = _ref.debug;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      init = _useState2[0],
      setInit = _useState2[1];

  var _useState3 = useState({
    wrapperHeight: null,
    wrapperWidth: null,
    size: {
      h: null,
      w: null
    },
    scale: null
  }),
      _useState4 = _slicedToArray(_useState3, 2),
      specs = _useState4[0],
      setSpecs = _useState4[1];

  var memoConfig = useMemo(function () {
    return parseProps({
      ratio: ratio,
      size: size,
      limitHeight: limitHeight,
      limitWidth: limitWidth,
      fitHeight: fitHeight,
      fitWidth: fitWidth
    });
  }, [ratio, size, limitHeight, limitWidth, fitHeight, fitWidth]);
  var updateScale = useCallback(function () {
    var availableHeight = window.innerHeight;
    var availableWidth = window.innerWidth;

    if (container && container.current) {
      availableHeight = container.current.getBoundingClientRect().height;
      availableWidth = container.current.getBoundingClientRect().width;
    }

    if (!enabled) {
      return;
    }

    ;
    var config = memoConfig;
    var currentScale = calculateScale({
      config: config,
      availableHeight: availableHeight,
      availableWidth: availableWidth
    }); // Check if specs needs updating

    var shouldUpdate = availableHeight !== specs.wrapperHeight || availableWidth !== specs.wrapperWidth;
    shouldUpdate = shouldUpdate || currentScale.h !== specs.scale.h || currentScale.w !== specs.scale.w || config.size !== specs.size;

    if (!shouldUpdate) {
      return;
    }

    ; // Already set.

    if (debug) {
      console.log({
        currentScale: currentScale,
        size: config.size,
        ratio: config.ratio,
        aHeight: availableHeight,
        aWidth: availableWidth
      });
    }

    setSpecs({
      scale: currentScale,
      size: config.size,
      wrapperHeight: availableHeight,
      wrapperWidth: availableWidth
    });
  }, [specs, enabled, memoConfig, container, debug]);
  useEffect(function () {
    if (!init) {
      window.setTimeout(function () {
        updateScale();
      }, 150);
      setInit(true);
    }

    window.addEventListener('resize', updateScale);
    return function () {
      window.removeEventListener('resize', updateScale);
    };
  }, [updateScale, init]);

  var fetchFitBoxStyle = function fetchFitBoxStyle() {
    var fitBoxStyle = {
      transform: "translate(-50%, -50%) scale(".concat(specs.scale, ")"),
      height: "".concat(specs.size.h, "px"),
      width: "".concat(specs.size.w, "px")
    };
    return fitBoxStyle;
  };

  var fetchFitBoxClass = function fetchFitBoxClass() {
    var style = styles.fitBox;

    if (debug) {
      style = [style, styles.debug].join(' ');
    }

    return style;
  };

  var fetchWrapperStyle = function fetchWrapperStyle() {
    var show = specs.size && specs.scale;
    var wrapperStyle = {
      height: "".concat(specs.wrapperHeight, "px"),
      width: "".concat(specs.wrapperWidth, "px"),
      opacity: show ? 1 : 0
    };

    if (container && container.current) {
      wrapperStyle = {
        height: "100%",
        width: "100%",
        opacity: show ? 1 : 0
      };
    }

    return wrapperStyle;
  };

  var renderChildren = function renderChildren(children) {
    return React.Children.map(children, function (child) {
      var props = _objectSpread({}, child.props);

      return /*#__PURE__*/React.createElement(child.type, props);
    });
  };

  return /*#__PURE__*/React.createElement("div", {
    className: styles.fitBoxWrapper,
    style: fetchWrapperStyle()
  }, /*#__PURE__*/React.createElement("div", {
    className: fetchFitBoxClass(),
    style: fetchFitBoxStyle()
  }, renderChildren(children)));
};

FitBox.defaultProps = {
  enabled: true,
  size: 256,
  ratio: 0.5,
  limitHeight: false,
  limitWidth: false,
  fitHeight: true,
  fitWidth: false,
  container: false,
  debug: false
};
export default FitBox;
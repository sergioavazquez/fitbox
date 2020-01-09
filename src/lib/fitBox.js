import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { calculateScale, parseProps } from './utils'
import './fitBox.css';

const styles = {
  fitBoxWrapper: 'fitBox__wrapper',
  fitBox: 'fitBox__main',
  debug: 'debug'
}

const FitBox = ({
  children,
  ratio,
  size,
  limitHeight,
  limitWidth,
  fitHeight,
  fitWidth,
  container,
  enabled,
  debug
}) => {
  const [init, setInit] = useState(false);
  const [specs, setSpecs] = useState({ wrapperHeight: null, wrapperWidth: null, size: { h: null, w: null }, scale: null });

  const memoConfig = useMemo(() => {
    return parseProps({ ratio, size, limitHeight, limitWidth, fitHeight, fitWidth })
  }, [ratio, size, limitHeight, limitWidth, fitHeight, fitWidth])

  const updateScale = useCallback(() => {
    let availableHeight = window.innerHeight;
    let availableWidth = window.innerWidth;
    if (container && container.current) {
      availableHeight = container.current.getBoundingClientRect().height;
      availableWidth = container.current.getBoundingClientRect().width;
    }

    if (!enabled) { return };

    const config = memoConfig;
    const currentScale = calculateScale({ config, availableHeight, availableWidth });

    // Check if specs needs updating
    let shouldUpdate = availableHeight !== specs.wrapperHeight || availableWidth !== specs.wrapperWidth;
    shouldUpdate = shouldUpdate ||
      currentScale.h !== specs.scale.h ||
      currentScale.w !== specs.scale.w ||
      config.size !== specs.size;

    if (!shouldUpdate) { return }; // Already set.

    if (debug) {
      console.log({ currentScale, size: config.size, ratio: config.ratio, aHeight: availableHeight, aWidth: availableWidth });
    }
    setSpecs({
      scale: currentScale,
      size: config.size,
      wrapperHeight: availableHeight,
      wrapperWidth: availableWidth
    });
  }, [specs, enabled, memoConfig, container, debug])

  useEffect(() => {
    if (!init) {
      window.setTimeout(() => {
        updateScale();
      }, 150);
      setInit(true);
    }
    window.addEventListener('resize', updateScale);
    return (() => {
      window.removeEventListener('resize', updateScale);
    })
  }, [updateScale, init])

  const fetchFitBoxStyle = () => {
    let fitBoxStyle = {
      transform: `translate(-50%, -50%) scale(${specs.scale})`,
      height: `${specs.size.h}px`,
      width: `${specs.size.w}px`
    }
    return fitBoxStyle;
  }

  const fetchFitBoxClass = () => {
    let style = styles.fitBox;
    if (debug) {
      style = [style, styles.debug].join(' ');
    }
    return style;
  }

  const fetchWrapperStyle = () => {
    let show = specs.size && specs.scale;
    let wrapperStyle = {
      height: `${specs.wrapperHeight}px`,
      width: `${specs.wrapperWidth}px`,
      opacity: show ? 1 : 0
    }
    if (container && container.current) {
      wrapperStyle = {
        height: "100%",
        width: "100%",
        opacity: show ? 1 : 0
      };
    }

    return wrapperStyle;
  }

  const renderChildren = (children) => {
    return React.Children.map(children, child => {
      const props = {
        ...child.props,
      };
      return <child.type {...props} />;
    });
  };

  return (
    <div className={styles.fitBoxWrapper} style={fetchWrapperStyle()}>
      <div className={fetchFitBoxClass()} style={fetchFitBoxStyle()}>
        {renderChildren(children)}
      </div>
    </div>
  );
}

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

FitBox.propTypes = {
  enabled: PropTypes.bool,
  debug: PropTypes.bool,
  fitWidth: PropTypes.bool,
  fitHeight: PropTypes.bool,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ h: PropTypes.number, w: PropTypes.number }),
  ]),
  ratio: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({ h: PropTypes.number, w: PropTypes.number }),
    PropTypes.shape({ h: PropTypes.number }),
    PropTypes.shape({ w: PropTypes.number })
  ]),
  limitHeight: PropTypes.oneOfType([
    PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
    PropTypes.shape({ min: PropTypes.number }),
    PropTypes.shape({ max: PropTypes.number }),
    PropTypes.bool,
  ]),
  limitWidth: PropTypes.oneOfType([
    PropTypes.shape({ min: PropTypes.number, max: PropTypes.number }),
    PropTypes.shape({ min: PropTypes.number }),
    PropTypes.shape({ max: PropTypes.number }),
    PropTypes.bool,
  ]),
  container: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.bool,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

export default FitBox;
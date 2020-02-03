import { parseProps, calculateScale, defaultConfig } from '../lib/utils';


describe('Utility functions: ', () => {
  test('No props, should fallback to default props.', () => {
    expect(parseProps()).toEqual(defaultConfig);
  });

  test('All props passed correctly should work', () => {
    const config = {
      ratio: { h: 0.5, w: 0.8 },
      size: { h: 400, w: 540 },
      limitHeight: { min: .5, max: 1 },
      limitWidth: false
    }
    const props = { ...config, fitWidth: false };
    expect(parseProps(props)).toEqual(config);
  });

  test('Props shorthand whould work', () => {
    const props = {
      ratio: 0.3,
      size: 250,
      limitHeight: { min: .5, max: 1 },

    }
    const result = {
      ...props,
      limitWidth: defaultConfig.limitWidth,
      ratio: { h: 0.3, w: 0.3 },
      size: { h: 250, w: 250 }
    };
    expect(parseProps(props)).toEqual(result);
  });

  test('Should scale in height only', () => {
    const config = {
      ratio: { h: 0.5, w: 0.8 },
      size: { h: 384, w: 1400 },
      limitHeight: { min: .5, max: 1 },
      limitWidth: false
    }
    const availableWidth = 1366;
    const availableHeight = 768;
    expect(calculateScale({ config, availableHeight, availableWidth })).toEqual(1);
  });

  test('Should scale in width only', () => {
    const config = {
      ratio: { h: 0.5, w: 0.8 },
      size: { h: 584, w: 800 },
      limitHeight: false,
      limitwidth: { min: .5, max: 1 },
    }
    const availableWidth = 1000;
    const availableHeight = 768;
    expect(calculateScale({ config, availableHeight, availableWidth })).toEqual(1);
  });

  test('Should pick scale that fits', () => {
    const config = {
      ratio: { h: 0.5, w: 0.5 },
      size: { h: 600, w: 800 },
      limitHeight: { min: .5, max: 1 },
      limitWidth: { min: .5, max: 1 },
    }
    const availableWidth = 1000;
    const availableHeight = 600;
    expect(calculateScale({ config, availableHeight, availableWidth })).toEqual(0.5);
  });

  test('Should respect limitWidth min ratio', () => {
    const config = {
      ratio: { h: 0.5, w: 0.5 },
      size: { h: 600, w: 800 },
      limitHeight: false,
      limitWidth: { min: .5, max: 1 },
    }
    const availableWidth = 600;
    const availableHeight = 600;
    expect(calculateScale({ config, availableHeight, availableWidth })).toEqual(0.5);
  });

  test('Should respect limitWidth max ratio', () => {
    const config = {
      ratio: { h: 0.5, w: 0.5 },
      size: { h: 600, w: 300 },
      limitHeight: false,
      limitWidth: { min: .5, max: 2 },
    }
    const availableWidth = 1800;
    const availableHeight = 600;
    expect(calculateScale({ config, availableHeight, availableWidth })).toEqual(2);
  });

  test('Should respect limitHeight min ratio', () => {
    const config = {
      ratio: { h: 0.5, w: 0.5 },
      size: { h: 600, w: 800 },
      limitHeight: { min: .5, max: 1 },
      limitWidth: false,
    }
    const availableWidth = 800;
    const availableHeight = 400;
    expect(calculateScale({ config, availableHeight, availableWidth })).toEqual(0.5);
  });

  test('Should respect limitHeight max ratio', () => {
    const config = {
      ratio: { h: 0.5, w: 0.5 },
      size: { h: 200, w: 300 },
      limitHeight: { min: .5, max: 2 },
      limitWidth: false,
    }
    const availableWidth = 800;
    const availableHeight = 1200;
    expect(calculateScale({ config, availableHeight, availableWidth })).toEqual(2);
  });
})

import { describe, it, expect } from 'vitest';
import {
  stylingDefaults,
  getFrameShadow,
  getActiveGlowShadow,
  getConfigItemBackground,
  getConfigItemBoxShadow,
  getConfigItemTransition,
  shadowConfig,
  activeGlowConfig,
  computeNeomorphControlStyle,
  PANeomorphControlStyle
} from '../lib/utils/styling';
import { StylingKey } from '../../shared/enums';
import { PASize } from '../lib/types';

describe('Styling Utilities', () => {
  describe('stylingDefaults', () => {
    it('should contain all required styling keys', () => {
      expect(stylingDefaults).toHaveProperty(StylingKey.itemBackground);
      expect(stylingDefaults).toHaveProperty(StylingKey.dragBackground);
      expect(stylingDefaults).toHaveProperty(StylingKey.activeOverlay);
      expect(stylingDefaults).toHaveProperty(StylingKey.buttonBaseColor);
      expect(stylingDefaults).toHaveProperty(StylingKey.frameShadowLight);
      expect(stylingDefaults).toHaveProperty(StylingKey.frameShadowDark);
    });

    it('should have correct default values', () => {
      expect(stylingDefaults[StylingKey.itemBackground]).toBe('#1A1A1A');
      expect(stylingDefaults[StylingKey.dragBackground]).toBe('#181818');
      expect(stylingDefaults[StylingKey.activeOverlay]).toBe('rgba(6, 182, 212, 0.12)');
      expect(stylingDefaults[StylingKey.buttonBaseColor]).toBe('#0d0d0d');
    });
  });

  describe('getFrameShadow', () => {
    it('should generate correct frame shadow with defaults', () => {
      const shadow = getFrameShadow();
      expect(shadow).toContain('inset');
      expect(shadow).toContain(stylingDefaults[StylingKey.frameShadowLight]);
      expect(shadow).toContain(stylingDefaults[StylingKey.frameShadowDark]);
    });

    it('should use custom parameters', () => {
      const shadow = getFrameShadow('red', 'blue', 3, 4);
      expect(shadow).toContain('red');
      expect(shadow).toContain('blue');
      expect(shadow).toContain('3px');
      expect(shadow).toContain('4px');
    });
  });

  describe('getActiveGlowShadow', () => {
    it('should generate correct active glow shadow', () => {
      const shadow = getActiveGlowShadow();
      expect(shadow).toBe(`0 0 ${activeGlowConfig.blurRadius}px ${activeGlowConfig.color}`);
    });

    it('should use custom parameters', () => {
      const shadow = getActiveGlowShadow('red', 20);
      expect(shadow).toBe('0 0 20px red');
    });
  });

  describe('getConfigItemBackground', () => {
    it('should return empty object for light mode', () => {
      const result = getConfigItemBackground(false, false, false);
      expect(result).toEqual({});
    });

    it('should return background styles for dark mode', () => {
      const result = getConfigItemBackground(false, false, true);
      expect(result).toHaveProperty('backgroundColor');
      expect(result).toHaveProperty('backgroundImage');
      expect(result.backgroundColor).toBe(stylingDefaults[StylingKey.itemBackground]);
    });

    it('should use drag background when dragged', () => {
      const result = getConfigItemBackground(true, false, true);
      expect(result.backgroundColor).toBe(stylingDefaults[StylingKey.dragBackground]);
    });

    it('should include active overlay when active', () => {
      const result = getConfigItemBackground(false, true, true);
      expect(result.backgroundImage).toContain('linear-gradient');
      expect(result.backgroundImage).toContain(stylingDefaults[StylingKey.activeOverlay]);
    });
  });

  describe('getConfigItemBoxShadow', () => {
    it('should include frame shadow', () => {
      const frameShadow = 'test-frame-shadow';
      const result = getConfigItemBoxShadow(false, frameShadow);
      expect(result).toBe(frameShadow);
    });

    it('should include active glow when active', () => {
      const frameShadow = 'test-frame-shadow';
      const result = getConfigItemBoxShadow(true, frameShadow);
      expect(result).toContain(getActiveGlowShadow());
      expect(result).toContain(frameShadow);
    });
  });

  describe('getConfigItemTransition', () => {
    it('should return correct transition for inactive state', () => {
      const result = getConfigItemTransition(false);
      expect(result).toBe('box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out');
    });

    it('should return correct transition for active state', () => {
      const result = getConfigItemTransition(true);
      expect(result).toBe(`box-shadow ${activeGlowConfig.transitionDuration}s ease-in-out, border-color ${activeGlowConfig.transitionDuration}s ease-in-out`);
    });
  });

  describe('shadowConfig', () => {
    it('should have correct default values', () => {
      expect(shadowConfig.frameWidth).toBe(2);
      expect(shadowConfig.shadowBlurRadius).toBe(2);
    });
  });

  describe('activeGlowConfig', () => {
    it('should have correct default values', () => {
      expect(activeGlowConfig.blurRadius).toBe(12);
      expect(activeGlowConfig.color).toBe('rgba(6, 182, 212, 0.6)');
      expect(activeGlowConfig.transitionDuration).toBe(0.4);
    });
  });

  describe('computeNeomorphControlStyle', () => {
    it('should return a valid PANeomorphControlStyle object', () => {
      const result = computeNeomorphControlStyle(PASize.md, 'rect');
      expect(result).toHaveProperty('frame');
      expect(result).toHaveProperty('ring');
      expect(result).toHaveProperty('button');
      expect(result).toHaveProperty('palette');
      expect(result.palette).toHaveProperty('frameBackground');
      expect(result.palette).toHaveProperty('ringBackground');
      expect(result.palette).toHaveProperty('buttonBackground');
    });

    it('should calculate correct height for different sizes', () => {
      const resultXs = computeNeomorphControlStyle(PASize.xs, 'rect');
      const resultMd = computeNeomorphControlStyle(PASize.md, 'rect');
      const resultXl = computeNeomorphControlStyle(PASize.xl, 'rect');

      expect(resultXs.frame.height).toBe('28px');
      expect(resultMd.frame.height).toBe('40px');
      expect(resultXl.frame.height).toBe('50px');
    });

    it('should calculate correct borderRadius for rect shape', () => {
      const result = computeNeomorphControlStyle(PASize.md, 'rect');
      expect(result.frame.borderRadius).toBe('10px'); // 40 / 4 = 10
      expect(result.ring.borderRadius).toBe('10px');
      expect(result.button.borderRadius).toBe('9px'); // 10 - 1 = 9
    });

    it('should calculate correct borderRadius for pill shape', () => {
      const result = computeNeomorphControlStyle(PASize.md, 'pill');
      expect(result.frame.borderRadius).toBe('20px'); // 40 / 2 = 20
      expect(result.ring.borderRadius).toBe('20px');
      expect(result.button.borderRadius).toBe('19px'); // 20 - 1 = 19
    });

    it('should use default frameWidth, ringWidth, buttonBorderWidth', () => {
      const result = computeNeomorphControlStyle(PASize.md, 'rect');
      expect(result.frame.boxShadow).toContain('inset 2px 2px 4px');
      expect(result.frame.boxShadow).toContain('inset -2px -2px 4px');
      expect(result.button.boxShadow).toContain('-2px -2px 4px');
      expect(result.button.boxShadow).toContain('2px 2px 4px');
    });

    it('should use custom widths', () => {
      const result = computeNeomorphControlStyle(PASize.md, 'rect', undefined, undefined, 3, 2, 3);
      expect(result.frame.boxShadow).toContain('inset 3px 3px 4px');
      expect(result.frame.boxShadow).toContain('inset -3px -3px 4px');
      expect(result.button.boxShadow).toContain('-3px -3px 4px');
      expect(result.button.boxShadow).toContain('3px 3px 4px');
      expect(result.button.height).toBe('36px'); // 40 - 2*2 = 36
    });

    it('should use baseColor for palette calculation', () => {
      const result1 = computeNeomorphControlStyle(PASize.md, 'rect', '#ff0000');
      const result2 = computeNeomorphControlStyle(PASize.md, 'rect', '#0000ff');
      // Different baseColor should result in different palettes
      expect(result1.palette.frameBackground).not.toBe(result2.palette.frameBackground);
    });

    it('should use default baseColor when not provided', () => {
      const result = computeNeomorphControlStyle(PASize.md, 'rect');
      // Should have a valid palette
      expect(result.palette).toBeDefined();
      expect(result.palette.frameBackground).toBeDefined();
    });

    it('should use color for ring background', () => {
      const result = computeNeomorphControlStyle(PASize.md, 'rect', undefined, '#00ff00');
      expect(result.ring.backgroundColor).toBe('#00ff00');
    });

    it('should use palette.frameBackground for ring when color not provided', () => {
      const result = computeNeomorphControlStyle(PASize.md, 'rect');
      expect(result.ring.backgroundColor).toBe(result.palette.frameBackground);
    });

    it('should include fineNoise texture in frame and button', () => {
      const result = computeNeomorphControlStyle(PASize.md, 'rect');
      expect(result.frame.backgroundImage).toContain('svg');
      expect(result.button.backgroundImage).toContain('svg');
    });
  });
});
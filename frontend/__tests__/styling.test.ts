import { describe, it, expect } from 'vitest';
import {
  stylingDefaults,
  getFrameShadow,
  getActiveGlowShadow,
  getConfigItemBackground,
  getConfigItemBoxShadow,
  getConfigItemTransition,
  shadowConfig,
  activeGlowConfig
} from '../lib/utils/styling';
import { StylingKey } from '../../shared/enums';

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
});
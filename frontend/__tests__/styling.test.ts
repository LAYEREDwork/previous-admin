import { describe, it, expect } from 'vitest';
import {
  STYLING_DEFAULTS,
  getFrameShadow,
  getActiveGlowShadow,
  getConfigItemBackground,
  getConfigItemBoxShadow,
  getConfigItemTransition,
  SHADOW_CONFIG,
  ACTIVE_GLOW_CONFIG
} from '../lib/utils/styling';
import { StylingKey } from '../../shared/enums';

describe('Styling Utilities', () => {
  describe('STYLING_DEFAULTS', () => {
    it('should contain all required styling keys', () => {
      expect(STYLING_DEFAULTS).toHaveProperty(StylingKey.ITEM_BACKGROUND);
      expect(STYLING_DEFAULTS).toHaveProperty(StylingKey.DRAG_BACKGROUND);
      expect(STYLING_DEFAULTS).toHaveProperty(StylingKey.ACTIVE_OVERLAY);
      expect(STYLING_DEFAULTS).toHaveProperty(StylingKey.BUTTON_BASE_COLOR);
      expect(STYLING_DEFAULTS).toHaveProperty(StylingKey.FRAME_SHADOW_LIGHT);
      expect(STYLING_DEFAULTS).toHaveProperty(StylingKey.FRAME_SHADOW_DARK);
    });

    it('should have correct default values', () => {
      expect(STYLING_DEFAULTS[StylingKey.ITEM_BACKGROUND]).toBe('#1A1A1A');
      expect(STYLING_DEFAULTS[StylingKey.DRAG_BACKGROUND]).toBe('#181818');
      expect(STYLING_DEFAULTS[StylingKey.ACTIVE_OVERLAY]).toBe('rgba(6, 182, 212, 0.12)');
      expect(STYLING_DEFAULTS[StylingKey.BUTTON_BASE_COLOR]).toBe('#0d0d0d');
    });
  });

  describe('getFrameShadow', () => {
    it('should generate correct frame shadow with defaults', () => {
      const shadow = getFrameShadow();
      expect(shadow).toContain('inset');
      expect(shadow).toContain(STYLING_DEFAULTS[StylingKey.FRAME_SHADOW_LIGHT]);
      expect(shadow).toContain(STYLING_DEFAULTS[StylingKey.FRAME_SHADOW_DARK]);
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
      expect(shadow).toBe(`0 0 ${ACTIVE_GLOW_CONFIG.blurRadius}px ${ACTIVE_GLOW_CONFIG.color}`);
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
      expect(result.backgroundColor).toBe(STYLING_DEFAULTS[StylingKey.ITEM_BACKGROUND]);
    });

    it('should use drag background when dragged', () => {
      const result = getConfigItemBackground(true, false, true);
      expect(result.backgroundColor).toBe(STYLING_DEFAULTS[StylingKey.DRAG_BACKGROUND]);
    });

    it('should include active overlay when active', () => {
      const result = getConfigItemBackground(false, true, true);
      expect(result.backgroundImage).toContain('linear-gradient');
      expect(result.backgroundImage).toContain(STYLING_DEFAULTS[StylingKey.ACTIVE_OVERLAY]);
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
      expect(result).toBe(`box-shadow ${ACTIVE_GLOW_CONFIG.transitionDuration}s ease-in-out, border-color ${ACTIVE_GLOW_CONFIG.transitionDuration}s ease-in-out`);
    });
  });

  describe('SHADOW_CONFIG', () => {
    it('should have correct default values', () => {
      expect(SHADOW_CONFIG.frameWidth).toBe(2);
      expect(SHADOW_CONFIG.shadowBlurRadius).toBe(2);
    });
  });

  describe('ACTIVE_GLOW_CONFIG', () => {
    it('should have correct default values', () => {
      expect(ACTIVE_GLOW_CONFIG.blurRadius).toBe(12);
      expect(ACTIVE_GLOW_CONFIG.color).toBe('rgba(6, 182, 212, 0.6)');
      expect(ACTIVE_GLOW_CONFIG.transitionDuration).toBe(0.4);
    });
  });
});
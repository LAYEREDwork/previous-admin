import { ReactNode, useMemo } from 'react';
import { NOISE_TEXTURE } from '../../lib/utils/color';

export enum PACardRelief {
  EMBOSSED = 'embossed',
  RECESSED = 'recessed',
}

interface PACardProps {
  children?: ReactNode;
  className?: string;
  backgroundColor?: string;
  relief?: PACardRelief;
}

const FRAME_WIDTH = 2;
const SHADOW_BLUR_RADIUS = 2;
const SHADOW_LIGHT = 'rgba(55, 55, 55, 1)';
const SHADOW_DARK = '#000';
const FLOAT_SHADOW_EMBOSSED = '0 10px 20px rgba(0, 0, 0, 0.32)';

/**
 * PACard - panel-like container with skeuomorphic relief and optional noise texture.
 */
export function PACard({
  children,
  className = '',
  backgroundColor = '#1a1a1a',
  relief = PACardRelief.EMBOSSED,
}: PACardProps) {
  const insetShadow = useMemo(() => {
    const isEmbossed = relief === PACardRelief.EMBOSSED;
    // Embossed: light on bottom-right, dark on top-left (inverted vs recessed)
    const light = isEmbossed ? SHADOW_DARK : SHADOW_LIGHT;
    const dark = isEmbossed ? SHADOW_LIGHT : SHADOW_DARK;
    return `inset -${FRAME_WIDTH}px -${FRAME_WIDTH}px ${SHADOW_BLUR_RADIUS}px ${light}, inset ${FRAME_WIDTH}px ${FRAME_WIDTH}px ${SHADOW_BLUR_RADIUS}px ${dark}`;
  }, [relief]);

  const floatShadow = relief === PACardRelief.EMBOSSED ? FLOAT_SHADOW_EMBOSSED : '';

  return (
    <div
      className={`rounded-lg border border-next-border ${className}`}
      style={{
        backgroundColor,
        backgroundImage: NOISE_TEXTURE,
        backgroundBlendMode: 'soft-light',
        backgroundRepeat: 'repeat',
        boxShadow: `${floatShadow}${floatShadow ? ', ' : ''}${insetShadow}`,
      }}
    >
      {children}
    </div>
  );
}

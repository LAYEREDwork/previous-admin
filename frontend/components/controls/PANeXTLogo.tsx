interface PANeXTLogoProps {
  size?: number;
  className?: string;
  shadow?: boolean;
}

export function PANeXTLogo({ size = 40, className = '', shadow = false }: PANeXTLogoProps) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <img
        src="/next-logo.png"
        alt="NeXT Logo"
        className={`w-full h-full object-contain ${shadow ? 'drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]' : ''}`}
      />
    </div>
  );
}

export function NeXTLogo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={className} style={{ width: size, height: size }}>
      <img
        src="/next-logo.png"
        alt="NeXT Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
}

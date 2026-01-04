import { SFLinkIcloud } from "@frontend/components/sf-symbols";

export interface PAResourceLinkProps {
  href: string;
  label: string;
  domain: string;
}

/**
 * Wiederverwendbare Komponente für Resource-Links mit Hover-Effekt.
 * Unterstützt automatische Theme-Anpassung (light/dark).
 */
export function PAResourceLink({ href, label, domain }: PAResourceLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 rounded-lg transition-colors group bg-[var(--rs-bg-card)] hover:bg-[var(--rs-bg-overlay)] border border-[var(--rs-border-primary)]"
      style={{ textDecoration: 'none' }}
    >
      <span className="flex items-center gap-3 text-[var(--rs-text-primary)]">
        <img
          src={`https://www.google.com/s2/favicons?sz=32&domain=${domain}`}
          alt=""
          className="w-7 h-7 rounded-full"
        />
        {label}
      </span>
      <SFLinkIcloud
        size={22}
        className="text-[var(--rs-text-secondary)] group-hover:text-[var(--rs-primary-500)]"
      />
    </a>
  );
}

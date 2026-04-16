"use client";

import { AuthControls } from "./AuthControls";
import { navLinks } from "./nav-links";

interface MobileMenuProps {
  open: boolean;
  isLoaded: boolean;
  isSignedIn: boolean | undefined;
  onNavigate: (id: string) => void;
  onMyPage: () => void;
  onClose: () => void;
}

export function MobileMenu({
  open,
  isLoaded,
  isSignedIn,
  onNavigate,
  onMyPage,
  onClose,
}: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="flex flex-col gap-5 bg-[#051F25] px-6 pb-6 font-medium text-slate-300 md:hidden">
      {navLinks.map((link) => (
        <button
          key={link.id}
          className="border-b border-white/5 py-2 text-left"
          onClick={() => {
            onNavigate(link.id);
            onClose();
          }}
        >
          {link.label}
        </button>
      ))}
      <div className="flex flex-col gap-3 pt-2">
        <AuthControls isLoaded={isLoaded} isSignedIn={isSignedIn} mobile onMyPage={() => { onMyPage(); onClose(); }} />
      </div>
    </div>
  );
}

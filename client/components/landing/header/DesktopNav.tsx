interface DesktopNavProps {
  onNavigate: (id: string) => void;
}

export function DesktopNav({ onNavigate }: DesktopNavProps) {
  return (
    <nav className="hidden gap-8 text-sm font-medium text-slate-400 md:flex">
      <button onClick={() => onNavigate("home")} className="hover:text-sky-400">Home</button>
      <button onClick={() => onNavigate("how-it-works")} className="hover:text-sky-400">How it works</button>
      <button onClick={() => onNavigate("mentors")} className="hover:text-sky-400">Mentors</button>
      <button onClick={() => onNavigate("membership")} className="hover:text-sky-400">Membership</button>
    </nav>
  );
}

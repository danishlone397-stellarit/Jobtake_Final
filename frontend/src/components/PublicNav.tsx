import { getCurrentUser } from "@/lib/auth";
import { Logo } from "./Logo";
import Link from "next/link";
import { NavActions } from "./NavActions";

export async function PublicNav() {
  const user = await getCurrentUser();
  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav
        className="glass pointer-events-auto rounded-full pl-4 pr-2 py-2 flex items-center gap-6 max-w-[1100px] w-full"
        data-testid="primary-nav"
      >
        <Logo size={28} />
        <ul className="hidden md:flex items-center gap-1 text-sm text-zinc-700 ml-2">
          <li><Link href="/jobs" className="px-3 py-1.5 rounded-full hover:bg-white/70 transition-colors">Jobs</Link></li>
          <li><Link href="/companies" className="px-3 py-1.5 rounded-full hover:bg-white/70 transition-colors">Companies</Link></li>
          <li><Link href="/employers" className="px-3 py-1.5 rounded-full hover:bg-white/70 transition-colors">For Employers</Link></li>
          <li><Link href="/ai-match" className="px-3 py-1.5 rounded-full hover:bg-white/70 transition-colors">AI Match</Link></li>
        </ul>
        <NavActions
          user={user ? { id: user.id, name: user.name, role: user.role, avatarUrl: user.avatarUrl } : null}
        />
      </nav>
    </header>
  );
}

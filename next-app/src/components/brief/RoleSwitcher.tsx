import Link from 'next/link';
import type { Role } from '@/lib/tat/types';
import { DEFAULT_ROLE, ROLES, ROLE_META } from '@/lib/tat/labels';

export function briefHref(role: Role) {
  return role === DEFAULT_ROLE ? '/brief' : `/brief?role=${role}`;
}

export default function RoleSwitcher({ active }: { active: Role }) {
  return (
    <nav aria-label="Choose your edition" className="w-full">
      <ul className="grid grid-cols-3 gap-1 rounded-xl border border-line bg-panel p-1">
        {ROLES.map((role) => {
          const isActive = role === active;
          return (
            <li key={role} className="list-none">
              <Link
                href={briefHref(role)}
                aria-current={isActive ? 'page' : undefined}
                scroll={false}
                className={`flex min-h-11 items-center justify-center rounded-lg px-2 py-2 text-center text-sm font-semibold transition-colors ${
                  isActive ? 'bg-signal text-ink' : 'text-subtle hover:bg-white/5 hover:text-fg'
                }`}
              >
                {ROLE_META[role].short}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

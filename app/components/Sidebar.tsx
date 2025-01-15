'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: '🏠', label: 'Introduction', path: '/' },
  { icon: '👥', label: 'Tenant Management', path: '/tenant' },
  { icon: '🏢', label: 'Brand Management', path: '/brand' },
  { icon: '🧭', label: 'Brand Compass', path: '/brand-compass' },
  { icon: '📄', label: 'Source Management', path: '/source' },
  { icon: '💭', label: 'Prompt Management', path: '/prompt' },
  { icon: '⚙️', label: 'Worker Management', path: '/worker' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-4">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-2 ${
            pathname === item.path ? 'bg-purple-600' : 'hover:bg-gray-800'
          }`}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
} 
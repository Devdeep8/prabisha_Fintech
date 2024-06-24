// components/Header.tsx
import Link from 'next/link';
import { ModeToggle } from './modeToggle';
export default function Header() {
  return (
    <header className="flex items-center sticky top-0 dark:bg-black dark:text-white bg-white z-50 justify-between px-8 py-4 border-b">
      <div className="flex items-start space-x-4">
        <img src="/images/bark-logo.png" alt="PRABP Logo" className="h-10" />
        <nav className="flex items-center space-x-4">
          <Link className="text-lg font-lg text-gray-800" href="/explore">
           Explore
          </Link>
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <ModeToggle/>
        <Link className="text-lg font-medium text-gray-800" href="/login">
          Login
        </Link>
        <Link className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" href="/signup">
          Join as a Professional
        </Link>
      </div>
    </header>
  );
}

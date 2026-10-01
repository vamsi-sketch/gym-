import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dumbbell, Menu, X, ShieldAlert, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { HomepageContent } from '../../types';

interface NavbarProps {
  homepage?: HomepageContent | null;
}

export const Navbar: React.FC<NavbarProps> = ({ homepage }) => {
  const { user, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const gymName = homepage?.gymName || 'FITZONE FITNESS';

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Programs', href: '/programs' },
    { name: 'Trainers', href: '/trainers' },
    { name: 'Memberships', href: '/memberships' },
    { name: 'About', href: '/about' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f17]/95 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Single Wordmark Brand Zone */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center text-neutral-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Dumbbell className="w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white uppercase font-display">
            {gymName}
          </span>
        </Link>

        {/* Zone 2: Navigation Links (Clean unboxed text links) */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`transition-colors whitespace-nowrap ${
                isActive(link.href)
                  ? 'text-amber-400 font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Zone 3: Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-lg hover:bg-amber-400/20 transition-colors whitespace-nowrap"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Owner CMS
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-neutral-200 bg-neutral-800/80 border border-neutral-700 rounded-lg hover:bg-neutral-700 transition-colors whitespace-nowrap"
              >
                <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={logout}
                className="px-3 py-2 text-xs text-neutral-400 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/memberships"
                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 rounded-lg hover:bg-amber-400 shadow-md shadow-amber-500/15 transition-colors whitespace-nowrap"
              >
                Join Fitzone
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center gap-2">
          {isAdmin && (
            <Link
              to="/admin"
              className="px-2.5 py-1.5 text-xs font-semibold text-amber-400 bg-amber-400/10 rounded-md"
            >
              CMS
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-neutral-400 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0e1420] border-b border-neutral-800 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-neutral-800">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive(link.href)
                    ? 'bg-neutral-800 text-amber-400 font-semibold'
                    : 'text-neutral-300 hover:bg-neutral-800/50 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-medium bg-neutral-800 text-white rounded-lg"
                >
                  Member Dashboard ({user.name})
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 px-4 text-sm font-semibold bg-amber-500/10 text-amber-400 border border-amber-400/30 rounded-lg"
                  >
                    Owner Admin CMS
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-sm text-neutral-400 hover:text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-medium bg-neutral-800 text-white rounded-lg"
                >
                  Sign In / Demo Login
                </Link>
                <Link
                  to="/memberships"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 px-4 text-sm font-semibold bg-amber-500 text-neutral-950 rounded-lg"
                >
                  Join Fitzone
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

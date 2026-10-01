import React from 'react';
import { Link } from 'react-router-dom';
import { Dumbbell, MapPin, Phone, Mail, Clock, Instagram, Facebook, Youtube } from 'lucide-react';
import { ContactInfo, GymTimings, HomepageContent } from '../../types';

interface FooterProps {
  homepage?: HomepageContent | null;
  contact?: ContactInfo | null;
  timings?: GymTimings | null;
}

export const Footer: React.FC<FooterProps> = ({ homepage, contact, timings }) => {
  const gymName = homepage?.gymName || 'FITZONE FITNESS';
  const tagline = homepage?.tagline || 'Forged in Iron, Built for Life';

  return (
    <footer className="bg-[#070a0f] border-t border-neutral-800 text-neutral-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-neutral-950 font-black">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white font-display uppercase">
                {gymName}
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {tagline}. Premium high-performance club dedicated to strength, endurance, and lifelong physical transformation.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {contact?.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {contact?.facebook && (
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {contact?.youtube && (
                <a
                  href={contact.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 font-display uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/programs" className="hover:text-amber-400 transition-colors">
                  Programs & Training Splits
                </Link>
              </li>
              <li>
                <Link to="/trainers" className="hover:text-amber-400 transition-colors">
                  Certified Master Trainers
                </Link>
              </li>
              <li>
                <Link to="/memberships" className="hover:text-amber-400 transition-colors">
                  Membership Plans & Pricing
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-amber-400 transition-colors">
                  Gym Facility & Video Tour
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  Why Choose Fitzone
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Operating Hours */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 font-display uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-500" />
              Gym Hours
            </h3>
            {timings ? (
              <ul className="space-y-1.5 text-xs">
                {Object.entries(timings).map(([day, val]) => (
                  <li key={day} className="flex justify-between items-center text-neutral-400 py-0.5 border-b border-neutral-800/40">
                    <span className="font-medium text-neutral-300">{day}</span>
                    <span>
                      {val.isClosed ? (
                        <span className="text-rose-400 font-semibold">Closed</span>
                      ) : (
                        `${val.open} - ${val.close}`
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-neutral-400">
                Mon - Fri: 5:30 AM - 11:00 PM<br />
                Sat - Sun: 6:00 AM - 8:00 PM
              </p>
            )}
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 font-display uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              Visit Us
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="leading-relaxed">
                {contact?.address || '42 Silicon Boulevard, Koramangala 4th Block, Bengaluru, Karnataka 560034'}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <a href={`tel:${contact?.phone || '+919876543210'}`} className="hover:text-white transition-colors">
                  {contact?.phone || '+91 98765 43210'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <a href={`mailto:${contact?.email || 'contact@fitzone.com'}`} className="hover:text-white transition-colors">
                  {contact?.email || 'contact@fitzone.com'}
                </a>
              </li>
            </ul>
            {contact?.googleMapsUrl && (
              <a
                href={contact.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-xs font-semibold text-amber-400 hover:text-amber-300 hover:underline"
              >
                Open in Google Maps &rarr;
              </a>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} {gymName}. All rights reserved. Dynamic CMS Driven.</p>
          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-neutral-400">Owner CMS Access</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-neutral-400">Terms & Policies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

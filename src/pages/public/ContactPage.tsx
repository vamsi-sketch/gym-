import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, Instagram, Facebook, Youtube } from 'lucide-react';
import { ContactInfo, GymTimings } from '../../types';
import { apiService } from '../../services/api';

export const ContactPage: React.FC = () => {
  const [contact, setContact] = useState<ContactInfo | null>(null);
  const [timings, setTimings] = useState<GymTimings | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    Promise.all([apiService.getContact(), apiService.getTimings()]).then(([c, t]) => {
      setContact(c);
      setTimings(t);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    try {
      await apiService.createBooking({
        userName: name,
        userEmail: email,
        userPhone: phone,
        bookingType: 'Free Trial',
        notes: message,
        date: new Date().toISOString().split('T')[0],
        time: 'Inquiry',
      });
      setIsSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
          GET IN TOUCH
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-white font-display uppercase tracking-tight">
          Visit or Contact Us
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-light">
          Have questions about memberships, private trainer coaching, or club access? Reach out to our front desk team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-6">
          <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white font-display">Fitzone Headquarters</h2>

            <div className="space-y-4 text-xs sm:text-sm text-neutral-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Physical Location</p>
                  <p className="text-neutral-400 mt-0.5 leading-relaxed">
                    {contact?.address || '42 Silicon Boulevard, Koramangala 4th Block, Bengaluru, Karnataka 560034'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Direct Telephone & WhatsApp</p>
                  <p className="text-neutral-400 mt-0.5 font-mono">{contact?.phone || '+91 98765 43210'}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white">Email Inquiries</p>
                  <p className="text-neutral-400 mt-0.5">{contact?.email || 'contact@fitzone.com'}</p>
                </div>
              </div>
            </div>

            {/* Social media links */}
            <div className="pt-4 border-t border-neutral-800 flex items-center gap-3">
              {contact?.instagram && (
                <a
                  href={contact.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Instagram className="w-3.5 h-3.5" /> Instagram
                </a>
              )}
              {contact?.facebook && (
                <a
                  href={contact.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Facebook className="w-3.5 h-3.5" /> Facebook
                </a>
              )}
              {contact?.youtube && (
                <a
                  href={contact.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
                >
                  <Youtube className="w-3.5 h-3.5" /> YouTube
                </a>
              )}
            </div>
          </div>

          {/* Operating hours card */}
          {timings && (
            <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider">
                  Weekly Operating Timings
                </h3>
              </div>

              <div className="divide-y divide-neutral-800/80 text-xs">
                {Object.entries(timings).map(([day, val]) => (
                  <div key={day} className="py-2 flex justify-between items-center text-neutral-300">
                    <span className="font-medium text-white">{day}</span>
                    <span>
                      {val.isClosed ? (
                        <span className="text-rose-400 font-bold">Closed</span>
                      ) : (
                        `${val.open} — ${val.close}`
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message / Inquiry Form */}
        <div className="bg-[#101622] border border-neutral-800 rounded-2xl p-8 space-y-6 shadow-xl">
          <div>
            <h2 className="text-xl font-bold text-white font-display">Send a Direct Message</h2>
            <p className="text-xs text-neutral-400 mt-1">
              Leave your inquiry and our club manager will follow up via WhatsApp or email.
            </p>
          </div>

          {isSubmitted ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white font-display">Inquiry Received!</h3>
              <p className="text-xs text-neutral-400">
                Thank you for contacting Fitzone Fitness. We will get in touch with you shortly.
              </p>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="mt-2 text-xs text-amber-400 hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Siddharth Rao"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="siddharth@example.com"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-medium">Message / Inquiry Details</label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about your fitness background, desired start date, or specific goals..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/15 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSending ? 'Sending Inquiry...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, Loader2, Dumbbell } from 'lucide-react';
import { apiService } from '../../services/api';
import { Trainer, Program } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainers?: Trainer[];
  programs?: Program[];
  initialType?: 'Free Trial' | 'Personal Trainer' | 'Workout Program' | 'Class';
  initialTrainerId?: string;
  initialProgramId?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  trainers = [],
  programs = [],
  initialType = 'Free Trial',
  initialTrainerId = '',
  initialProgramId = '',
}) => {
  const { user } = useAuth();
  const [bookingType, setBookingType] = useState<'Free Trial' | 'Personal Trainer' | 'Workout Program' | 'Class'>(initialType);
  const [trainerId, setTrainerId] = useState(initialTrainerId);
  const [programId, setProgramId] = useState(initialProgramId);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('07:00 AM');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const selectedTrainer = trainers.find((t) => t.id === trainerId);
      const selectedProg = programs.find((p) => p.id === programId);

      await apiService.createBooking({
        userId: user?.id || 'guest',
        userName: name,
        userEmail: email,
        userPhone: phone,
        bookingType,
        trainerId: selectedTrainer?.id,
        trainerName: selectedTrainer?.name,
        programId: selectedProg?.id,
        programName: selectedProg?.name,
        date,
        time,
        notes,
      });

      setIsSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Failed to submit booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111622] border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="bg-[#0b0e17] px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-neutral-950 font-black">
              <Dumbbell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">Schedule a Session</h3>
              <p className="text-xs text-neutral-400">Lock in your slot with Fitzone coaches</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white font-display">Booking Request Submitted!</h4>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
              We received your session request for <span className="text-amber-400 font-semibold">{date}</span> at <span className="text-white font-semibold">{time}</span>. Our desk will confirm your pass shortly via WhatsApp/SMS.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="py-2.5 px-6 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Booking Type */}
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Booking Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Free Trial', 'Personal Trainer', 'Workout Program', 'Class'] as const).map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setBookingType(type)}
                    className={`py-2 px-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                      bookingType === type
                        ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                        : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* If Personal Trainer */}
            {bookingType === 'Personal Trainer' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Select Coach</label>
                <select
                  value={trainerId}
                  onChange={(e) => setTrainerId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">Any Available Senior Coach</option>
                  {trainers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.specialization})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* If Workout Program */}
            {bookingType === 'Workout Program' && (
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Select Program</label>
                <select
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="">Select a Program</option>
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.difficulty})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-neutral-400 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" /> Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-400 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Preferred Slot
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option>06:00 AM</option>
                  <option>07:00 AM</option>
                  <option>08:30 AM</option>
                  <option>10:00 AM</option>
                  <option>05:00 PM</option>
                  <option>06:30 PM</option>
                  <option>08:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-neutral-400 mb-1">Notes / Fitness Goals (Optional)</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. recovering from shoulder strain, goal is fat loss"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {errorMessage && <p className="text-xs text-rose-400">{errorMessage}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/15 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Booking Appointment...
                </>
              ) : (
                'Confirm Booking'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

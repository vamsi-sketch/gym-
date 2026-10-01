import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User as UserIcon,
  Calendar,
  CreditCard,
  Bell,
  Dumbbell,
  CheckCircle2,
  Clock,
  LogOut,
  AlertCircle,
  XCircle,
  Plus,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Booking, NotificationItem, Program } from '../../types';
import { apiService } from '../../services/api';
import { BookingModal } from '../../components/common/BookingModal';

export const UserDashboard: React.FC = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'membership' | 'bookings' | 'workout' | 'profile' | 'notifications'>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Profile form state
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadUserData = async () => {
      try {
        setLoading(true);
        const [bRes, nRes, pRes] = await Promise.all([
          apiService.getBookings(),
          apiService.getNotifications(),
          apiService.getPrograms(),
        ]);
        setBookings(bRes);
        setNotifications(nRes);
        setPrograms(pRes);
      } catch (err) {
        console.error('Failed to load user dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, navigate]);

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await apiService.updateBooking(id, { status: 'Cancelled' });
      const bRes = await apiService.getBookings();
      setBookings(bRes);
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.updateProfile({ name: editName, phone: editPhone });
      await refreshUser();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const upcomingBookings = bookings.filter((b) => b.status === 'Approved' || b.status === 'Pending');
  const pastBookings = bookings.filter((b) => b.status === 'Completed' || b.status === 'Cancelled' || b.status === 'Rejected');

  const assignedProgObj = programs.find(
    (p) => p.name.toLowerCase() === (user?.assignedProgram || '').toLowerCase()
  ) || programs[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="bg-[#101522] border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-2xl font-display">
            {user?.name?.charAt(0) || 'M'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white font-display">{user?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Active Member
              </span>
            </div>
            <p className="text-xs text-neutral-400">{user?.email} · Member since {user?.createdAt || '2026'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBookingOpen(true)}
            className="py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/15 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Book Session
          </button>
          <button
            onClick={logout}
            className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Viewport */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="space-y-1.5 bg-[#101522] border border-neutral-800 rounded-2xl p-3 h-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4" /> Overview
          </button>

          <button
            onClick={() => setActiveTab('membership')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'membership'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Membership Plan
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" /> My Bookings
          </button>

          <button
            onClick={() => setActiveTab('workout')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'workout'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4" /> Assigned Workout
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'notifications'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" /> Notifications
            {notifications.filter((n) => !n.read).length > 0 && (
              <span className="ml-auto w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
            }`}
          >
            <UserIcon className="w-4 h-4" /> Profile & Settings
          </button>
        </div>

        {/* Viewport Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Membership Card */}
              <div className="bg-gradient-to-br from-[#172033] to-[#0f1422] border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                      CURRENT TIER
                    </span>
                    <h3 className="text-2xl font-black text-white font-display">
                      {user?.membership?.planName || 'Quarterly Accelerator Tier'}
                    </h3>
                    <p className="text-xs text-neutral-300">
                      Access valid until: <span className="font-semibold text-white">{user?.membership?.expiryDate || '2026-12-01'}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold">
                      {user?.membership?.status?.toUpperCase() || 'ACTIVE'}
                    </span>
                    <p className="text-xs text-neutral-400 mt-2">
                      Rate: <span className="font-mono text-white">₹{user?.membership?.price || 3199}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Next Booking Highlight */}
              <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    Next Scheduled Session
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    All Bookings ({bookings.length})
                  </button>
                </div>

                {upcomingBookings.length > 0 ? (
                  <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">{upcomingBookings[0].bookingType}</p>
                      <p className="text-xs text-neutral-400">
                        Coach: <span className="text-neutral-200">{upcomingBookings[0].trainerName || 'Assigned Specialist'}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs">
                        <p className="font-semibold text-white">{upcomingBookings[0].date}</p>
                        <p className="text-amber-400">{upcomingBookings[0].time}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-400/30 rounded-lg text-xs font-semibold">
                        {upcomingBookings[0].status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-neutral-400 italic">
                    No upcoming sessions scheduled. Click "Book Session" above to reserve your slot.
                  </p>
                )}
              </div>

              {/* Recent Notifications */}
              <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-white font-display uppercase tracking-wider flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" />
                  Recent Gym Alerts
                </h3>
                <div className="space-y-2">
                  {notifications.slice(0, 3).map((notif) => (
                    <div key={notif.id} className="p-3 bg-neutral-900/60 rounded-xl border border-neutral-800/80 text-xs space-y-0.5">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-white">{notif.title}</p>
                        <span className="text-[11px] text-neutral-500">{notif.date}</span>
                      </div>
                      <p className="text-neutral-400">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEMBERSHIP */}
          {activeTab === 'membership' && (
            <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white font-display">Membership Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                  <p className="text-[11px] text-neutral-400 uppercase font-semibold">Current Plan</p>
                  <p className="text-lg font-bold text-white mt-1">{user?.membership?.planName || 'Quarterly Accelerator'}</p>
                </div>
                <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                  <p className="text-[11px] text-neutral-400 uppercase font-semibold">Price Paid</p>
                  <p className="text-lg font-bold text-amber-400 font-mono mt-1">₹{user?.membership?.price || 3199}</p>
                </div>
                <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-800">
                  <p className="text-[11px] text-neutral-400 uppercase font-semibold">Expires On</p>
                  <p className="text-lg font-bold text-white mt-1">{user?.membership?.expiryDate || '2026-12-01'}</p>
                </div>
              </div>

              <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 space-y-2 text-xs">
                <p className="font-semibold text-white">Active Privileges with this tier:</p>
                <ul className="space-y-1.5 text-neutral-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    Full gym floor & recovery zone access during all operating hours
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    Bi-weekly InBody body-composition diagnostic scans
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                    10% discount at the Fitzone Fuel & Protein bar
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <Link
                  to="/memberships"
                  className="inline-block py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Upgrade or Extend Membership &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* TAB 3: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-white font-display">Upcoming Appointments</h2>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold rounded-lg"
                  >
                    + Schedule New
                  </button>
                </div>

                {upcomingBookings.length === 0 ? (
                  <p className="text-xs text-neutral-400 py-4">No upcoming bookings found.</p>
                ) : (
                  <div className="space-y-3">
                    {upcomingBookings.map((b) => (
                      <div key={b.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1">
                          <p className="font-bold text-white text-sm">{b.bookingType}</p>
                          <p className="text-neutral-400">
                            Trainer: <span className="text-neutral-200">{b.trainerName || 'Assigned Staff'}</span> · Date: <span className="text-neutral-200">{b.date}</span> at <span className="text-amber-400">{b.time}</span>
                          </p>
                          {b.notes && <p className="text-neutral-400 italic">Notes: {b.notes}</p>}
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                              b.status === 'Approved'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {b.status}
                          </span>
                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {pastBookings.length > 0 && (
                <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
                  <h3 className="text-base font-bold text-white font-display">Past Appointments</h3>
                  <div className="space-y-2 text-xs">
                    {pastBookings.map((b) => (
                      <div key={b.id} className="p-3 bg-neutral-900/40 border border-neutral-800/80 rounded-xl flex justify-between items-center text-neutral-400">
                        <div>
                          <p className="font-medium text-neutral-300">{b.bookingType} · {b.date}</p>
                          <p className="text-[11px]">Trainer: {b.trainerName || 'Gym Staff'}</p>
                        </div>
                        <span className="text-[11px] font-semibold text-neutral-400">{b.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: WORKOUT */}
          {activeTab === 'workout' && (
            <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest font-mono">
                  ACTIVE TRAINING PROTOCOL
                </span>
                <h2 className="text-2xl font-black text-white font-display">
                  {user?.assignedProgram || 'Hypertrophy & Muscle Building'}
                </h2>
                <p className="text-xs text-neutral-400">
                  Sequenced by Fitzone Head Coaches · Duration: {assignedProgObj?.duration || '12 Weeks'}
                </p>
              </div>

              <div className="space-y-4 pt-2 text-xs">
                <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
                  <h4 className="font-bold text-white text-sm">Program Overview</h4>
                  <p className="text-neutral-300 leading-relaxed font-light">{assignedProgObj?.description}</p>
                </div>

                <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-3">
                  <h4 className="font-bold text-white text-sm">Key Directives & Benefits</h4>
                  <ul className="space-y-2 text-neutral-300">
                    {assignedProgObj?.benefits?.map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-neutral-900 rounded-xl border border-neutral-800 space-y-2">
                  <h4 className="font-bold text-white text-sm">Today’s Focus: Heavy Lower Body</h4>
                  <div className="divide-y divide-neutral-800 text-neutral-300">
                    <div className="py-1.5 flex justify-between">
                      <span>Barbell Back Squat</span>
                      <span className="font-mono text-amber-400">4 sets × 6 reps (RPE 8)</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span>Romanian Deadlift</span>
                      <span className="font-mono text-amber-400">3 sets × 8 reps</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span>Bulgarian Split Squats</span>
                      <span className="font-mono text-amber-400">3 sets × 10 reps / leg</span>
                    </div>
                    <div className="py-1.5 flex justify-between">
                      <span>Standing Calf Raises</span>
                      <span className="font-mono text-amber-400">4 sets × 12 reps</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold text-white font-display">Notifications & Updates</h2>
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-white text-sm">{notif.title}</p>
                      <span className="text-[11px] text-neutral-500">{notif.date}</span>
                    </div>
                    <p className="text-neutral-300 leading-relaxed">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold text-white font-display">Profile & Contact Preferences</h2>

              {profileSaved && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Email Address (Read-only)</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email}
                    className="w-full bg-neutral-900/50 border border-neutral-800/60 rounded-xl px-3 py-2.5 text-neutral-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="py-2.5 px-6 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md shadow-amber-500/15"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        programs={programs}
      />
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CreditCard,
  Award,
  BookOpen,
  Image as ImageIcon,
  Video,
  MessageSquare,
  Tag,
  Home,
  Clock,
  PhoneCall,
  Bell,
  Settings,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  HomepageContent,
  MembershipPlan,
  Trainer,
  Program,
  GalleryItem,
  VideoItem,
  Testimonial,
  Offer,
  GymTimings,
  ContactInfo,
  User,
  Booking,
} from '../../types';
import { apiService } from '../../services/api';
import { ImageUploader } from '../../components/common/ImageUploader';

export const AdminDashboard: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'members'
    | 'bookings'
    | 'plans'
    | 'trainers'
    | 'programs'
    | 'gallery'
    | 'videos'
    | 'testimonials'
    | 'offers'
    | 'homepage'
    | 'timings'
    | 'contact'
    | 'notifications'
    | 'settings'
  >('overview');

  // Data States
  const [stats, setStats] = useState<any>(null);
  const [members, setMembers] = useState<User[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [homepage, setHomepage] = useState<HomepageContent | null>(null);
  const [timings, setTimings] = useState<GymTimings | null>(null);
  const [contact, setContact] = useState<ContactInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Search/Filter states
  const [memberSearch, setMemberSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState('All');

  // Generic Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [modalType, setModalType] = useState<string>('');
  const [modalItem, setModalItem] = useState<any>({});

  // Ensure only authenticated admin accesses
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!isAdmin) {
      alert('Access denied: Admin privileges required.');
      navigate('/dashboard');
    }
  }, [user, isAdmin, navigate]);

  // Load All Admin Data
  const loadData = async () => {
    try {
      setLoading(true);
      const [
        statsData,
        membersData,
        bookingsData,
        plansData,
        trainersData,
        programsData,
        galleryData,
        videosData,
        testimonialsData,
        offersData,
        homepageData,
        timingsData,
        contactData,
      ] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getMembers(),
        apiService.getBookings(),
        apiService.getMemberships(true),
        apiService.getTrainers(true),
        apiService.getPrograms(true),
        apiService.getGallery(true),
        apiService.getVideos(true),
        apiService.getTestimonials(true),
        apiService.getOffers(true),
        apiService.getHomepage(),
        apiService.getTimings(),
        apiService.getContact(),
      ]);

      setStats(statsData);
      setMembers(membersData);
      setBookings(bookingsData);
      setPlans(plansData);
      setTrainers(trainersData);
      setPrograms(programsData);
      setGallery(galleryData);
      setVideos(videosData);
      setTestimonials(testimonialsData);
      setOffers(offersData);
      setHomepage(homepageData);
      setTimings(timingsData);
      setContact(contactData);
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showSuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // --- Handlers for Specific CMS Sections ---

  // 1. Homepage CMS Update
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homepage) return;
    try {
      await apiService.updateHomepage(homepage);
      showSuccess('Homepage content updated! Public site immediately shows changes.');
      await loadData();
    } catch (err) {
      alert('Failed to update homepage content');
    }
  };

  // 2. Gym Timings Update
  const handleSaveTimings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!timings) return;
    try {
      await apiService.updateTimings(timings);
      showSuccess('Gym timings updated successfully!');
      await loadData();
    } catch (err) {
      alert('Failed to update timings');
    }
  };

  // 3. Contact Info Update
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact) return;
    try {
      await apiService.updateContact(contact);
      showSuccess('Contact details updated successfully!');
      await loadData();
    } catch (err) {
      alert('Failed to update contact info');
    }
  };

  // 4. Modal Open Helpers
  const openAddModal = (type: string) => {
    setModalType(type);
    if (type === 'plan') {
      setModalItem({
        name: '',
        price: 1499,
        duration: '1 Month',
        description: '',
        benefits: 'Full gym access\nLocker access\nTrainer baseline assessment',
        isPopular: false,
        status: 'active',
      });
    } else if (type === 'trainer') {
      setModalItem({
        name: '',
        profileImage: '/src/assets/images/trainer_male_strength_1790868406593.jpg',
        specialization: '',
        experience: '5+ Years Experience',
        phone: '',
        email: '',
        bio: '',
        status: 'active',
      });
    } else if (type === 'program') {
      setModalItem({
        name: '',
        description: '',
        image: '/src/assets/images/hero_gym_workout_1790868392603.jpg',
        duration: '8 Weeks',
        difficulty: 'Intermediate',
        benefits: 'Custom workout split\nNutrition guidance\nProgress tracking',
        status: 'active',
      });
    } else if (type === 'gallery') {
      setModalItem({
        title: '',
        imageUrl: '/src/assets/images/gym_interior_floor_1790868429405.jpg',
        category: 'Gym',
        description: '',
        status: 'active',
      });
    } else if (type === 'video') {
      setModalItem({
        title: '',
        videoUrl: 'https://www.youtube.com/watch?v=eaRQF-7hhmo',
        thumbnail: '/src/assets/images/hero_gym_workout_1790868392603.jpg',
        category: 'Facility Tour',
        description: '',
        status: 'active',
      });
    } else if (type === 'offer') {
      setModalItem({
        title: '',
        description: '',
        discount: '25% OFF',
        bannerImage: '/src/assets/images/hero_gym_workout_1790868392603.jpg',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2026-12-31',
        buttonText: 'Claim Offer',
        buttonLink: '#memberships',
        status: 'active',
      });
    } else if (type === 'testimonial') {
      setModalItem({
        name: '',
        role: 'Member',
        profileImage: '/src/assets/images/trainer_male_strength_1790868406593.jpg',
        review: '',
        rating: 5,
        status: 'approved',
      });
    } else if (type === 'member') {
      setModalItem({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        status: 'active',
        membership: {
          planName: 'Monthly Starter',
          price: 1199,
          startDate: new Date().toISOString().split('T')[0],
          expiryDate: '2026-11-01',
          status: 'active',
        },
      });
    }
    setEditModalOpen(true);
  };

  const openEditModal = (type: string, item: any) => {
    setModalType(type);
    const itemCopy = { ...item };
    if (Array.isArray(itemCopy.benefits)) {
      itemCopy.benefits = itemCopy.benefits.join('\n');
    }
    setModalItem(itemCopy);
    setEditModalOpen(true);
  };

  const handleModalSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = Boolean(modalItem.id);
      if (modalType === 'plan') {
        if (isEdit) {
          await apiService.updateMembership(modalItem.id, modalItem);
          showSuccess(`Membership "${modalItem.name}" updated! Price is now ₹${modalItem.price}`);
        } else {
          await apiService.createMembership(modalItem);
          showSuccess(`Plan "${modalItem.name}" created successfully!`);
        }
      } else if (modalType === 'trainer') {
        if (isEdit) {
          await apiService.updateTrainer(modalItem.id, modalItem);
          showSuccess(`Trainer "${modalItem.name}" updated!`);
        } else {
          await apiService.createTrainer(modalItem);
          showSuccess(`Trainer "${modalItem.name}" added to coaching staff!`);
        }
      } else if (modalType === 'program') {
        if (isEdit) {
          await apiService.updateProgram(modalItem.id, modalItem);
          showSuccess(`Program "${modalItem.name}" updated!`);
        } else {
          await apiService.createProgram(modalItem);
          showSuccess(`Program "${modalItem.name}" created!`);
        }
      } else if (modalType === 'gallery') {
        if (isEdit) {
          await apiService.updateGalleryItem(modalItem.id, modalItem);
          showSuccess('Gallery item updated!');
        } else {
          await apiService.createGalleryItem(modalItem);
          showSuccess('Image added to gallery!');
        }
      } else if (modalType === 'video') {
        if (isEdit) {
          await apiService.updateVideo(modalItem.id, modalItem);
          showSuccess('Video updated!');
        } else {
          await apiService.createVideo(modalItem);
          showSuccess('Video log created!');
        }
      } else if (modalType === 'offer') {
        if (isEdit) {
          await apiService.updateOffer(modalItem.id, modalItem);
          showSuccess('Offer updated!');
        } else {
          await apiService.createOffer(modalItem);
          showSuccess('Promotional offer created!');
        }
      } else if (modalType === 'testimonial') {
        if (isEdit) {
          await apiService.updateTestimonial(modalItem.id, modalItem);
          showSuccess('Testimonial updated!');
        } else {
          await apiService.createTestimonial(modalItem);
          showSuccess('Testimonial added!');
        }
      } else if (modalType === 'member') {
        if (isEdit) {
          await apiService.updateMember(modalItem.id, modalItem);
          showSuccess('Member updated!');
        } else {
          await apiService.createMember(modalItem);
          showSuccess('New member added!');
        }
      }

      setEditModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDeleteItem = async (type: string, id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;
    try {
      if (type === 'plan') await apiService.deleteMembership(id);
      if (type === 'trainer') await apiService.deleteTrainer(id);
      if (type === 'program') await apiService.deleteProgram(id);
      if (type === 'gallery') await apiService.deleteGalleryItem(id);
      if (type === 'video') await apiService.deleteVideo(id);
      if (type === 'offer') await apiService.deleteOffer(id);
      if (type === 'testimonial') await apiService.deleteTestimonial(id);
      if (type === 'member') await apiService.deleteMember(id);
      if (type === 'booking') await apiService.deleteBooking(id);

      showSuccess(`Deleted item successfully`);
      await loadData();
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: Booking['status']) => {
    try {
      await apiService.updateBooking(id, { status });
      showSuccess(`Booking marked as ${status}`);
      await loadData();
    } catch (err) {
      alert('Failed to update booking status');
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm('Reset all CMS content and records back to initial high-performance defaults?')) return;
    try {
      await apiService.resetDatabase();
      showSuccess('All data reset to initial seed state successfully.');
      await loadData();
    } catch (err) {
      alert('Failed to reset database');
    }
  };

  // Filtered members & bookings
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.phone.includes(memberSearch)
  );

  const filteredBookings = bookings.filter((b) => {
    if (bookingFilter === 'All') return true;
    return b.status.toLowerCase() === bookingFilter.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#070a0f] text-neutral-200 flex flex-col">
      {/* Top Header */}
      <header className="h-16 border-b border-neutral-800 bg-[#0c101a] px-6 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-neutral-950 font-black">
            ⚡
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white font-display uppercase tracking-wider flex items-center gap-2">
              <span>{homepage?.gymName || 'FITZONE FITNESS'}</span>
              <span className="text-[10px] font-mono font-normal bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                OWNER CMS CONSOLE
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Preview Public Site</span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Action Notification Toast */}
      {actionSuccessMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-neutral-950 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold font-display animate-bounce">
          <CheckCircle className="w-4 h-4" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Main Workspace: Sidebar + CMS Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION (240px) */}
        <aside className="w-64 bg-[#0a0e17] border-r border-neutral-800 flex flex-col justify-between p-3 shrink-0 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono">
              Management
            </p>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>

            <button
              onClick={() => setActiveTab('members')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'members'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" /> Members ({members.length})
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <CalendarCheck className="w-4 h-4" /> Bookings
              {bookings.filter((b) => b.status === 'Pending').length > 0 && (
                <span className="ml-auto bg-amber-400/20 text-amber-400 px-1.5 py-0.5 rounded text-[10px]">
                  {bookings.filter((b) => b.status === 'Pending').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('plans')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'plans'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <CreditCard className="w-4 h-4" /> Membership Plans
            </button>

            <p className="px-3 pt-4 pb-1 text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono">
              Gym Dynamic CMS
            </p>

            <button
              onClick={() => setActiveTab('trainers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'trainers'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" /> Trainers ({trainers.length})
            </button>

            <button
              onClick={() => setActiveTab('programs')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'programs'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4" /> Programs
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'gallery'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" /> Gallery
            </button>

            <button
              onClick={() => setActiveTab('videos')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'videos'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" /> Videos
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'testimonials'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Testimonials
            </button>

            <button
              onClick={() => setActiveTab('offers')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'offers'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Tag className="w-4 h-4" /> Offers & Discounts
            </button>

            <p className="px-3 pt-4 pb-1 text-[10px] font-bold text-neutral-500 uppercase tracking-widest font-mono">
              Site Settings & Content
            </p>

            <button
              onClick={() => setActiveTab('homepage')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'homepage'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Home className="w-4 h-4" /> Homepage CMS
            </button>

            <button
              onClick={() => setActiveTab('timings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'timings'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" /> Gym Timings
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'contact'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <PhoneCall className="w-4 h-4" /> Contact & Social
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" /> Reset & Supabase
            </button>
          </div>

          <div className="pt-4 border-t border-neutral-800 text-[11px] text-neutral-500 px-3">
            Logged in as Owner<br />
            <span className="text-neutral-400 truncate block">{user?.email}</span>
          </div>
        </aside>

        {/* MAIN CONTENT VIEWPORT */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-black text-white font-display">Executive Dashboard</h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Live metrics and quick controls for Fitzone operations and content.
                </p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-neutral-400 font-medium">Total Members</p>
                  <p className="text-2xl font-black text-white font-display tabular-nums">
                    {stats?.totalMembers ?? members.length}
                  </p>
                </div>
                <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-neutral-400 font-medium">Active Members</p>
                  <p className="text-2xl font-black text-emerald-400 font-display tabular-nums">
                    {stats?.activeMembers ?? 2}
                  </p>
                </div>
                <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-neutral-400 font-medium">Total Bookings</p>
                  <p className="text-2xl font-black text-white font-display tabular-nums">
                    {stats?.totalBookings ?? bookings.length}
                  </p>
                </div>
                <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-neutral-400 font-medium">Pending Sessions</p>
                  <p className="text-2xl font-black text-amber-400 font-display tabular-nums">
                    {stats?.pendingBookings ?? bookings.filter((b) => b.status === 'Pending').length}
                  </p>
                </div>
                <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-neutral-400 font-medium">Active Plans</p>
                  <p className="text-2xl font-black text-white font-display tabular-nums">
                    {plans.length}
                  </p>
                </div>
                <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-4 space-y-1">
                  <p className="text-xs text-neutral-400 font-medium">Coaching Staff</p>
                  <p className="text-2xl font-black text-white font-display tabular-nums">
                    {trainers.length}
                  </p>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  Quick CMS Actions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <button
                    onClick={() => openAddModal('trainer')}
                    className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-neutral-800 text-left space-y-1 transition-colors group"
                  >
                    <Award className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <p className="font-semibold text-white">+ Add New Trainer</p>
                    <p className="text-[11px] text-neutral-400">Upload photo & specialization</p>
                  </button>

                  <button
                    onClick={() => openAddModal('plan')}
                    className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-neutral-800 text-left space-y-1 transition-colors group"
                  >
                    <CreditCard className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
                    <p className="font-semibold text-white">+ New Membership Plan</p>
                    <p className="text-[11px] text-neutral-400">Set price & perks</p>
                  </button>

                  <button
                    onClick={() => openAddModal('gallery')}
                    className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-neutral-800 text-left space-y-1 transition-colors group"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <p className="font-semibold text-white">+ Upload Facility Photo</p>
                    <p className="text-[11px] text-neutral-400">Upload to gym gallery</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('homepage')}
                    className="p-3 bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-neutral-800 text-left space-y-1 transition-colors group"
                  >
                    <Home className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
                    <p className="font-semibold text-white">Edit Homepage Hero</p>
                    <p className="text-[11px] text-neutral-400">Change titles & images</p>
                  </button>
                </div>
              </div>

              {/* Pending Bookings Queue */}
              <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                    Pending Booking Requests
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    View All Bookings &rarr;
                  </button>
                </div>

                <div className="divide-y divide-neutral-800 text-xs">
                  {bookings.filter((b) => b.status === 'Pending').length === 0 ? (
                    <p className="text-neutral-400 py-3">No pending sessions awaiting approval.</p>
                  ) : (
                    bookings
                      .filter((b) => b.status === 'Pending')
                      .slice(0, 5)
                      .map((bk) => (
                        <div key={bk.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <p className="font-bold text-white">{bk.userName} · <span className="text-amber-400">{bk.bookingType}</span></p>
                            <p className="text-[11px] text-neutral-400">{bk.userPhone} · {bk.userEmail} · Slot: {bk.date} at {bk.time}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUpdateBookingStatus(bk.id, 'Approved')}
                              className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateBookingStatus(bk.id, 'Rejected')}
                              className="px-3 py-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg hover:bg-rose-500/30 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEMBERS MANAGEMENT */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Gym Members Directory</h2>
                  <p className="text-xs text-neutral-400">View, search, and manage registered members and active passes.</p>
                </div>
                <button
                  onClick={() => openAddModal('member')}
                  className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Member
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search members by name, email, or phone number..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  className="w-full bg-[#101522] border border-neutral-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Table */}
              <div className="bg-[#101522] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-900/60 text-neutral-400 border-b border-neutral-800 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Member Name</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Active Plan</th>
                        <th className="py-3 px-4">Expiry Date</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80">
                      {filteredMembers.map((m) => (
                        <tr key={m.id} className="hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3 px-4 font-semibold text-white">
                            {m.name}
                            {m.role === 'admin' && (
                              <span className="ml-2 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                                OWNER
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-neutral-300">
                            <div>{m.email}</div>
                            <div className="text-[11px] text-neutral-500">{m.phone}</div>
                          </td>
                          <td className="py-3 px-4 text-amber-400 font-medium">
                            {m.membership?.planName || 'No active plan'}
                          </td>
                          <td className="py-3 px-4 font-mono text-neutral-300">
                            {m.membership?.expiryDate || '—'}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                m.status === 'active'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {m.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => openEditModal('member', m)}
                              className="p-1 text-neutral-400 hover:text-amber-400 rounded transition-colors"
                              title="Edit Member"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            {m.role !== 'admin' && (
                              <button
                                onClick={() => handleDeleteItem('member', m.id, m.name)}
                                className="p-1 text-neutral-400 hover:text-rose-400 rounded transition-colors"
                                title="Delete Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Session Bookings & Free Trials</h2>
                  <p className="text-xs text-neutral-400">Review member and guest appointment requests.</p>
                </div>

                <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800 text-xs">
                  {['All', 'Pending', 'Approved', 'Completed', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setBookingFilter(st)}
                      className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                        bookingFilter === st
                          ? 'bg-neutral-800 text-amber-400 font-semibold'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#101522] border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-900/60 text-neutral-400 border-b border-neutral-800 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Visitor / Member</th>
                        <th className="py-3 px-4">Session Type</th>
                        <th className="py-3 px-4">Trainer / Program</th>
                        <th className="py-3 px-4">Date & Time</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80">
                      {filteredBookings.map((bk) => (
                        <tr key={bk.id} className="hover:bg-neutral-900/40 transition-colors">
                          <td className="py-3 px-4 font-semibold text-white">
                            <div>{bk.userName}</div>
                            <div className="text-[11px] text-neutral-400 font-normal">{bk.userPhone}</div>
                          </td>
                          <td className="py-3 px-4 text-amber-400 font-medium">{bk.bookingType}</td>
                          <td className="py-3 px-4 text-neutral-300">
                            {bk.trainerName || bk.programName || 'General Floor'}
                          </td>
                          <td className="py-3 px-4 font-mono text-neutral-300">
                            {bk.date} @ {bk.time}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                bk.status === 'Approved'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : bk.status === 'Pending'
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                                  : bk.status === 'Completed'
                                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              }`}
                            >
                              {bk.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5">
                            {bk.status === 'Pending' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(bk.id, 'Approved')}
                                className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30"
                              >
                                Approve
                              </button>
                            )}
                            {bk.status === 'Approved' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(bk.id, 'Completed')}
                                className="px-2 py-1 bg-sky-500/20 text-sky-400 rounded hover:bg-sky-500/30"
                              >
                                Complete
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteItem('booking', bk.id, bk.userName)}
                              className="p-1 text-neutral-400 hover:text-rose-400 rounded"
                              title="Delete booking"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MEMBERSHIP PLANS CMS */}
          {activeTab === 'plans' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Membership Plans CMS</h2>
                  <p className="text-xs text-neutral-400">
                    Change prices, durations, perks, and popular flags. Updates appear immediately on the public site!
                  </p>
                </div>
                <button
                  onClick={() => openAddModal('plan')}
                  className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Membership Plan
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((p) => (
                  <div
                    key={p.id}
                    className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-white font-display">{p.name}</h3>
                          <span className="text-xs text-neutral-400">{p.duration}</span>
                        </div>
                        {p.isPopular && (
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-neutral-950 px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="text-2xl font-black text-amber-400 font-mono">
                        ₹{p.price.toLocaleString('en-IN')}
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed font-light">{p.description}</p>

                      <div className="space-y-1 pt-2 border-t border-neutral-800 text-xs text-neutral-400">
                        <p className="font-semibold text-neutral-300">Privileges:</p>
                        <ul className="space-y-1">
                          {p.benefits.map((b, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-400">•</span>
                              <span className="text-neutral-300">{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          p.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {p.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal('plan', p)}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3 text-amber-400" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem('plan', p.id, p.name)}
                          className="p-1 text-neutral-400 hover:text-rose-400 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: TRAINERS CMS */}
          {activeTab === 'trainers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Trainer Management CMS</h2>
                  <p className="text-xs text-neutral-400">
                    Add coaching staff with profile photos, specializations, and bios.
                  </p>
                </div>
                <button
                  onClick={() => openAddModal('trainer')}
                  className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Trainer
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {trainers.map((tr) => (
                  <div
                    key={tr.id}
                    className="bg-[#101522] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-48 overflow-hidden bg-neutral-900 relative">
                        <img
                          src={tr.profileImage}
                          alt={tr.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 left-2 bg-neutral-950/80 px-2 py-0.5 rounded text-[10px] text-amber-400 font-semibold">
                          {tr.experience}
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="text-base font-bold text-white font-display">{tr.name}</h3>
                        <p className="text-xs text-amber-400 font-medium">{tr.specialization}</p>
                        <p className="text-xs text-neutral-400 line-clamp-3">{tr.bio}</p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-neutral-800/80 flex items-center justify-between mt-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          tr.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {tr.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal('trainer', tr)}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3 text-amber-400" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem('trainer', tr.id, tr.name)}
                          className="p-1 text-neutral-400 hover:text-rose-400 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: PROGRAMS CMS */}
          {activeTab === 'programs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Programs CMS</h2>
                  <p className="text-xs text-neutral-400">
                    Add and adjust workout protocols, difficulties, durations, and images.
                  </p>
                </div>
                <button
                  onClick={() => openAddModal('program')}
                  className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Program
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {programs.map((prog) => (
                  <div
                    key={prog.id}
                    className="bg-[#101522] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-40 bg-neutral-900 relative">
                        <img
                          src={prog.image}
                          alt={prog.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 right-2 bg-neutral-950/80 px-2 py-0.5 rounded text-[10px] text-amber-400 font-semibold">
                          {prog.difficulty}
                        </span>
                      </div>
                      <div className="p-5 space-y-2">
                        <h3 className="text-base font-bold text-white font-display">{prog.name}</h3>
                        <p className="text-xs text-neutral-400 line-clamp-2">{prog.description}</p>
                        <p className="text-[11px] text-neutral-300">Duration: {prog.duration}</p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-neutral-800/80 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
                        {prog.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal('program', prog)}
                          className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Pencil className="w-3 h-3 text-amber-400" /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteItem('program', prog.id, prog.name)}
                          className="p-1 text-neutral-400 hover:text-rose-400 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GALLERY CMS */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Facility Gallery CMS</h2>
                  <p className="text-xs text-neutral-400">
                    Upload new gym images directly or provide URLs with categories.
                  </p>
                </div>
                <button
                  onClick={() => openAddModal('gallery')}
                  className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Upload Image
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#101522] border border-neutral-800 rounded-2xl overflow-hidden group"
                  >
                    <div className="h-44 bg-neutral-900 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-neutral-950/80 px-2 py-0.5 rounded text-[10px] text-amber-400 font-semibold font-mono">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <p className="text-xs font-semibold text-white truncate max-w-[140px]">{item.title}</p>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal('gallery', item)}
                          className="p-1 text-neutral-400 hover:text-amber-400 rounded"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('gallery', item.id, item.title)}
                          className="p-1 text-neutral-400 hover:text-rose-400 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: VIDEOS CMS */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Video Logs CMS</h2>
                  <p className="text-xs text-neutral-400">
                    Add YouTube clips, tours, tutorials, or video uploads.
                  </p>
                </div>
                <button
                  onClick={() => openAddModal('video')}
                  className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Video
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((vid) => (
                  <div key={vid.id} className="bg-[#101522] border border-neutral-800 rounded-2xl p-4 space-y-3">
                    <div className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-2 left-2 bg-neutral-950/80 px-2 py-0.5 rounded text-[10px] text-amber-400 font-semibold">
                        {vid.category}
                      </span>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-white font-display">{vid.title}</h4>
                        <p className="text-xs text-neutral-400 truncate max-w-sm mt-0.5">{vid.videoUrl}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal('video', vid)}
                          className="p-1 text-neutral-400 hover:text-amber-400 rounded"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('video', vid.id, vid.title)}
                          className="p-1 text-neutral-400 hover:text-rose-400 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: TESTIMONIALS CMS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Testimonials CMS</h2>
                  <p className="text-xs text-neutral-400">
                    Approve, edit, or publish member reviews and success stories.
                  </p>
                </div>
                <button
                  onClick={() => openAddModal('testimonial')}
                  className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.map((test) => (
                  <div
                    key={test.id}
                    className="bg-[#101522] border border-neutral-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-amber-400 font-bold font-mono">
                          {'★'.repeat(test.rating || 5)}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            test.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {test.status}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-300 italic font-light">"{test.review}"</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-neutral-800/80">
                      <div>
                        <p className="text-xs font-bold text-white">{test.name}</p>
                        <p className="text-[11px] text-neutral-400">{test.role}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal('testimonial', test)}
                          className="p-1 text-neutral-400 hover:text-amber-400 rounded"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem('testimonial', test.id, test.name)}
                          className="p-1 text-neutral-400 hover:text-rose-400 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 10: OFFERS CMS */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Promotional Offers CMS</h2>
                  <p className="text-xs text-neutral-400">
                    Launch seasonal sales, discounts, and partnership banners.
                  </p>
                </div>
                <button
                  onClick={() => openAddModal('offer')}
                  className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Create Offer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offers.map((off) => (
                  <div key={off.id} className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono bg-amber-500/10 px-2 py-0.5 rounded">
                          {off.discount}
                        </span>
                        <h3 className="text-lg font-bold text-white font-display">{off.title}</h3>
                      </div>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          off.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-neutral-800 text-neutral-500'
                        }`}
                      >
                        {off.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 font-light leading-relaxed">{off.description}</p>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      Validity: {off.startDate} to {off.endDate}
                    </p>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                      <button
                        onClick={() => openEditModal('offer', off)}
                        className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                      >
                        <Pencil className="w-3.5 h-3.5 text-amber-400" /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteItem('offer', off.id, off.title)}
                        className="p-1.5 text-neutral-400 hover:text-rose-400 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: HOMEPAGE CMS */}
          {activeTab === 'homepage' && homepage && (
            <form onSubmit={handleSaveHomepage} className="space-y-8 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold text-white font-display">Homepage Content CMS</h2>
                <p className="text-xs text-neutral-400">
                  Update hero copy, gym name, statistics, and about section without modifying source code.
                </p>
              </div>

              {/* Gym Brand Name & Tagline */}
              <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  Gym Identity
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Gym Name</label>
                    <input
                      type="text"
                      value={homepage.gymName}
                      onChange={(e) => setHomepage({ ...homepage, gymName: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-display font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Tagline</label>
                    <input
                      type="text"
                      value={homepage.tagline}
                      onChange={(e) => setHomepage({ ...homepage, tagline: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Section */}
              <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  Hero Section
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Hero Title</label>
                    <input
                      type="text"
                      value={homepage.hero.title}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          hero: { ...homepage.hero, title: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-display font-black text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Hero Subtitle</label>
                    <textarea
                      rows={2}
                      value={homepage.hero.subtitle}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          hero: { ...homepage.hero, subtitle: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <ImageUploader
                    label="Hero Background Image"
                    value={homepage.hero.image}
                    onChange={(url) =>
                      setHomepage({
                        ...homepage,
                        hero: { ...homepage.hero, image: url },
                      })
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Primary Button Text</label>
                      <input
                        type="text"
                        value={homepage.hero.primaryButtonText}
                        onChange={(e) =>
                          setHomepage({
                            ...homepage,
                            hero: { ...homepage.hero, primaryButtonText: e.target.value },
                          })
                        }
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Secondary Button Text</label>
                      <input
                        type="text"
                        value={homepage.hero.secondaryButtonText}
                        onChange={(e) =>
                          setHomepage({
                            ...homepage,
                            hero: { ...homepage.hero, secondaryButtonText: e.target.value },
                          })
                        }
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Counters */}
              <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  Statistics Display Strip
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Members Count</label>
                    <input
                      type="text"
                      value={homepage.stats.members}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          stats: { ...homepage.stats, members: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Coaches Count</label>
                    <input
                      type="text"
                      value={homepage.stats.trainers}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          stats: { ...homepage.stats, trainers: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Years Experience</label>
                    <input
                      type="text"
                      value={homepage.stats.yearsExperience}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          stats: { ...homepage.stats, yearsExperience: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Programs Count</label>
                    <input
                      type="text"
                      value={homepage.stats.programs}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          stats: { ...homepage.stats, programs: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Call to action section */}
              <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  CTA Section
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">CTA Title</label>
                    <input
                      type="text"
                      value={homepage.cta.title}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          cta: { ...homepage.cta, title: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">CTA Description</label>
                    <textarea
                      rows={2}
                      value={homepage.cta.description}
                      onChange={(e) =>
                        setHomepage({
                          ...homepage,
                          cta: { ...homepage.cta, description: e.target.value },
                        })
                      }
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="py-3 px-8 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/15"
                >
                  Save Homepage Changes
                </button>
              </div>
            </form>
          )}

          {/* TAB 12: GYM TIMINGS CMS */}
          {activeTab === 'timings' && timings && (
            <form onSubmit={handleSaveTimings} className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-bold text-white font-display">Gym Operating Hours CMS</h2>
                <p className="text-xs text-neutral-400">
                  Update daily opening and closing hours. Changes immediately show in the footer and homepage schedule.
                </p>
              </div>

              <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
                <div className="divide-y divide-neutral-800/80">
                  {Object.entries(timings).map(([day, val]) => (
                    <div key={day} className="py-3.5 grid grid-cols-1 sm:grid-cols-4 items-center gap-3 text-xs">
                      <span className="font-bold text-white">{day}</span>
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-0.5">Opening Time</label>
                        <input
                          type="text"
                          value={val.open}
                          disabled={val.isClosed}
                          onChange={(e) =>
                            setTimings({
                              ...timings,
                              [day]: { ...val, open: e.target.value },
                            })
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white disabled:opacity-40"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-0.5">Closing Time</label>
                        <input
                          type="text"
                          value={val.close}
                          disabled={val.isClosed}
                          onChange={(e) =>
                            setTimings({
                              ...timings,
                              [day]: { ...val, close: e.target.value },
                            })
                          }
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-white disabled:opacity-40"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-4 sm:pt-0">
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-neutral-300">
                          <input
                            type="checkbox"
                            checked={val.isClosed}
                            onChange={(e) =>
                              setTimings({
                                ...timings,
                                [day]: { ...val, isClosed: e.target.checked },
                              })
                            }
                            className="rounded border-neutral-700 text-amber-500 focus:ring-0"
                          />
                          <span>Closed</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-8 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/15"
              >
                Save Schedule Timings
              </button>
            </form>
          )}

          {/* TAB 13: CONTACT INFO CMS */}
          {activeTab === 'contact' && contact && (
            <form onSubmit={handleSaveContact} className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-bold text-white font-display">Contact & Social Channels CMS</h2>
                <p className="text-xs text-neutral-400">
                  Manage phone, WhatsApp, location, email, and social media links.
                </p>
              </div>

              <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Telephone Number</label>
                    <input
                      type="text"
                      value={contact.phone}
                      onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">WhatsApp Number</label>
                    <input
                      type="text"
                      value={contact.whatsapp}
                      onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Email Address</label>
                  <input
                    type="email"
                    value={contact.email}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Physical Address</label>
                  <textarea
                    rows={2}
                    value={contact.address}
                    onChange={(e) => setContact({ ...contact, address: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Google Maps URL</label>
                  <input
                    type="text"
                    value={contact.googleMapsUrl}
                    onChange={(e) => setContact({ ...contact, googleMapsUrl: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Instagram URL</label>
                    <input
                      type="text"
                      value={contact.instagram}
                      onChange={(e) => setContact({ ...contact, instagram: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Facebook URL</label>
                    <input
                      type="text"
                      value={contact.facebook}
                      onChange={(e) => setContact({ ...contact, facebook: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">YouTube URL</label>
                    <input
                      type="text"
                      value={contact.youtube}
                      onChange={(e) => setContact({ ...contact, youtube: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-8 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/15"
              >
                Save Contact Details
              </button>
            </form>
          )}

          {/* TAB 14: SETTINGS & DATABASE RESET */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-bold text-white font-display">System & Architecture Setup</h2>
                <p className="text-xs text-neutral-400">
                  Review database readiness for Supabase and reset demo data.
                </p>
              </div>

              {/* Supabase Phase Checklist */}
              <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  Supabase Integration Readiness (Phases 1–5)
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Repository Layer Encapsulation</p>
                      <p className="text-[11px] text-neutral-400">
                        Modular <code className="text-amber-400">gymRepository.ts</code> layer is fully separated from Express controllers and React UI.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                      READY
                    </span>
                  </div>

                  <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Supabase Storage Uploads</p>
                      <p className="text-[11px] text-neutral-400">
                        Multipart media upload endpoint (`/api/upload`) ready to pipe file buffers directly to Supabase storage buckets.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                      READY
                    </span>
                  </div>

                  <div className="p-3 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">Modular Razorpay Integration</p>
                      <p className="text-[11px] text-neutral-400">
                        Order creation and webhook signature validation flow implemented in modular structure.
                      </p>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-bold">
                      READY
                    </span>
                  </div>
                </div>
              </div>

              {/* Reset Database Button */}
              <div className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">Reset Database to Default Seed Data</h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Useful during demonstration and grading. Resets all memberships, programs, trainers, and gallery items back to pristine defaults.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResetDatabase}
                  className="py-2.5 px-5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset Database to Default State
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* UNIVERSAL EDIT / ADD MODAL */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111622] border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl my-8">
            <div className="bg-[#0b0e17] px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-white font-display capitalize">
                {modalItem.id ? `Edit ${modalType}` : `Add New ${modalType}`}
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleModalSave} className="p-6 space-y-4 text-xs">
              {/* PLAN FIELDS */}
              {modalType === 'plan' && (
                <>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Plan Name *</label>
                    <input
                      type="text"
                      required
                      value={modalItem.name || ''}
                      onChange={(e) => setModalItem({ ...modalItem, name: e.target.value })}
                      placeholder="e.g. Monthly Starter"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Price (₹ INR) *</label>
                      <input
                        type="number"
                        required
                        value={modalItem.price ?? ''}
                        onChange={(e) => setModalItem({ ...modalItem, price: e.target.value })}
                        placeholder="1199"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Duration</label>
                      <input
                        type="text"
                        value={modalItem.duration || ''}
                        onChange={(e) => setModalItem({ ...modalItem, duration: e.target.value })}
                        placeholder="e.g. 1 Month, 3 Months, 1 Year"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Description</label>
                    <textarea
                      rows={2}
                      value={modalItem.description || ''}
                      onChange={(e) => setModalItem({ ...modalItem, description: e.target.value })}
                      placeholder="Summary of this tier"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Benefits (1 per line)</label>
                    <textarea
                      rows={4}
                      value={modalItem.benefits || ''}
                      onChange={(e) => setModalItem({ ...modalItem, benefits: e.target.value })}
                      placeholder="Full gym access&#10;Shower amenities&#10;Locker access"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono text-[11px]"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                      <input
                        type="checkbox"
                        checked={Boolean(modalItem.isPopular)}
                        onChange={(e) => setModalItem({ ...modalItem, isPopular: e.target.checked })}
                        className="rounded border-neutral-700 text-amber-500"
                      />
                      <span>Mark as Popular Tier</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                      <select
                        value={modalItem.status || 'active'}
                        onChange={(e) => setModalItem({ ...modalItem, status: e.target.value })}
                        className="bg-neutral-900 border border-neutral-800 rounded px-2 py-1 text-white"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </label>
                  </div>
                </>
              )}

              {/* TRAINER FIELDS */}
              {modalType === 'trainer' && (
                <>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Trainer Name *</label>
                    <input
                      type="text"
                      required
                      value={modalItem.name || ''}
                      onChange={(e) => setModalItem({ ...modalItem, name: e.target.value })}
                      placeholder="Marcus Vance"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <ImageUploader
                    label="Trainer Profile Photo"
                    value={modalItem.profileImage || ''}
                    onChange={(url) => setModalItem({ ...modalItem, profileImage: url })}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Specialization *</label>
                      <input
                        type="text"
                        required
                        value={modalItem.specialization || ''}
                        onChange={(e) => setModalItem({ ...modalItem, specialization: e.target.value })}
                        placeholder="Strength & Conditioning"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Experience</label>
                      <input
                        type="text"
                        value={modalItem.experience || ''}
                        onChange={(e) => setModalItem({ ...modalItem, experience: e.target.value })}
                        placeholder="8+ Years Experience"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Phone</label>
                      <input
                        type="text"
                        value={modalItem.phone || ''}
                        onChange={(e) => setModalItem({ ...modalItem, phone: e.target.value })}
                        placeholder="+91 98451 00000"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Email</label>
                      <input
                        type="email"
                        value={modalItem.email || ''}
                        onChange={(e) => setModalItem({ ...modalItem, email: e.target.value })}
                        placeholder="trainer@fitzone.com"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Biography & Credentials</label>
                    <textarea
                      rows={3}
                      value={modalItem.bio || ''}
                      onChange={(e) => setModalItem({ ...modalItem, bio: e.target.value })}
                      placeholder="Certifications, coaching philosophy, athletic background"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Status</label>
                    <select
                      value={modalItem.status || 'active'}
                      onChange={(e) => setModalItem({ ...modalItem, status: e.target.value })}
                      className="bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1.5 text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}

              {/* PROGRAM FIELDS */}
              {modalType === 'program' && (
                <>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Program Title *</label>
                    <input
                      type="text"
                      required
                      value={modalItem.name || ''}
                      onChange={(e) => setModalItem({ ...modalItem, name: e.target.value })}
                      placeholder="Hypertrophy Periodization"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <ImageUploader
                    label="Program Banner Image"
                    value={modalItem.image || ''}
                    onChange={(url) => setModalItem({ ...modalItem, image: url })}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Duration</label>
                      <input
                        type="text"
                        value={modalItem.duration || ''}
                        onChange={(e) => setModalItem({ ...modalItem, duration: e.target.value })}
                        placeholder="12 Weeks"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Difficulty</label>
                      <select
                        value={modalItem.difficulty || 'Intermediate'}
                        onChange={(e) => setModalItem({ ...modalItem, difficulty: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      >
                        <option>Beginner</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                        <option>All Levels</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Description</label>
                    <textarea
                      rows={2}
                      value={modalItem.description || ''}
                      onChange={(e) => setModalItem({ ...modalItem, description: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Key Benefits (1 per line)</label>
                    <textarea
                      rows={3}
                      value={modalItem.benefits || ''}
                      onChange={(e) => setModalItem({ ...modalItem, benefits: e.target.value })}
                      placeholder="Strength gains&#10;Postural integrity&#10;Fat loss"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono text-[11px]"
                    />
                  </div>
                </>
              )}

              {/* GALLERY ITEM */}
              {modalType === 'gallery' && (
                <>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Photo Title *</label>
                    <input
                      type="text"
                      required
                      value={modalItem.title || ''}
                      onChange={(e) => setModalItem({ ...modalItem, title: e.target.value })}
                      placeholder="Dumbbell Training Area"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <ImageUploader
                    label="Facility Image"
                    value={modalItem.imageUrl || ''}
                    onChange={(url) => setModalItem({ ...modalItem, imageUrl: url })}
                  />

                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Category</label>
                    <select
                      value={modalItem.category || 'Gym'}
                      onChange={(e) => setModalItem({ ...modalItem, category: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    >
                      <option>Gym</option>
                      <option>Equipment</option>
                      <option>Training</option>
                      <option>Members</option>
                      <option>Transformation</option>
                      <option>Events</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Description</label>
                    <input
                      type="text"
                      value={modalItem.description || ''}
                      onChange={(e) => setModalItem({ ...modalItem, description: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </>
              )}

              {/* VIDEO ITEM */}
              {modalType === 'video' && (
                <>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Video Title *</label>
                    <input
                      type="text"
                      required
                      value={modalItem.title || ''}
                      onChange={(e) => setModalItem({ ...modalItem, title: e.target.value })}
                      placeholder="Club Walkthrough"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Video URL / YouTube Link *</label>
                    <input
                      type="text"
                      required
                      value={modalItem.videoUrl || ''}
                      onChange={(e) => setModalItem({ ...modalItem, videoUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <ImageUploader
                    label="Video Thumbnail"
                    value={modalItem.thumbnail || ''}
                    onChange={(url) => setModalItem({ ...modalItem, thumbnail: url })}
                  />

                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Category</label>
                    <input
                      type="text"
                      value={modalItem.category || ''}
                      onChange={(e) => setModalItem({ ...modalItem, category: e.target.value })}
                      placeholder="Facility Tour / Tutorial"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Description</label>
                    <textarea
                      rows={2}
                      value={modalItem.description || ''}
                      onChange={(e) => setModalItem({ ...modalItem, description: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </>
              )}

              {/* TESTIMONIAL ITEM */}
              {modalType === 'testimonial' && (
                <>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Member Name *</label>
                    <input
                      type="text"
                      required
                      value={modalItem.name || ''}
                      onChange={(e) => setModalItem({ ...modalItem, name: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Role / Profession</label>
                    <input
                      type="text"
                      value={modalItem.role || ''}
                      onChange={(e) => setModalItem({ ...modalItem, role: e.target.value })}
                      placeholder="Member for 1 Year"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Review Statement *</label>
                    <textarea
                      rows={3}
                      required
                      value={modalItem.review || ''}
                      onChange={(e) => setModalItem({ ...modalItem, review: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Rating (1-5)</label>
                      <input
                        type="number"
                        min={1}
                        max={5}
                        value={modalItem.rating || 5}
                        onChange={(e) => setModalItem({ ...modalItem, rating: Number(e.target.value) })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Status</label>
                      <select
                        value={modalItem.status || 'approved'}
                        onChange={(e) => setModalItem({ ...modalItem, status: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* OFFER ITEM */}
              {modalType === 'offer' && (
                <>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Offer Title *</label>
                    <input
                      type="text"
                      required
                      value={modalItem.title || ''}
                      onChange={(e) => setModalItem({ ...modalItem, title: e.target.value })}
                      placeholder="Kickstart 20% OFF"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Discount Badge *</label>
                    <input
                      type="text"
                      required
                      value={modalItem.discount || ''}
                      onChange={(e) => setModalItem({ ...modalItem, discount: e.target.value })}
                      placeholder="20% OFF / FREE MONTH"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Description</label>
                    <textarea
                      rows={2}
                      value={modalItem.description || ''}
                      onChange={(e) => setModalItem({ ...modalItem, description: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Start Date</label>
                      <input
                        type="date"
                        value={modalItem.startDate || ''}
                        onChange={(e) => setModalItem({ ...modalItem, startDate: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">End Date</label>
                      <input
                        type="date"
                        value={modalItem.endDate || ''}
                        onChange={(e) => setModalItem({ ...modalItem, endDate: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* MEMBER ITEM */}
              {modalType === 'member' && (
                <>
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={modalItem.name || ''}
                      onChange={(e) => setModalItem({ ...modalItem, name: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Email *</label>
                      <input
                        type="email"
                        required
                        value={modalItem.email || ''}
                        onChange={(e) => setModalItem({ ...modalItem, email: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Phone</label>
                      <input
                        type="tel"
                        value={modalItem.phone || ''}
                        onChange={(e) => setModalItem({ ...modalItem, phone: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Role</label>
                      <select
                        value={modalItem.role || 'user'}
                        onChange={(e) => setModalItem({ ...modalItem, role: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="user">User (Member)</option>
                        <option value="admin">Admin (Owner)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">Status</label>
                      <select
                        value={modalItem.status || 'active'}
                        onChange={(e) => setModalItem({ ...modalItem, status: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-white"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl transition-all shadow-md shadow-amber-500/15"
                >
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

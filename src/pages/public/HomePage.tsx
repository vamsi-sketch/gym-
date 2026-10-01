import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  Play,
  Star,
  Clock,
  Sparkles,
  Calendar,
  X,
  ChevronRight,
  Shield,
  Zap,
} from 'lucide-react';
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
} from '../../types';
import { apiService } from '../../services/api';
import { PaymentModal } from '../../components/common/PaymentModal';
import { BookingModal } from '../../components/common/BookingModal';
import { useAuth } from '../../context/AuthContext';

export const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [homepage, setHomepage] = useState<HomepageContent | null>(null);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [timings, setTimings] = useState<GymTimings | null>(null);
  const [contact, setContact] = useState<ContactInfo | null>(null);

  const [loading, setLoading] = useState(true);
  const [galleryFilter, setGalleryFilter] = useState<string>('All');
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<MembershipPlan | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [
        homeData,
        plansData,
        trainersData,
        programsData,
        galleryData,
        videosData,
        testimonialsData,
        offersData,
        timingsData,
        contactData,
      ] = await Promise.all([
        apiService.getHomepage(),
        apiService.getMemberships(),
        apiService.getTrainers(),
        apiService.getPrograms(),
        apiService.getGallery(),
        apiService.getVideos(),
        apiService.getTestimonials(),
        apiService.getOffers(),
        apiService.getTimings(),
        apiService.getContact(),
      ]);

      setHomepage(homeData);
      setPlans(plansData);
      setTrainers(trainersData);
      setPrograms(programsData);
      setGallery(galleryData);
      setVideos(videosData);
      setTestimonials(testimonialsData);
      setOffers(offersData);
      setTimings(timingsData);
      setContact(contactData);
    } catch (err) {
      console.error('Failed to load gym data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredGallery =
    galleryFilter === 'All'
      ? gallery
      : gallery.filter((item) => item.category.toLowerCase() === galleryFilter.toLowerCase());

  if (loading && !homepage) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-neutral-400 font-medium tracking-wide">Loading Fitzone Fitness Experience...</p>
        </div>
      </div>
    );
  }

  const hero = homepage?.hero;
  const stats = homepage?.stats;
  const about = homepage?.about;
  const cta = homepage?.cta;

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Background Image / Ambient Scrim */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={hero?.image || '/src/assets/images/hero_gym_workout_1790868392603.jpg'}
            alt="Fitzone Gym Floor"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-[0.32] scale-105 transform motion-safe:transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Active Offer Flash (if any) */}
          {offers.length > 0 && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold tracking-wide animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{offers[0].title} ({offers[0].discount})</span>
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight font-display leading-[1.08] text-balance">
            {hero?.title || 'UNLEASH YOUR HIGHEST POTENTIAL'}
          </h1>

          <p className="max-w-2xl mx-auto text-neutral-300 text-base sm:text-lg leading-relaxed font-light">
            {hero?.subtitle ||
              'Bengaluru’s premier high-performance strength and athletic conditioning club. World-class equipment, elite coaching, and an uncompromising standard of fitness.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={hero?.primaryButtonLink || '#memberships'}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 hover:scale-[1.02] flex items-center gap-2"
            >
              {hero?.primaryButtonText || 'Explore Memberships'}
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="px-7 py-3.5 bg-neutral-900/90 hover:bg-neutral-800 text-white font-semibold text-sm uppercase tracking-wider rounded-xl border border-neutral-700/80 transition-all hover:border-neutral-500 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              {hero?.secondaryButtonText || 'Book Free Trial'}
            </button>
          </div>

          {/* Video Tour Quick Trigger */}
          {hero?.videoUrl && (
            <div className="pt-4">
              <button
                onClick={() => setActiveVideoModal(hero.videoUrl || '')}
                className="inline-flex items-center gap-2 text-xs font-medium text-neutral-400 hover:text-amber-400 transition-colors group"
              >
                <div className="w-7 h-7 rounded-full bg-neutral-800/80 group-hover:bg-amber-500/20 border border-neutral-700 flex items-center justify-center text-white group-hover:text-amber-400 transition-colors">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Club Tour (2 Min Walkthrough)</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. DYNAMIC STATS STRIP */}
      {stats && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
          <div className="bg-[#101622]/90 backdrop-blur-md border border-neutral-800 rounded-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-xl">
            <div className="space-y-1 border-r border-neutral-800/60 last:border-none">
              <p className="text-3xl sm:text-4xl font-black text-amber-400 font-display tabular-nums">
                {stats.members}
              </p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Active Members</p>
            </div>
            <div className="space-y-1 sm:border-r border-neutral-800/60 last:border-none">
              <p className="text-3xl sm:text-4xl font-black text-white font-display tabular-nums">
                {stats.trainers}
              </p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Certified Coaches</p>
            </div>
            <div className="space-y-1 border-r border-neutral-800/60 last:border-none">
              <p className="text-3xl sm:text-4xl font-black text-white font-display tabular-nums">
                {stats.yearsExperience}
              </p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Years of Excellence</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-amber-400 font-display tabular-nums">
                {stats.programs}
              </p>
              <p className="text-xs text-neutral-400 uppercase tracking-wider font-medium">Specialized Programs</p>
            </div>
          </div>
        </section>
      )}

      {/* 3. ABOUT SECTION PREVIEW */}
      {about && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Column */}
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 group shadow-2xl">
              <img
                src={about.image || '/src/assets/images/gym_interior_floor_1790868429405.jpg'}
                alt="Gym Interior"
                referrerPolicy="no-referrer"
                className="w-full h-[460px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div className="space-y-1 text-white">
                  <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase">Facility Highlight</p>
                  <p className="text-sm font-medium text-neutral-200">14,000+ sq.ft Dedicated Strength & Conditioning Sanctuary</p>
                </div>
              </div>
            </div>

            {/* Text Column */}
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
                  {about.subtitle || 'ABOUT FITZONE'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display text-balance">
                  {about.title}
                </h2>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed font-light">
                {about.description}
              </p>

              {/* Facilities Checklist */}
              {about.facilities && about.facilities.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    Signature Amenities
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-neutral-300">
                    {about.facilities.slice(0, 6).map((fac, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{fac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex items-center gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-amber-400 uppercase tracking-wider transition-colors"
                >
                  Explore Full Story & Equipment Specs &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. DYNAMIC PROGRAMS SECTION */}
      <section id="programs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              PERFORMANCE PATHWAYS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Scientifically Periodized Programs
            </h2>
          </div>
          <Link
            to="/programs"
            className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            View all programs ({programs.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.slice(0, 6).map((prog) => (
            <div
              key={prog.id}
              className="bg-[#101522] border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-neutral-900">
                  <img
                    src={prog.image}
                    alt={prog.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-400 border border-neutral-800">
                    {prog.difficulty}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[11px] font-medium text-neutral-300 border border-neutral-800 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {prog.duration}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white font-display group-hover:text-amber-400 transition-colors">
                    {prog.name}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed line-clamp-2">
                    {prog.description}
                  </p>

                  {prog.benefits && prog.benefits.length > 0 && (
                    <ul className="space-y-1.5 pt-2 text-xs text-neutral-300">
                      {prog.benefits.slice(0, 3).map((b, i) => (
                        <li key={i} className="flex items-center gap-2 text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full py-2.5 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-950 text-neutral-300 text-xs font-semibold rounded-xl border border-neutral-800 hover:border-transparent transition-all flex items-center justify-center gap-1.5"
                >
                  Join This Program
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DYNAMIC TRAINERS SECTION */}
      <section id="trainers" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              ELITE GUIDANCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Meet Your Head Coaches
            </h2>
          </div>
          <Link
            to="/trainers"
            className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            All coaching staff ({trainers.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trainers.slice(0, 4).map((trainer) => (
            <div
              key={trainer.id}
              className="bg-[#101522] border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-64 overflow-hidden bg-neutral-900">
                  <img
                    src={trainer.profileImage}
                    alt={trainer.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#101522] via-transparent to-transparent" />
                </div>

                <div className="p-5 space-y-2 -mt-8 relative z-10">
                  <h3 className="text-lg font-bold text-white font-display">{trainer.name}</h3>
                  <p className="text-xs text-amber-400 font-medium">{trainer.specialization}</p>
                  <p className="text-[11px] text-neutral-400">{trainer.experience}</p>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light line-clamp-3 pt-1">
                    {trainer.bio}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg border border-neutral-800 transition-colors"
                >
                  Book 1-on-1 Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. DYNAMIC MEMBERSHIP PLANS (Prices update live from CMS!) */}
      <section id="memberships" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
            FLEXIBLE COMMITMENT
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
            Membership Plans
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400">
            Transparent pricing with zero hidden fees. Upgrade or pause anytime with desk assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 relative ${
                plan.isPopular
                  ? 'bg-gradient-to-b from-[#182033] to-[#101522] border-2 border-amber-500/80 shadow-2xl shadow-amber-500/10'
                  : 'bg-[#101522] border border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-neutral-950 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                  Most Popular
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white font-display">{plan.name}</h3>
                  <p className="text-xs text-neutral-400">{plan.duration}</p>
                </div>

                <div className="pt-2 pb-2">
                  <span className="text-3xl sm:text-4xl font-black text-white font-display font-mono tabular-nums">
                    ₹{plan.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs text-neutral-400 ml-1">/ {plan.duration}</span>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed font-light">
                  {plan.description}
                </p>

                <div className="pt-3 border-t border-neutral-800/80 space-y-2">
                  <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Included Privileges:
                  </p>
                  <ul className="space-y-2">
                    {plan.benefits.map((b, i) => (
                      <li key={i} className="text-xs text-neutral-300 flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setSelectedPlanForPayment(plan)}
                  className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    plan.isPopular
                      ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700'
                  }`}
                >
                  Choose {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. DYNAMIC GALLERY & FACILITY SHOWCASE */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800 pb-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              THE CLUB ENVIRONMENT
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Facility Gallery
            </h2>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex flex-wrap items-center gap-1 bg-neutral-900/80 p-1 rounded-xl border border-neutral-800 text-xs">
            {['All', 'Gym', 'Equipment', 'Training'].map((cat) => (
              <button
                key={cat}
                onClick={() => setGalleryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  galleryFilter === cat
                    ? 'bg-neutral-800 text-amber-400 font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredGallery.slice(0, 8).map((item) => (
            <div
              key={item.id}
              className="group relative h-64 rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider font-mono">
                  {item.category}
                </span>
                <h4 className="text-sm font-bold text-white font-display">{item.title}</h4>
                {item.description && (
                  <p className="text-[11px] text-neutral-300 line-clamp-2 mt-1">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. DYNAMIC TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              REAL TRANSFORMATIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Member Experiences
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="bg-[#101522] border border-neutral-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: test.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-light italic">
                    "{test.review}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-neutral-800/80">
                  <img
                    src={test.profileImage}
                    alt={test.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">{test.name}</h4>
                    <p className="text-[11px] text-neutral-400">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. GYM TIMINGS & CONTACT PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#101622] border border-neutral-800 rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              OPEN 7 DAYS A WEEK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Operating Schedule & Access
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Early morning lifting or late evening conditioning, Fitzone provides clean, climate-controlled workout hours suited for ambitious professionals.
            </p>

            {timings && (
              <div className="bg-neutral-900/90 rounded-2xl p-4 border border-neutral-800 divide-y divide-neutral-800/60 text-xs">
                {Object.entries(timings).map(([day, val]) => (
                  <div key={day} className="py-2 flex justify-between items-center text-neutral-300">
                    <span className="font-semibold text-white">{day}</span>
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
            )}
          </div>

          <div className="bg-neutral-900/60 p-8 rounded-2xl border border-neutral-800 space-y-6">
            <h3 className="text-lg font-bold text-white font-display">Quick Inquiry or Free Pass</h3>
            <p className="text-xs text-neutral-400">
              Not sure which plan matches your goals? Schedule a personalized facility tour or movement assessment.
            </p>

            <div className="space-y-3 text-xs text-neutral-300">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 font-bold">
                  📍
                </span>
                <span>{contact?.address || 'Koramangala 4th Block, Bengaluru'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 font-bold">
                  📞
                </span>
                <span>{contact?.phone || '+91 98765 43210'}</span>
              </div>
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-amber-500/15"
            >
              Book Complimentary Tour
            </button>
          </div>
        </div>
      </section>

      {/* 10. CALL TO ACTION BANNER */}
      {cta && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-8 sm:p-14 text-center text-neutral-950 shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight">
                {cta.title}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-neutral-900/90 leading-relaxed">
                {cta.description}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setIsBookingOpen(true)}
                  className="px-8 py-3.5 bg-neutral-950 hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-transform hover:scale-105 shadow-xl"
                >
                  {cta.buttonText || 'Claim Your 1-Day VIP Pass'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Payment Checkout Modal */}
      <PaymentModal
        plan={selectedPlanForPayment}
        isOpen={Boolean(selectedPlanForPayment)}
        onClose={() => setSelectedPlanForPayment(null)}
        onSuccess={() => {
          setSelectedPlanForPayment(null);
          alert('Membership successfully purchased! Check your user dashboard for plan status.');
        }}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        trainers={trainers}
        programs={programs}
      />

      {/* Video Player Modal */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-4xl bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800">
            <button
              onClick={() => setActiveVideoModal(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video w-full">
              {activeVideoModal.includes('youtube.com') || activeVideoModal.includes('youtu.be') ? (
                <iframe
                  src={
                    activeVideoModal.includes('watch?v=')
                      ? activeVideoModal.replace('watch?v=', 'embed/')
                      : activeVideoModal
                  }
                  title="Gym Video"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={activeVideoModal} controls autoPlay className="w-full h-full object-contain" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

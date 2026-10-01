import bcrypt from 'bcryptjs';
import {
  Trainer,
  MembershipPlan,
  Program,
  GalleryItem,
  VideoItem,
  Testimonial,
  Offer,
  GymTimings,
  ContactInfo,
  HomepageContent,
  User,
  Booking,
  NotificationItem,
} from '../../src/types/index';

export interface DatabaseState {
  homepage: HomepageContent;
  membershipPlans: MembershipPlan[];
  trainers: Trainer[];
  programs: Program[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  testimonials: Testimonial[];
  offers: Offer[];
  gymTimings: GymTimings;
  contactInfo: ContactInfo;
  users: User[];
  bookings: Booking[];
  notifications: NotificationItem[];
}

const adminPasswordHash = bcrypt.hashSync('admin123', 10);
const memberPasswordHash = bcrypt.hashSync('member123', 10);

export const getInitialData = (): DatabaseState => ({
  homepage: {
    gymName: 'FITZONE FITNESS',
    tagline: 'Forged in Iron, Built for Life',
    logoUrl: '',
    hero: {
      title: 'UNLEASH YOUR HIGHEST POTENTIAL',
      subtitle:
        'Bengaluru’s premier high-performance strength and athletic conditioning club. World-class equipment, elite coaching, and an uncompromising standard of fitness.',
      image: '/src/assets/images/hero_gym_workout_1790868392603.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=eaRQF-7hhmo',
      primaryButtonText: 'Explore Memberships',
      primaryButtonLink: '#memberships',
      secondaryButtonText: 'Book Free Trial',
      secondaryButtonLink: '#booking',
    },
    stats: {
      members: '2,400+',
      trainers: '18',
      yearsExperience: '11',
      programs: '14',
    },
    about: {
      title: 'Engineered for Performance. Driven by Community.',
      subtitle: 'ABOUT FITZONE FITNESS',
      description:
        'Fitzone Fitness was built on a simple philosophy: eliminate distractions and provide the absolute best training environment possible. From custom Eleiko barbells and calibrated plates to biomechanically perfected selectorized machines and recovery saunas, every square foot is optimized for athletic progression.',
      mission:
        'To empower individuals to transcend physical limits through science-backed training, relentless discipline, and expert guidance.',
      vision:
        'To establish the benchmark for modern physical training clubs across South Asia, integrating strength training, recovery, and metabolic health.',
      facilities: [
        'Over 14,000 sq.ft of Olympic lifting platforms and power cages',
        'Custom Eleiko & Prime Fitness selectorized resistance equipment',
        'Turf sprint lanes with prowler sleds & rogue echo bikes',
        'Infrared contrast therapy saunas & recovery lounge',
        'Certified sports nutrition and body composition laboratory',
        'Luxury locker rooms with digital keyless lockers and rain showers',
      ],
      equipmentOverview:
        'Calibrated steel plates, competition benches, dual cable towers, and specialized cambered bars sourced from premier international manufacturers.',
      whyChooseUs: [
        'Zero waiting for equipment with dedicated high-density lifting bays',
        'Every personal trainer is CSCS, ACE, or NSCA certified',
        'Free monthly 3D InBody scan & posture assessment for all members',
        'Clean, climate-controlled air purification system running 24/7',
      ],
      image: '/src/assets/images/gym_interior_floor_1790868429405.jpg',
    },
    cta: {
      title: 'Ready to Transform Your Physique and Mindset?',
      description:
        'Join the Fitzone community today. Experience a training culture where dedication yields tangible, lasting results.',
      buttonText: 'Claim Your 1-Day VIP Pass',
      buttonLink: '#booking',
    },
  },

  membershipPlans: [
    {
      id: 'plan-1',
      name: 'Monthly Starter',
      price: 1199,
      duration: '1 Month',
      description: 'Ideal for trying out the facility and kicking off your routine.',
      benefits: [
        'Full gym floor access during all operating hours',
        'Complimentary locker & shower amenities',
        'Initial fitness & movement baseline screening',
        'Standard access to mobile member app',
      ],
      isPopular: false,
      status: 'active',
    },
    {
      id: 'plan-2',
      name: 'Quarterly Accelerator',
      price: 3199,
      duration: '3 Months',
      description: 'Our most popular entry program designed for steady body recomposition.',
      benefits: [
        'Full gym floor & recovery zone access',
        '1 complimentary Personal Training strategy session',
        'Bi-weekly InBody body-composition scans',
        '10% off pro shop supplements and protein bar',
        'Free guest pass every 30 days',
      ],
      isPopular: true,
      status: 'active',
    },
    {
      id: 'plan-3',
      name: 'Annual Championship',
      price: 9999,
      duration: '12 Months',
      description: 'Comprehensive year-long commitment with maximum privileges and value.',
      benefits: [
        'Unlimited access 365 days a year',
        '4 complimentary 1-on-1 PT coaching sessions',
        'Dedicated locker reservation with laundry service',
        'Free access to all weekend group masterclasses',
        'Priority booking for sauna & contrast therapy',
        'Unlimited guest privileges (up to 2 guests/month)',
      ],
      isPopular: false,
      status: 'active',
    },
    {
      id: 'plan-4',
      name: 'Elite Athlete & PT Tier',
      price: 14999,
      duration: '3 Months VIP',
      description: 'Intensive coaching bundle with 24 dedicated personal training sessions.',
      benefits: [
        '24 personal training sessions with Senior Master Coach',
        'Bespoke progressive overload workout programming',
        'Daily macronutrient & meal planning guidance',
        'Full recovery suite & infrared sauna access',
        'Direct WhatsApp support from head trainer',
      ],
      isPopular: false,
      status: 'active',
    },
  ],

  trainers: [
    {
      id: 'trainer-1',
      name: 'Marcus Vance',
      profileImage: '/src/assets/images/trainer_male_strength_1790868406593.jpg',
      specialization: 'Strength & Conditioning / Powerlifting',
      experience: '9+ Years Experience',
      phone: '+91 98451 22345',
      email: 'marcus@fitzone.com',
      bio: 'Former national competitive powerlifter and CSCS certified coach. Specializes in biomechanics, spine-sparing lifting technique, and raw power development.',
      socialLinks: {
        instagram: 'https://instagram.com/marcusvance_fit',
        linkedin: 'https://linkedin.com/in/marcusvance',
      },
      status: 'active',
    },
    {
      id: 'trainer-2',
      name: 'Elena Rostova',
      profileImage: '/src/assets/images/trainer_female_hiit_1790868418303.jpg',
      specialization: 'HIIT & Athletic Conditioning',
      experience: '7+ Years Experience',
      phone: '+91 98451 88712',
      email: 'elena@fitzone.com',
      bio: 'Ex-triathlon trainer and functional movement specialist. Passionate about metabolic conditioning, body recomp, and developing cardiovascular stamina.',
      socialLinks: {
        instagram: 'https://instagram.com/elena.rostova.fit',
        twitter: 'https://twitter.com/elenarostova',
      },
      status: 'active',
    },
    {
      id: 'trainer-3',
      name: 'Vikram Sengupta',
      profileImage: '/src/assets/images/trainer_male_strength_1790868406593.jpg',
      specialization: 'Bodybuilding & Hypertrophy',
      experience: '11+ Years Experience',
      phone: '+91 98452 33419',
      email: 'vikram@fitzone.com',
      bio: 'Classic physique competitor and certified sports nutritionist. Guided over 300 athletes through successful fat-loss transformations and lean mass phases.',
      socialLinks: {
        instagram: 'https://instagram.com/vikram_physique',
      },
      status: 'active',
    },
    {
      id: 'trainer-4',
      name: 'Priya Sharma',
      profileImage: '/src/assets/images/trainer_female_hiit_1790868418303.jpg',
      specialization: 'Mobility, Yoga & Functional Core',
      experience: '6+ Years Experience',
      phone: '+91 98453 99014',
      email: 'priya@fitzone.com',
      bio: 'Combines corrective exercise with high-performance mobility protocols to resolve posture imbalances, enhance joint resilience, and prevent athletic injury.',
      socialLinks: {
        instagram: 'https://instagram.com/priyasharma.movement',
      },
      status: 'active',
    },
  ],

  programs: [
    {
      id: 'prog-1',
      name: 'Hypertrophy & Muscle Building',
      description: 'Scientifically sequenced volume training to trigger maximum myofibrillar hypertrophy and muscle density.',
      image: '/src/assets/images/hero_gym_workout_1790868392603.jpg',
      duration: '12 Weeks',
      difficulty: 'Intermediate',
      benefits: [
        'Periodized 4-day & 5-day training splits',
        'Targeted isolation and compound movement mechanics',
        'Progressive log tracking templates',
      ],
      status: 'active',
    },
    {
      id: 'prog-2',
      name: 'Rapid Fat Loss & HIIT Burn',
      description: 'Metabolic resistance training and high-intensity interval conditioning designed for accelerated caloric expenditure.',
      image: '/src/assets/images/gym_interior_floor_1790868429405.jpg',
      duration: '8 Weeks',
      difficulty: 'All Levels',
      benefits: [
        'EPOC afterburn training methodologies',
        'Kettlebell, assault bike, and battle rope complexes',
        'Caloric deficit meal planning guide',
      ],
      status: 'active',
    },
    {
      id: 'prog-3',
      name: 'Foundational Strength & Power',
      description: 'Master the barbell squat, bench press, deadlift, and overhead press with textbook biomechanics.',
      image: '/src/assets/images/hero_gym_workout_1790868392603.jpg',
      duration: '16 Weeks',
      difficulty: 'Advanced',
      benefits: [
        'Linear and undulating percentage-based periodization',
        'Video bar-path analysis with coaches',
        'Access to specialized power bars and calibrated plates',
      ],
      status: 'active',
    },
    {
      id: 'prog-4',
      name: 'Beginner Foundations 101',
      description: 'Zero intimidation program designed to build confidence, movement literacy, and lasting exercise habits.',
      image: '/src/assets/images/gym_interior_floor_1790868429405.jpg',
      duration: '6 Weeks',
      difficulty: 'Beginner',
      benefits: [
        '1-on-1 machine walkthrough and safety orientation',
        'Low-impact joint conditioning routines',
        'Habit-stacking and lifestyle integration manual',
      ],
      status: 'active',
    },
  ],

  gallery: [
    {
      id: 'gal-1',
      imageUrl: '/src/assets/images/hero_gym_workout_1790868392603.jpg',
      title: 'Free Weight Zone & Dumbbell Racks',
      category: 'Gym',
      description: 'Custom urethane dumbbells up to 60kg with heavy-duty commercial benches.',
      status: 'active',
      createdAt: '2026-09-15',
    },
    {
      id: 'gal-2',
      imageUrl: '/src/assets/images/gym_interior_floor_1790868429405.jpg',
      title: 'Olympic Lifting Platforms',
      category: 'Equipment',
      description: 'Drop-rated bamboo and rubber platforms with Eleiko competition bumpers.',
      status: 'active',
      createdAt: '2026-09-18',
    },
    {
      id: 'gal-3',
      imageUrl: '/src/assets/images/trainer_male_strength_1790868406593.jpg',
      title: 'One-on-One Coaching in Action',
      category: 'Training',
      description: 'Coach Marcus assessing deadlift hip hinge mechanics.',
      status: 'active',
      createdAt: '2026-09-22',
    },
    {
      id: 'gal-4',
      imageUrl: '/src/assets/images/trainer_female_hiit_1790868418303.jpg',
      title: 'Functional Turf & Sprint Conditioning',
      category: 'Training',
      description: 'Athletic agility ladders, sled pushes, and plyometric boxes.',
      status: 'active',
      createdAt: '2026-09-25',
    },
  ],

  videos: [
    {
      id: 'vid-1',
      title: 'Fitzone Club Walkthrough & Facilities',
      videoUrl: 'https://www.youtube.com/watch?v=eaRQF-7hhmo',
      thumbnail: '/src/assets/images/gym_interior_floor_1790868429405.jpg',
      category: 'Facility Tour',
      description: 'Take a cinematic walk through our lifting bays, cardio deck, recovery zone, and locker suites.',
      status: 'active',
      createdAt: '2026-09-10',
    },
    {
      id: 'vid-2',
      title: 'The Art of the Hip Hinge & Barbell Pull',
      videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
      thumbnail: '/src/assets/images/hero_gym_workout_1790868392603.jpg',
      category: 'Tutorial',
      description: 'Coach Marcus Vance breaks down setup, lat tension, and wedge mechanics for heavy pulls.',
      status: 'active',
      createdAt: '2026-09-12',
    },
  ],

  testimonials: [
    {
      id: 'test-1',
      name: 'Rohan Mehra',
      role: 'Software Architect · Member for 18 Months',
      profileImage: '/src/assets/images/trainer_male_strength_1790868406593.jpg',
      review:
        'I have trained at gyms across Europe and India, and Fitzone easily stands at the pinnacle. The equipment quality, air filtration, and respectful training culture are unmatched. Dropped 12kg of fat while adding 40kg to my deadlift.',
      rating: 5,
      date: 'September 2026',
      status: 'approved',
    },
    {
      id: 'test-2',
      name: 'Ananya Deshmukh',
      role: 'Product Designer · Member for 8 Months',
      profileImage: '/src/assets/images/trainer_female_hiit_1790868418303.jpg',
      review:
        'The atmosphere is intense yet welcoming. Elena’s conditioning program revolutionized my endurance. I never dread coming to workout here because the coaching staff genuinely cares about your longevity.',
      rating: 5,
      date: 'August 2026',
      status: 'approved',
    },
    {
      id: 'test-3',
      name: 'Sameer Patel',
      role: 'Marathoner & Entrepreneur',
      profileImage: '/src/assets/images/trainer_male_strength_1790868406593.jpg',
      review:
        'The recovery sauna and contrast therapy alone justify the membership. Fitzone keeps equipment pristine, no broken cables or missing dumbbells ever.',
      rating: 5,
      date: 'July 2026',
      status: 'approved',
    },
  ],

  offers: [
    {
      id: 'off-1',
      title: 'Festive Season Kickstart: 20% OFF Annual Tiers',
      description: 'Commit to 12 months of peak health and receive a complimentary 4-session Personal Coaching pack + nutritional consultation.',
      discount: '20% OFF',
      bannerImage: '/src/assets/images/hero_gym_workout_1790868392603.jpg',
      startDate: '2026-10-01',
      endDate: '2026-10-31',
      buttonText: 'Claim 20% Discount',
      buttonLink: '#memberships',
      status: 'active',
    },
    {
      id: 'off-2',
      title: 'Buddy Workout Pass: 1+1 Month Bonus',
      description: 'Sign up with a workout partner on any quarterly membership and both get an extra 30 days added for free.',
      discount: 'FREE MONTH',
      bannerImage: '/src/assets/images/gym_interior_floor_1790868429405.jpg',
      startDate: '2026-10-01',
      endDate: '2026-11-15',
      buttonText: 'Register With Buddy',
      buttonLink: '#booking',
      status: 'active',
    },
  ],

  gymTimings: {
    Monday: { open: '05:30 AM', close: '11:00 PM', isClosed: false },
    Tuesday: { open: '05:30 AM', close: '11:00 PM', isClosed: false },
    Wednesday: { open: '05:30 AM', close: '11:00 PM', isClosed: false },
    Thursday: { open: '05:30 AM', close: '11:00 PM', isClosed: false },
    Friday: { open: '05:30 AM', close: '11:00 PM', isClosed: false },
    Saturday: { open: '06:00 AM', close: '10:00 PM', isClosed: false },
    Sunday: { open: '07:00 AM', close: '08:00 PM', isClosed: false },
  },

  contactInfo: {
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'contact@fitzone.com',
    address: '42 Silicon Boulevard, 4th Block Koramangala, Bengaluru, Karnataka 560034',
    googleMapsUrl: 'https://maps.google.com/?q=Koramangala+Bengaluru',
    instagram: 'https://instagram.com/fitzone.fitness',
    facebook: 'https://facebook.com/fitzonefitness',
    youtube: 'https://youtube.com/@fitzonefitness',
    openingHoursPreview: 'Mon - Fri: 5:30 AM - 11:00 PM | Sat - Sun: 6:00 AM - 8:00 PM',
  },

  users: [
    {
      id: 'usr-admin',
      name: 'Vikramaditya (Owner)',
      email: 'admin@fitzone.com',
      phone: '+91 98765 43210',
      password: adminPasswordHash,
      role: 'admin',
      status: 'active',
      createdAt: '2026-01-01',
    },
    {
      id: 'usr-member-1',
      name: 'Aditya Sen',
      email: 'member@fitzone.com',
      phone: '+91 99887 76655',
      password: memberPasswordHash,
      role: 'user',
      status: 'active',
      membership: {
        planId: 'plan-2',
        planName: 'Quarterly Accelerator',
        price: 3199,
        startDate: '2026-09-01',
        expiryDate: '2026-12-01',
        status: 'active',
      },
      assignedProgram: 'Hypertrophy & Muscle Building',
      createdAt: '2026-09-01',
    },
    {
      id: 'usr-member-2',
      name: 'Shreya Kulkarni',
      email: 'shreya@gmail.com',
      phone: '+91 98112 33445',
      password: memberPasswordHash,
      role: 'user',
      status: 'active',
      membership: {
        planId: 'plan-3',
        planName: 'Annual Championship',
        price: 9999,
        startDate: '2026-08-15',
        expiryDate: '2027-08-15',
        status: 'active',
      },
      assignedProgram: 'Rapid Fat Loss & HIIT Burn',
      createdAt: '2026-08-15',
    },
  ],

  bookings: [
    {
      id: 'bk-101',
      userId: 'usr-member-1',
      userName: 'Aditya Sen',
      userEmail: 'member@fitzone.com',
      userPhone: '+91 99887 76655',
      bookingType: 'Personal Trainer',
      trainerId: 'trainer-1',
      trainerName: 'Marcus Vance',
      programName: 'Strength Coaching',
      date: '2026-10-03',
      time: '07:30 AM',
      notes: 'Focus on deadlift lockout and barbell setup.',
      status: 'Approved',
      createdAt: '2026-09-30',
    },
    {
      id: 'bk-102',
      userId: 'usr-member-2',
      userName: 'Shreya Kulkarni',
      userEmail: 'shreya@gmail.com',
      userPhone: '+91 98112 33445',
      bookingType: 'Free Trial',
      date: '2026-10-04',
      time: '06:00 PM',
      notes: 'First time visiting, interested in contrast sauna & HIIT.',
      status: 'Pending',
      createdAt: '2026-10-01',
    },
  ],

  notifications: [
    {
      id: 'notif-1',
      title: 'Welcome to Fitzone Fitness!',
      message: 'Explore your member dashboard to review your active plan and upcoming coaching appointments.',
      date: '2026-09-01',
      type: 'general',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Coaching Session Confirmed',
      message: 'Your personal training session with Marcus Vance is scheduled for Oct 3 at 07:30 AM.',
      date: '2026-09-30',
      type: 'booking',
      read: false,
    },
  ],
});

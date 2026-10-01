export interface Trainer {
  id: string;
  name: string;
  profileImage: string;
  specialization: string;
  experience: string;
  phone: string;
  email: string;
  bio: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  status: 'active' | 'inactive';
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  benefits: string[];
  image?: string;
  isPopular: boolean;
  status: 'active' | 'inactive';
}

export interface Program {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  benefits: string[];
  status: 'active' | 'inactive';
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
  category: 'Gym' | 'Equipment' | 'Training' | 'Members' | 'Transformation' | 'Events';
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface VideoItem {
  id: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
  category: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  profileImage: string;
  review: string;
  rating: number;
  date: string;
  status: 'approved' | 'pending' | 'hidden';
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  bannerImage: string;
  startDate: string;
  endDate: string;
  buttonText: string;
  buttonLink: string;
  status: 'active' | 'inactive';
}

export interface GymTimingsDay {
  open: string;
  close: string;
  isClosed: boolean;
}

export type GymTimings = Record<string, GymTimingsDay>;

export interface ContactInfo {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  googleMapsUrl: string;
  instagram: string;
  facebook: string;
  youtube: string;
  openingHoursPreview: string;
}

export interface HomepageContent {
  gymName: string;
  tagline: string;
  logoUrl?: string;
  hero: {
    title: string;
    subtitle: string;
    image: string;
    videoUrl?: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
  };
  stats: {
    members: string;
    trainers: string;
    yearsExperience: string;
    programs: string;
  };
  about: {
    title: string;
    subtitle: string;
    description: string;
    mission: string;
    vision: string;
    facilities: string[];
    equipmentOverview: string;
    whyChooseUs: string[];
    image: string;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  membership?: {
    planId: string;
    planName: string;
    price: number;
    startDate: string;
    expiryDate: string;
    status: 'active' | 'expired' | 'pending';
  };
  assignedProgram?: string;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  bookingType: 'Free Trial' | 'Personal Trainer' | 'Workout Program' | 'Class';
  trainerId?: string;
  trainerName?: string;
  programId?: string;
  programName?: string;
  date: string;
  time: string;
  notes?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Completed';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId?: string; // target user or empty for all
  title: string;
  message: string;
  date: string;
  type: 'general' | 'booking' | 'membership' | 'promo';
  read: boolean;
}

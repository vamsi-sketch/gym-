import axios from 'axios';
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
  NotificationItem,
} from '../types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitzone_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData: { name: string; email: string; phone?: string; password: string }) => {
    const res = await api.post<{ success: boolean; token: string; user: User }>('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get<{ success: boolean; user: User }>('/auth/me');
    return res.data;
  },
  updateProfile: async (data: { name?: string; phone?: string }) => {
    const res = await api.put<{ success: boolean; user: User }>('/auth/profile', data);
    return res.data;
  },

  // Homepage CMS
  getHomepage: async () => {
    const res = await api.get<{ success: boolean; data: HomepageContent }>('/homepage');
    return res.data.data;
  },
  updateHomepage: async (data: Partial<HomepageContent>) => {
    const res = await api.put<{ success: boolean; data: HomepageContent; message: string }>('/homepage', data);
    return res.data;
  },

  // Membership Plans
  getMemberships: async (all: boolean = false) => {
    const res = await api.get<{ success: boolean; data: MembershipPlan[] }>(`/memberships${all ? '?all=true' : ''}`);
    return res.data.data;
  },
  getMembershipById: async (id: string) => {
    const res = await api.get<{ success: boolean; data: MembershipPlan }>(`/memberships/${id}`);
    return res.data.data;
  },
  createMembership: async (data: Partial<MembershipPlan>) => {
    const res = await api.post<{ success: boolean; data: MembershipPlan; message: string }>('/memberships', data);
    return res.data;
  },
  updateMembership: async (id: string, data: Partial<MembershipPlan>) => {
    const res = await api.put<{ success: boolean; data: MembershipPlan; message: string }>(`/memberships/${id}`, data);
    return res.data;
  },
  deleteMembership: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/memberships/${id}`);
    return res.data;
  },

  // Trainers
  getTrainers: async (all: boolean = false) => {
    const res = await api.get<{ success: boolean; data: Trainer[] }>(`/trainers${all ? '?all=true' : ''}`);
    return res.data.data;
  },
  createTrainer: async (data: Partial<Trainer>) => {
    const res = await api.post<{ success: boolean; data: Trainer; message: string }>('/trainers', data);
    return res.data;
  },
  updateTrainer: async (id: string, data: Partial<Trainer>) => {
    const res = await api.put<{ success: boolean; data: Trainer; message: string }>(`/trainers/${id}`, data);
    return res.data;
  },
  deleteTrainer: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/trainers/${id}`);
    return res.data;
  },

  // Programs
  getPrograms: async (all: boolean = false) => {
    const res = await api.get<{ success: boolean; data: Program[] }>(`/programs${all ? '?all=true' : ''}`);
    return res.data.data;
  },
  createProgram: async (data: Partial<Program>) => {
    const res = await api.post<{ success: boolean; data: Program; message: string }>('/programs', data);
    return res.data;
  },
  updateProgram: async (id: string, data: Partial<Program>) => {
    const res = await api.put<{ success: boolean; data: Program; message: string }>(`/programs/${id}`, data);
    return res.data;
  },
  deleteProgram: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/programs/${id}`);
    return res.data;
  },

  // Gallery
  getGallery: async (all: boolean = false) => {
    const res = await api.get<{ success: boolean; data: GalleryItem[] }>(`/gallery${all ? '?all=true' : ''}`);
    return res.data.data;
  },
  createGalleryItem: async (data: Partial<GalleryItem>) => {
    const res = await api.post<{ success: boolean; data: GalleryItem; message: string }>('/gallery', data);
    return res.data;
  },
  updateGalleryItem: async (id: string, data: Partial<GalleryItem>) => {
    const res = await api.put<{ success: boolean; data: GalleryItem; message: string }>(`/gallery/${id}`, data);
    return res.data;
  },
  deleteGalleryItem: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/gallery/${id}`);
    return res.data;
  },

  // Videos
  getVideos: async (all: boolean = false) => {
    const res = await api.get<{ success: boolean; data: VideoItem[] }>(`/videos${all ? '?all=true' : ''}`);
    return res.data.data;
  },
  createVideo: async (data: Partial<VideoItem>) => {
    const res = await api.post<{ success: boolean; data: VideoItem; message: string }>('/videos', data);
    return res.data;
  },
  updateVideo: async (id: string, data: Partial<VideoItem>) => {
    const res = await api.put<{ success: boolean; data: VideoItem; message: string }>(`/videos/${id}`, data);
    return res.data;
  },
  deleteVideo: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/videos/${id}`);
    return res.data;
  },

  // Testimonials
  getTestimonials: async (all: boolean = false) => {
    const res = await api.get<{ success: boolean; data: Testimonial[] }>(`/testimonials${all ? '?all=true' : ''}`);
    return res.data.data;
  },
  createTestimonial: async (data: Partial<Testimonial>) => {
    const res = await api.post<{ success: boolean; data: Testimonial; message: string }>('/testimonials', data);
    return res.data;
  },
  updateTestimonial: async (id: string, data: Partial<Testimonial>) => {
    const res = await api.put<{ success: boolean; data: Testimonial; message: string }>(`/testimonials/${id}`, data);
    return res.data;
  },
  deleteTestimonial: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/testimonials/${id}`);
    return res.data;
  },

  // Offers
  getOffers: async (all: boolean = false) => {
    const res = await api.get<{ success: boolean; data: Offer[] }>(`/offers${all ? '?all=true' : ''}`);
    return res.data.data;
  },
  createOffer: async (data: Partial<Offer>) => {
    const res = await api.post<{ success: boolean; data: Offer; message: string }>('/offers', data);
    return res.data;
  },
  updateOffer: async (id: string, data: Partial<Offer>) => {
    const res = await api.put<{ success: boolean; data: Offer; message: string }>(`/offers/${id}`, data);
    return res.data;
  },
  deleteOffer: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/offers/${id}`);
    return res.data;
  },

  // Timings & Contact Info
  getTimings: async () => {
    const res = await api.get<{ success: boolean; data: GymTimings }>('/timings');
    return res.data.data;
  },
  updateTimings: async (timings: GymTimings) => {
    const res = await api.put<{ success: boolean; data: GymTimings; message: string }>('/timings', timings);
    return res.data;
  },
  getContact: async () => {
    const res = await api.get<{ success: boolean; data: ContactInfo }>('/contact');
    return res.data.data;
  },
  updateContact: async (contact: Partial<ContactInfo>) => {
    const res = await api.put<{ success: boolean; data: ContactInfo; message: string }>('/contact', contact);
    return res.data;
  },

  // Bookings
  getBookings: async () => {
    const res = await api.get<{ success: boolean; data: Booking[] }>('/bookings');
    return res.data.data;
  },
  createBooking: async (bookingData: Partial<Booking>) => {
    const res = await api.post<{ success: boolean; data: Booking; message: string }>('/bookings', bookingData);
    return res.data;
  },
  updateBooking: async (id: string, updates: Partial<Booking>) => {
    const res = await api.put<{ success: boolean; data: Booking; message: string }>(`/bookings/${id}`, updates);
    return res.data;
  },
  deleteBooking: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/bookings/${id}`);
    return res.data;
  },

  // Members Management (Admin)
  getMembers: async () => {
    const res = await api.get<{ success: boolean; data: User[] }>('/members');
    return res.data.data;
  },
  createMember: async (userData: Partial<User>) => {
    const res = await api.post<{ success: boolean; data: User; message: string }>('/members', userData);
    return res.data;
  },
  updateMember: async (id: string, updates: Partial<User>) => {
    const res = await api.put<{ success: boolean; data: User; message: string }>(`/members/${id}`, updates);
    return res.data;
  },
  deleteMember: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/members/${id}`);
    return res.data;
  },

  // File Upload (Ready for Supabase Storage)
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<{ success: boolean; url: string; filename: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // Payment (Modular Razorpay simulation)
  createPaymentOrder: async (planId: string) => {
    const res = await api.post<{ success: boolean; order: any; key: string }>('/payments/create-order', { planId });
    return res.data;
  },
  verifyPayment: async (planId: string, paymentId: string, orderId: string) => {
    const res = await api.post<{ success: boolean; message: string; user: User; receipt: any }>('/payments/verify', {
      planId,
      paymentId,
      orderId,
    });
    return res.data;
  },

  // Notifications
  getNotifications: async () => {
    const res = await api.get<{ success: boolean; data: NotificationItem[] }>('/notifications');
    return res.data.data;
  },
  markNotificationRead: async (id: string) => {
    const res = await api.put<{ success: boolean }>(`/notifications/${id}/read`);
    return res.data;
  },

  // Admin Stats
  getAdminStats: async () => {
    const res = await api.get<{ success: boolean; data: any }>('/admin/stats');
    return res.data.data;
  },
  resetDatabase: async () => {
    const res = await api.post<{ success: boolean; message: string }>('/admin/reset');
    return res.data;
  },
};

export default api;

import { DatabaseState, getInitialData } from '../data/seedData';
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
} from '../../src/types/index';

class GymRepository {
  private state: DatabaseState;

  constructor() {
    this.state = getInitialData();
  }

  // Reset to initial (useful for demo/testing)
  public resetToDefault(): void {
    this.state = getInitialData();
  }

  // --- Homepage ---
  public getHomepage(): HomepageContent {
    return { ...this.state.homepage };
  }

  public updateHomepage(data: Partial<HomepageContent>): HomepageContent {
    this.state.homepage = {
      ...this.state.homepage,
      ...data,
      hero: { ...this.state.homepage.hero, ...(data.hero || {}) },
      stats: { ...this.state.homepage.stats, ...(data.stats || {}) },
      about: { ...this.state.homepage.about, ...(data.about || {}) },
      cta: { ...this.state.homepage.cta, ...(data.cta || {}) },
    };
    return this.getHomepage();
  }

  // --- Membership Plans ---
  public getMemberships(onlyActive: boolean = false): MembershipPlan[] {
    if (onlyActive) {
      return this.state.membershipPlans.filter((p) => p.status === 'active');
    }
    return [...this.state.membershipPlans];
  }

  public getMembershipById(id: string): MembershipPlan | undefined {
    return this.state.membershipPlans.find((p) => p.id === id);
  }

  public createMembership(plan: Omit<MembershipPlan, 'id'>): MembershipPlan {
    const newPlan: MembershipPlan = {
      ...plan,
      id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    this.state.membershipPlans.push(newPlan);
    return newPlan;
  }

  public updateMembership(id: string, updates: Partial<MembershipPlan>): MembershipPlan | null {
    const index = this.state.membershipPlans.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.state.membershipPlans[index] = {
      ...this.state.membershipPlans[index],
      ...updates,
    };
    return this.state.membershipPlans[index];
  }

  public deleteMembership(id: string): boolean {
    const prevLen = this.state.membershipPlans.length;
    this.state.membershipPlans = this.state.membershipPlans.filter((p) => p.id !== id);
    return this.state.membershipPlans.length < prevLen;
  }

  // --- Trainers ---
  public getTrainers(onlyActive: boolean = false): Trainer[] {
    if (onlyActive) {
      return this.state.trainers.filter((t) => t.status === 'active');
    }
    return [...this.state.trainers];
  }

  public getTrainerById(id: string): Trainer | undefined {
    return this.state.trainers.find((t) => t.id === id);
  }

  public createTrainer(trainer: Omit<Trainer, 'id'>): Trainer {
    const newTrainer: Trainer = {
      ...trainer,
      id: `trainer-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    this.state.trainers.push(newTrainer);
    return newTrainer;
  }

  public updateTrainer(id: string, updates: Partial<Trainer>): Trainer | null {
    const index = this.state.trainers.findIndex((t) => t.id === id);
    if (index === -1) return null;
    this.state.trainers[index] = {
      ...this.state.trainers[index],
      ...updates,
    };
    return this.state.trainers[index];
  }

  public deleteTrainer(id: string): boolean {
    const prevLen = this.state.trainers.length;
    this.state.trainers = this.state.trainers.filter((t) => t.id !== id);
    return this.state.trainers.length < prevLen;
  }

  // --- Programs ---
  public getPrograms(onlyActive: boolean = false): Program[] {
    if (onlyActive) {
      return this.state.programs.filter((pr) => pr.status === 'active');
    }
    return [...this.state.programs];
  }

  public getProgramById(id: string): Program | undefined {
    return this.state.programs.find((pr) => pr.id === id);
  }

  public createProgram(prog: Omit<Program, 'id'>): Program {
    const newProg: Program = {
      ...prog,
      id: `prog-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    this.state.programs.push(newProg);
    return newProg;
  }

  public updateProgram(id: string, updates: Partial<Program>): Program | null {
    const index = this.state.programs.findIndex((p) => p.id === id);
    if (index === -1) return null;
    this.state.programs[index] = {
      ...this.state.programs[index],
      ...updates,
    };
    return this.state.programs[index];
  }

  public deleteProgram(id: string): boolean {
    const prevLen = this.state.programs.length;
    this.state.programs = this.state.programs.filter((p) => p.id !== id);
    return this.state.programs.length < prevLen;
  }

  // --- Gallery ---
  public getGallery(onlyActive: boolean = false): GalleryItem[] {
    if (onlyActive) {
      return this.state.gallery.filter((g) => g.status === 'active');
    }
    return [...this.state.gallery];
  }

  public createGalleryItem(item: Omit<GalleryItem, 'id' | 'createdAt'>): GalleryItem {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.state.gallery.unshift(newItem);
    return newItem;
  }

  public updateGalleryItem(id: string, updates: Partial<GalleryItem>): GalleryItem | null {
    const index = this.state.gallery.findIndex((g) => g.id === id);
    if (index === -1) return null;
    this.state.gallery[index] = {
      ...this.state.gallery[index],
      ...updates,
    };
    return this.state.gallery[index];
  }

  public deleteGalleryItem(id: string): boolean {
    const prevLen = this.state.gallery.length;
    this.state.gallery = this.state.gallery.filter((g) => g.id !== id);
    return this.state.gallery.length < prevLen;
  }

  // --- Videos ---
  public getVideos(onlyActive: boolean = false): VideoItem[] {
    if (onlyActive) {
      return this.state.videos.filter((v) => v.status === 'active');
    }
    return [...this.state.videos];
  }

  public createVideo(video: Omit<VideoItem, 'id' | 'createdAt'>): VideoItem {
    const newVideo: VideoItem = {
      ...video,
      id: `vid-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.state.videos.unshift(newVideo);
    return newVideo;
  }

  public updateVideo(id: string, updates: Partial<VideoItem>): VideoItem | null {
    const index = this.state.videos.findIndex((v) => v.id === id);
    if (index === -1) return null;
    this.state.videos[index] = {
      ...this.state.videos[index],
      ...updates,
    };
    return this.state.videos[index];
  }

  public deleteVideo(id: string): boolean {
    const prevLen = this.state.videos.length;
    this.state.videos = this.state.videos.filter((v) => v.id !== id);
    return this.state.videos.length < prevLen;
  }

  // --- Testimonials ---
  public getTestimonials(onlyApproved: boolean = false): Testimonial[] {
    if (onlyApproved) {
      return this.state.testimonials.filter((t) => t.status === 'approved');
    }
    return [...this.state.testimonials];
  }

  public createTestimonial(test: Omit<Testimonial, 'id' | 'date'>): Testimonial {
    const newTest: Testimonial = {
      ...test,
      id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
    };
    this.state.testimonials.unshift(newTest);
    return newTest;
  }

  public updateTestimonial(id: string, updates: Partial<Testimonial>): Testimonial | null {
    const index = this.state.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return null;
    this.state.testimonials[index] = {
      ...this.state.testimonials[index],
      ...updates,
    };
    return this.state.testimonials[index];
  }

  public deleteTestimonial(id: string): boolean {
    const prevLen = this.state.testimonials.length;
    this.state.testimonials = this.state.testimonials.filter((t) => t.id !== id);
    return this.state.testimonials.length < prevLen;
  }

  // --- Offers ---
  public getOffers(onlyActive: boolean = false): Offer[] {
    if (onlyActive) {
      return this.state.offers.filter((o) => o.status === 'active');
    }
    return [...this.state.offers];
  }

  public createOffer(offer: Omit<Offer, 'id'>): Offer {
    const newOffer: Offer = {
      ...offer,
      id: `off-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    this.state.offers.push(newOffer);
    return newOffer;
  }

  public updateOffer(id: string, updates: Partial<Offer>): Offer | null {
    const index = this.state.offers.findIndex((o) => o.id === id);
    if (index === -1) return null;
    this.state.offers[index] = {
      ...this.state.offers[index],
      ...updates,
    };
    return this.state.offers[index];
  }

  public deleteOffer(id: string): boolean {
    const prevLen = this.state.offers.length;
    this.state.offers = this.state.offers.filter((o) => o.id !== id);
    return this.state.offers.length < prevLen;
  }

  // --- Gym Timings ---
  public getTimings(): GymTimings {
    return { ...this.state.gymTimings };
  }

  public updateTimings(timings: GymTimings): GymTimings {
    this.state.gymTimings = { ...timings };
    return this.getTimings();
  }

  // --- Contact Info ---
  public getContactInfo(): ContactInfo {
    return { ...this.state.contactInfo };
  }

  public updateContactInfo(info: Partial<ContactInfo>): ContactInfo {
    this.state.contactInfo = {
      ...this.state.contactInfo,
      ...info,
    };
    return this.getContactInfo();
  }

  // --- Users / Members ---
  public getUsers(): User[] {
    // Return sanitized users (no raw password hashes in general list)
    return this.state.users.map((u) => {
      const { password, ...safe } = u;
      return safe as User;
    });
  }

  public getUserById(id: string): User | undefined {
    const user = this.state.users.find((u) => u.id === id);
    if (!user) return undefined;
    const { password, ...safe } = user;
    return safe as User;
  }

  public getUserByEmail(email: string): User | undefined {
    return this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: `usr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: user.status || 'active',
    };
    this.state.users.push(newUser);
    const { password, ...safe } = newUser;
    return safe as User;
  }

  public updateUser(id: string, updates: Partial<User>): User | null {
    const index = this.state.users.findIndex((u) => u.id === id);
    if (index === -1) return null;
    this.state.users[index] = {
      ...this.state.users[index],
      ...updates,
    };
    const { password, ...safe } = this.state.users[index];
    return safe as User;
  }

  public deleteUser(id: string): boolean {
    const prevLen = this.state.users.length;
    this.state.users = this.state.users.filter((u) => u.id !== id);
    return this.state.users.length < prevLen;
  }

  // --- Bookings ---
  public getBookings(userId?: string): Booking[] {
    if (userId) {
      return this.state.bookings.filter((b) => b.userId === userId);
    }
    return [...this.state.bookings];
  }

  public getBookingById(id: string): Booking | undefined {
    return this.state.bookings.find((b) => b.id === id);
  }

  public createBooking(booking: Omit<Booking, 'id' | 'createdAt'>): Booking {
    const newBooking: Booking = {
      ...booking,
      id: `bk-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.state.bookings.unshift(newBooking);
    return newBooking;
  }

  public updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const index = this.state.bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;
    this.state.bookings[index] = {
      ...this.state.bookings[index],
      ...updates,
    };
    return this.state.bookings[index];
  }

  public deleteBooking(id: string): boolean {
    const prevLen = this.state.bookings.length;
    this.state.bookings = this.state.bookings.filter((b) => b.id !== id);
    return this.state.bookings.length < prevLen;
  }

  // --- Notifications ---
  public getNotifications(userId?: string): NotificationItem[] {
    return this.state.notifications.filter((n) => !n.userId || n.userId === userId);
  }

  public createNotification(notif: Omit<NotificationItem, 'id' | 'date'>): NotificationItem {
    const newNotif: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };
    this.state.notifications.unshift(newNotif);
    return newNotif;
  }

  public markNotificationAsRead(id: string): boolean {
    const notif = this.state.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      return true;
    }
    return false;
  }
}

export const gymRepository = new GymRepository();

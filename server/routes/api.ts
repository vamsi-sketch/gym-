import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { gymRepository } from '../repositories/gymRepository';
import { authenticateToken, requireAdmin, generateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Ensure uploads directory exists
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (_req, file, cb) => {
    // accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are supported'));
    }
  },
});

// ==========================================
// 1. FILE UPLOAD (Images & Videos)
// Ready for Supabase Storage integration
// ==========================================
router.post('/upload', upload.single('file'), (req: Request, res: Response): void => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Upload failed' });
  }
});

// ==========================================
// 2. AUTHENTICATION (Register, Login, Me)
// ==========================================
router.post('/auth/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email and password are required' });
      return;
    }

    const existing = gymRepository.getUserByEmail(email);
    if (existing) {
      res.status(400).json({ success: false, message: 'Account with this email already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = gymRepository.createUser({
      name,
      email,
      phone: phone || '',
      password: hashedPassword,
      role: 'user',
      status: 'active',
    });

    const token = generateToken({ id: newUser.id, email: newUser.email, role: newUser.role });
    res.status(201).json({
      success: true,
      token,
      user: newUser,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/auth/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password required' });
      return;
    }

    const user = gymRepository.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    if (user.status === 'inactive') {
      res.status(403).json({ success: false, message: 'Account is deactivated. Please contact gym staff.' });
      return;
    }

    const isValid = user.password ? await bcrypt.compare(password, user.password) : false;
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const { password: _, ...safeUser } = user;
    res.json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/auth/me', authenticateToken, (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const user = gymRepository.getUserById(req.user.id);
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }
  res.json({ success: true, user });
});

// Update Profile
router.put('/auth/profile', authenticateToken, (req: AuthRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  const { name, phone } = req.body;
  const updated = gymRepository.updateUser(req.user.id, { name, phone });
  res.json({ success: true, user: updated });
});

// ==========================================
// 3. HOMEPAGE CONTENT CMS
// ==========================================
router.get('/homepage', (_req: Request, res: Response): void => {
  res.json({ success: true, data: gymRepository.getHomepage() });
});

router.put('/homepage', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  try {
    const updated = gymRepository.updateHomepage(req.body);
    res.json({ success: true, data: updated, message: 'Homepage content updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==========================================
// 4. MEMBERSHIP PLANS
// ==========================================
router.get('/memberships', (req: Request, res: Response): void => {
  const onlyActive = req.query.all !== 'true';
  res.json({ success: true, data: gymRepository.getMemberships(onlyActive) });
});

router.get('/memberships/:id', (req: Request, res: Response): void => {
  const plan = gymRepository.getMembershipById(req.params.id);
  if (!plan) {
    res.status(404).json({ success: false, message: 'Plan not found' });
    return;
  }
  res.json({ success: true, data: plan });
});

router.post('/memberships', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  try {
    const { name, price, duration, description, benefits, isPopular, status, image } = req.body;
    if (!name || price === undefined) {
      res.status(400).json({ success: false, message: 'Plan name and price are required' });
      return;
    }
    const created = gymRepository.createMembership({
      name,
      price: Number(price),
      duration: duration || '1 Month',
      description: description || '',
      benefits: Array.isArray(benefits) ? benefits : (benefits || '').split('\n').filter(Boolean),
      image: image || '',
      isPopular: Boolean(isPopular),
      status: status || 'active',
    });
    res.status(201).json({ success: true, data: created, message: 'Membership plan created' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/memberships/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  try {
    const updates = { ...req.body };
    if (updates.price !== undefined) updates.price = Number(updates.price);
    if (typeof updates.benefits === 'string') {
      updates.benefits = updates.benefits.split('\n').filter(Boolean);
    }
    const updated = gymRepository.updateMembership(req.params.id, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Plan not found' });
      return;
    }
    res.json({ success: true, data: updated, message: 'Membership plan updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/memberships/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const success = gymRepository.deleteMembership(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Plan not found' });
    return;
  }
  res.json({ success: true, message: 'Membership plan deleted' });
});

// ==========================================
// 5. TRAINERS
// ==========================================
router.get('/trainers', (req: Request, res: Response): void => {
  const onlyActive = req.query.all !== 'true';
  res.json({ success: true, data: gymRepository.getTrainers(onlyActive) });
});

router.get('/trainers/:id', (req: Request, res: Response): void => {
  const trainer = gymRepository.getTrainerById(req.params.id);
  if (!trainer) {
    res.status(404).json({ success: false, message: 'Trainer not found' });
    return;
  }
  res.json({ success: true, data: trainer });
});

router.post('/trainers', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  try {
    const { name, profileImage, specialization, experience, phone, email, bio, socialLinks, status } = req.body;
    if (!name || !specialization) {
      res.status(400).json({ success: false, message: 'Name and specialization are required' });
      return;
    }
    const created = gymRepository.createTrainer({
      name,
      profileImage: profileImage || '/src/assets/images/trainer_male_strength_1790868406593.jpg',
      specialization,
      experience: experience || 'Certified Coach',
      phone: phone || '',
      email: email || '',
      bio: bio || '',
      socialLinks: socialLinks || {},
      status: status || 'active',
    });
    res.status(201).json({ success: true, data: created, message: 'Trainer added successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/trainers/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  try {
    const updated = gymRepository.updateTrainer(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Trainer not found' });
      return;
    }
    res.json({ success: true, data: updated, message: 'Trainer updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/trainers/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const success = gymRepository.deleteTrainer(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Trainer not found' });
    return;
  }
  res.json({ success: true, message: 'Trainer deleted successfully' });
});

// ==========================================
// 6. PROGRAMS
// ==========================================
router.get('/programs', (req: Request, res: Response): void => {
  const onlyActive = req.query.all !== 'true';
  res.json({ success: true, data: gymRepository.getPrograms(onlyActive) });
});

router.post('/programs', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  try {
    const { name, description, image, duration, difficulty, benefits, status } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Program name is required' });
      return;
    }
    const created = gymRepository.createProgram({
      name,
      description: description || '',
      image: image || '/src/assets/images/hero_gym_workout_1790868392603.jpg',
      duration: duration || '8 Weeks',
      difficulty: difficulty || 'All Levels',
      benefits: Array.isArray(benefits) ? benefits : (benefits || '').split('\n').filter(Boolean),
      status: status || 'active',
    });
    res.status(201).json({ success: true, data: created, message: 'Program created' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/programs/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  try {
    const updates = { ...req.body };
    if (typeof updates.benefits === 'string') {
      updates.benefits = updates.benefits.split('\n').filter(Boolean);
    }
    const updated = gymRepository.updateProgram(req.params.id, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Program not found' });
      return;
    }
    res.json({ success: true, data: updated, message: 'Program updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/programs/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const success = gymRepository.deleteProgram(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Program not found' });
    return;
  }
  res.json({ success: true, message: 'Program deleted' });
});

// ==========================================
// 7. GALLERY
// ==========================================
router.get('/gallery', (req: Request, res: Response): void => {
  const onlyActive = req.query.all !== 'true';
  res.json({ success: true, data: gymRepository.getGallery(onlyActive) });
});

router.post('/gallery', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  try {
    const { imageUrl, title, category, description, status } = req.body;
    if (!imageUrl || !title) {
      res.status(400).json({ success: false, message: 'Image URL and title are required' });
      return;
    }
    const created = gymRepository.createGalleryItem({
      imageUrl,
      title,
      category: category || 'Gym',
      description: description || '',
      status: status || 'active',
    });
    res.status(201).json({ success: true, data: created, message: 'Gallery item added' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/gallery/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const updated = gymRepository.updateGalleryItem(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Gallery item not found' });
    return;
  }
  res.json({ success: true, data: updated, message: 'Gallery item updated' });
});

router.delete('/gallery/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const success = gymRepository.deleteGalleryItem(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Gallery item not found' });
    return;
  }
  res.json({ success: true, message: 'Gallery item deleted' });
});

// ==========================================
// 8. VIDEOS
// ==========================================
router.get('/videos', (req: Request, res: Response): void => {
  const onlyActive = req.query.all !== 'true';
  res.json({ success: true, data: gymRepository.getVideos(onlyActive) });
});

router.post('/videos', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  try {
    const { title, videoUrl, thumbnail, category, description, status } = req.body;
    if (!title || !videoUrl) {
      res.status(400).json({ success: false, message: 'Title and video URL are required' });
      return;
    }
    const created = gymRepository.createVideo({
      title,
      videoUrl,
      thumbnail: thumbnail || '/src/assets/images/hero_gym_workout_1790868392603.jpg',
      category: category || 'Facility Tour',
      description: description || '',
      status: status || 'active',
    });
    res.status(201).json({ success: true, data: created, message: 'Video added' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/videos/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const updated = gymRepository.updateVideo(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Video not found' });
    return;
  }
  res.json({ success: true, data: updated, message: 'Video updated' });
});

router.delete('/videos/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const success = gymRepository.deleteVideo(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Video not found' });
    return;
  }
  res.json({ success: true, message: 'Video deleted' });
});

// ==========================================
// 9. TESTIMONIALS
// ==========================================
router.get('/testimonials', (req: Request, res: Response): void => {
  const onlyApproved = req.query.all !== 'true';
  res.json({ success: true, data: gymRepository.getTestimonials(onlyApproved) });
});

router.post('/testimonials', (req: Request, res: Response): void => {
  try {
    const { name, role, profileImage, review, rating, status } = req.body;
    if (!name || !review) {
      res.status(400).json({ success: false, message: 'Name and review are required' });
      return;
    }
    const created = gymRepository.createTestimonial({
      name,
      role: role || 'Fitness Member',
      profileImage: profileImage || '/src/assets/images/trainer_male_strength_1790868406593.jpg',
      review,
      rating: Number(rating) || 5,
      status: status || 'approved',
    });
    res.status(201).json({ success: true, data: created, message: 'Testimonial submitted' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/testimonials/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const updated = gymRepository.updateTestimonial(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Testimonial not found' });
    return;
  }
  res.json({ success: true, data: updated, message: 'Testimonial updated' });
});

router.delete('/testimonials/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const success = gymRepository.deleteTestimonial(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Testimonial not found' });
    return;
  }
  res.json({ success: true, message: 'Testimonial deleted' });
});

// ==========================================
// 10. OFFERS
// ==========================================
router.get('/offers', (req: Request, res: Response): void => {
  const onlyActive = req.query.all !== 'true';
  res.json({ success: true, data: gymRepository.getOffers(onlyActive) });
});

router.post('/offers', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  try {
    const { title, description, discount, bannerImage, startDate, endDate, buttonText, buttonLink, status } = req.body;
    if (!title || !discount) {
      res.status(400).json({ success: false, message: 'Title and discount are required' });
      return;
    }
    const created = gymRepository.createOffer({
      title,
      description: description || '',
      discount,
      bannerImage: bannerImage || '/src/assets/images/hero_gym_workout_1790868392603.jpg',
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || '2026-12-31',
      buttonText: buttonText || 'Claim Offer',
      buttonLink: buttonLink || '#memberships',
      status: status || 'active',
    });
    res.status(201).json({ success: true, data: created, message: 'Offer created' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/offers/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const updated = gymRepository.updateOffer(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Offer not found' });
    return;
  }
  res.json({ success: true, data: updated, message: 'Offer updated' });
});

router.delete('/offers/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const success = gymRepository.deleteOffer(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Offer not found' });
    return;
  }
  res.json({ success: true, message: 'Offer deleted' });
});

// ==========================================
// 11. TIMINGS & CONTACT SETTINGS
// ==========================================
router.get('/timings', (_req: Request, res: Response): void => {
  res.json({ success: true, data: gymRepository.getTimings() });
});

router.put('/timings', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const updated = gymRepository.updateTimings(req.body);
  res.json({ success: true, data: updated, message: 'Gym timings updated' });
});

router.get('/contact', (_req: Request, res: Response): void => {
  res.json({ success: true, data: gymRepository.getContactInfo() });
});

router.put('/contact', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const updated = gymRepository.updateContactInfo(req.body);
  res.json({ success: true, data: updated, message: 'Contact details updated' });
});

// Comprehensive settings endpoint
router.get('/settings', (_req: Request, res: Response): void => {
  res.json({
    success: true,
    data: {
      timings: gymRepository.getTimings(),
      contact: gymRepository.getContactInfo(),
      homepage: gymRepository.getHomepage(),
    },
  });
});

// ==========================================
// 12. BOOKINGS (Trial, PT, Classes)
// ==========================================
router.get('/bookings', authenticateToken, (req: AuthRequest, res: Response): void => {
  if (req.user?.role === 'admin') {
    res.json({ success: true, data: gymRepository.getBookings() });
  } else {
    res.json({ success: true, data: gymRepository.getBookings(req.user?.id) });
  }
});

router.post('/bookings', (req: Request, res: Response): void => {
  try {
    const { userName, userEmail, userPhone, bookingType, trainerId, trainerName, programId, programName, date, time, notes, userId } = req.body;
    if (!userName || !userEmail || !userPhone || !date || !time) {
      res.status(400).json({ success: false, message: 'Name, email, phone, date, and time are required' });
      return;
    }
    const created = gymRepository.createBooking({
      userId: userId || 'guest',
      userName,
      userEmail,
      userPhone,
      bookingType: bookingType || 'Free Trial',
      trainerId,
      trainerName,
      programId,
      programName,
      date,
      time,
      notes,
      status: 'Pending',
    });

    // Notify gym admin
    gymRepository.createNotification({
      title: `New Booking: ${bookingType}`,
      message: `${userName} requested a ${bookingType} session on ${date} at ${time}.`,
      type: 'booking',
      read: false,
    });

    res.status(201).json({ success: true, data: created, message: 'Booking submitted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/bookings/:id', authenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    const booking = gymRepository.getBookingById(req.params.id);
    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    // Allow user to cancel own booking or admin to update status
    if (req.user?.role !== 'admin' && booking.userId !== req.user?.id) {
      res.status(403).json({ success: false, message: 'Not authorized to modify this booking' });
      return;
    }

    const updated = gymRepository.updateBooking(req.params.id, req.body);
    res.json({ success: true, data: updated, message: 'Booking updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/bookings/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const success = gymRepository.deleteBooking(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Booking not found' });
    return;
  }
  res.json({ success: true, message: 'Booking deleted' });
});

// ==========================================
// 13. MEMBERS / USERS MANAGEMENT (Admin)
// ==========================================
router.get('/members', authenticateToken, requireAdmin, (_req: Request, res: Response): void => {
  res.json({ success: true, data: gymRepository.getUsers() });
});

router.post('/members', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, role, status, membership } = req.body;
    if (!name || !email) {
      res.status(400).json({ success: false, message: 'Name and email are required' });
      return;
    }
    const defaultPassHash = await bcrypt.hash('member123', 10);
    const created = gymRepository.createUser({
      name,
      email,
      phone: phone || '',
      password: defaultPassHash,
      role: role || 'user',
      status: status || 'active',
      membership,
    });
    res.status(201).json({ success: true, data: created, message: 'Member created successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/members/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const updated = gymRepository.updateUser(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Member not found' });
    return;
  }
  res.json({ success: true, data: updated, message: 'Member updated successfully' });
});

router.delete('/members/:id', authenticateToken, requireAdmin, (req: Request, res: Response): void => {
  const success = gymRepository.deleteUser(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Member not found' });
    return;
  }
  res.json({ success: true, message: 'Member deleted' });
});

// ==========================================
// 14. MODULAR RAZORPAY PAYMENT MOCK / FLOW
// ==========================================
router.post('/payments/create-order', authenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    const { planId } = req.body;
    const plan = gymRepository.getMembershipById(planId);
    if (!plan) {
      res.status(404).json({ success: false, message: 'Membership plan not found' });
      return;
    }

    // Generate simulated Razorpay order ID
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    res.json({
      success: true,
      order: {
        id: orderId,
        amount: plan.price * 100, // in paise
        currency: 'INR',
        planId: plan.id,
        planName: plan.name,
      },
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_fitzone_mock_key',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/payments/verify', authenticateToken, (req: AuthRequest, res: Response): void => {
  try {
    const { planId, paymentId, orderId } = req.body;
    const plan = gymRepository.getMembershipById(planId);
    if (!plan || !req.user) {
      res.status(400).json({ success: false, message: 'Invalid payment parameters' });
      return;
    }

    // Calculate expiry (default 30 days or based on duration)
    const startDate = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    if (plan.duration.toLowerCase().includes('year') || plan.duration.includes('12')) {
      expiry.setFullYear(expiry.getFullYear() + 1);
    } else if (plan.duration.toLowerCase().includes('3 month')) {
      expiry.setMonth(expiry.getMonth() + 3);
    } else {
      expiry.setDate(expiry.getDate() + 30);
    }
    const expiryDate = expiry.toISOString().split('T')[0];

    // Assign membership to user
    const updatedUser = gymRepository.updateUser(req.user.id, {
      membership: {
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        startDate,
        expiryDate,
        status: 'active',
      },
    });

    // Notify user & admin
    gymRepository.createNotification({
      userId: req.user.id,
      title: 'Membership Activated!',
      message: `Your ${plan.name} membership is active until ${expiryDate}. Welcome aboard!`,
      type: 'membership',
      read: false,
    });

    res.json({
      success: true,
      message: 'Payment verified and membership activated!',
      user: updatedUser,
      receipt: {
        paymentId: paymentId || `pay_${Date.now()}`,
        orderId,
        amount: plan.price,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Notifications
router.get('/notifications', authenticateToken, (req: AuthRequest, res: Response): void => {
  const notifs = gymRepository.getNotifications(req.user?.role === 'admin' ? undefined : req.user?.id);
  res.json({ success: true, data: notifs });
});

router.put('/notifications/:id/read', authenticateToken, (req: Request, res: Response): void => {
  const success = gymRepository.markNotificationAsRead(req.params.id);
  res.json({ success });
});

// Admin stats summary
router.get('/admin/stats', authenticateToken, requireAdmin, (_req: Request, res: Response): void => {
  const members = gymRepository.getUsers().filter((u) => u.role === 'user');
  const activeMembers = members.filter((m) => m.membership?.status === 'active');
  const bookings = gymRepository.getBookings();
  const pendingBookings = bookings.filter((b) => b.status === 'Pending');
  const trainers = gymRepository.getTrainers();
  const plans = gymRepository.getMemberships();

  res.json({
    success: true,
    data: {
      totalMembers: members.length,
      activeMembers: activeMembers.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      activeMemberships: activeMembers.length,
      totalTrainers: trainers.length,
      totalPlans: plans.length,
    },
  });
});

// Reset data to defaults
router.post('/admin/reset', authenticateToken, requireAdmin, (_req: Request, res: Response): void => {
  gymRepository.resetToDefault();
  res.json({ success: true, message: 'Database reset to default seed data successfully.' });
});

export default router;

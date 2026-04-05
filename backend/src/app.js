import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middleware/Ratelimiter.js';
import passport from './auth/passport.js';

// Import Route Modules
import authRoutes from './auth/routes/authroutes.js';
import oauthRoutes from './auth/routes/oauthroutes.js';
import userRoutes from './users/routes/userRoutes.js';
import familyRoutes from './family/routes/familyRoutes.js';
import contentRoutes from './content/routes/contentRoutes.js';
import adminRoutes from './admin/routes/adminrouter.js';

// New Modules
import challengeRoutes from './challenges/routes/challengeRoutes.js';
import gamificationRoutes from './gamification/routes/gamificationRoutes.js';
import moderationRoutes from './moderation/routes/moderationRoutes.js';
import analyticsRoutes from './analytics/routes/analyticsRoutes.js';
import notificationRoutes from './notifications/routes/notificationRoutes.js';

const app = express();

// Middleware Configuration
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Global API Limiter
app.use('/api', apiLimiter);

// API V1 Routes
const v1Router = express.Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/auth/oauth', oauthRoutes);
v1Router.use('/users', userRoutes);
v1Router.use('/family', familyRoutes);
v1Router.use('/posts', contentRoutes);
v1Router.use('/challenges', challengeRoutes);
v1Router.use('/gamification', gamificationRoutes);
v1Router.use('/moderation', moderationRoutes);
v1Router.use('/admin', adminRoutes);
v1Router.use('/analytics', analyticsRoutes);
v1Router.use('/notifications', notificationRoutes);

// Mount V1 Namespace
app.use('/api/v1', v1Router);

// Base Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running', timestamp: new Date().toISOString() });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
});

export default app;
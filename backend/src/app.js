import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { apiLimiter } from './middleware/Ratelimiter.js';
import contentRoutes from './content/routes/contentRoutes.js';

// 1. Initialize app FIRST
const app = express();

// 2. Import System Routes
import authRoutes from './auth/routes/authroutes.js';
import guardianRoutes from './guardian/routes/guardianroutes.js';
import adminRoutes from './admin/routes/adminrouter.js';

// 3. Import Profile Routes (Path: src/auth/routes/profileRoutes.js)
import profileRoutes from './auth/routes/profileRoutes.js';
import  passport from '../src/auth/passport.js';               // ADDITION 1a
import  oauthRoutes    from '../src/auth/routes/oauthroutes.js';  // ADDITION 1c

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

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 4. Route Middleware
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes); // Profile system enabled here
app.use('/api/guardian', guardianRoutes);
app.use(passport.initialize());   // ADDITION 1b: Initialize Passport middleware
app.use('/api/auth', authRoutes);
app.use("/api/oauth", oauthRoutes);  // ADDITION 1d: OAuth routes under /api/auth/oauth
app.use('/api/guardian', guardianRoutes);   // replaces /api/parent

app.use('/api/admin', adminRoutes);
app.use('/api/content', contentRoutes);

// Health Check & Error Handling
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running', timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
});

export default app;

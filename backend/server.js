//main backend file
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import cors from 'cors';
import sql from './db/pool.js';

const app = express();
app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:5173', 
  process.env.FRONTEND_URL,
  'https://ccsnd.com'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS'));
    }
  },
  credentials: true,
}));
const pgSession = connectPgSimple(session);

const PORT = process.env.SERVER_PORT || 8000; //can change later if needed
const GCAL_API_KEY = process.env.GCAL_API_KEY;
const GCAL_ID = process.env.GCAL_ID;

//middleware here
app.use(express.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    session({
        store: new pgSession({ conString: process.env.DATABASE_URL, tableName: 'session', pruneSessionInterval: 60 * 60 * 24 *3 }), //connects to sql data table
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false, //save memory from inactive sessions
        cookie: {
            maxAge: 3 * 24 * 60 * 60 * 1000, //3 days
            httpOnly: true, //i dont rlly understand it but its for security reasons??
            secure: true,
            sameSite: 'none', //required for cross-domain cookies
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRoutes);

//routes here
app.post('/api/add-admin', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }

  const email = req.body.email?.trim().toLowerCase();
  const name = req.body.name?.trim();

  if (!email || !name) {
    return res.status(400).json({ error: 'Email and name are required' });
  }

  try{
    const existing = await sql`
          SELECT *
          FROM board_members
          WHERE email = ${email}
        `;
    
    if (existing.length === 0) { //not in db yet
      await sql`
        INSERT INTO board_members (email, name, role)
        VALUES (${email}, ${name}, 'admin')
      `;

      return res.status(201).json({ message: 'Admin added', email, name });
    }

    return res.status(200).json({ message: 'Admin already exists', admin: existing[0] });
  }
  catch(err){
    console.error('Failed to add admin:', err);
    return res.status(500).json({ error: 'Failed to add admin' });
  }
});

app.post('/api/delete-admin', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }

  const email = req.body.email?.trim().toLowerCase();

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try{
    const existing = await sql`
          SELECT *
          FROM board_members
          WHERE email = ${email}
        `;
    
    if (existing.length === 1) {
      await sql`
        DELETE FROM board_members
        WHERE email = ${email}
      `;

      return res.status(200).json({ message: 'Admin deleted', email });
    }

    return res.status(404).json({ error: 'Admin not found' });
  }
  catch(err){
    console.error('Failed to delete admin:', err);
    return res.status(500).json({ error: 'Failed to delete admin' });
  }
});

app.get('/api/admins', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }

  try {
    const admins = await sql`
      SELECT name, email
      FROM board_members
      WHERE role = 'admin'
      ORDER BY name, email
    `;

    return res.json({ admins });
  } catch (err) {
    console.error('Failed to load admins:', err);
    return res.status(500).json({ error: 'Failed to load admins' });
  }
});

app.get('/api/me', (req, res) => {
  console.log('isAuthenticated:', req.isAuthenticated());

  if (req.isAuthenticated()) {
    res.json({ //send information to frontend saved in session
      isAdmin: req.user.role === 'admin',
      adminName: req.user.name,
      adminEmail: req.user.email,
    });
  } else {
    res.json({ isAdmin: false });
  }
});

app.get('/api/calendar-events', async (req, res) => {
  try {
    if (!GCAL_API_KEY || !GCAL_ID) {
      return res.status(500).json({ error: 'Google Calendar API is not configured' });
    }

    const googleUrl = new URL(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GCAL_ID)}/events`
    );
    googleUrl.search = new URLSearchParams({
      key: GCAL_API_KEY, //authorization
      orderBy: 'startTime',
      singleEvents: 'true',
      timeMin: new Date().toISOString(), // Only get events from now on
    });
    
    const response = await fetch(googleUrl);
    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'Failed to fetch from Google Calendar',
      });
    }

    res.json(data.items || []); // Send only the events array to frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/wecaps-main', async (req, res) => {
  try {
    const recent_wecaps = await sql`
      SELECT id, uploaded_at, file_name
      FROM wecaps 
      ORDER BY uploaded_at DESC 
      LIMIT 4;
    `;

    return res.json({ recent_wecaps });
  } catch (err) {
    console.error('Failed to load recent wecaps:', err);
    return res.status(500).json({ error: 'Failed to load recent wecaps' });
  }

});

app.post('/api/upload-wecap', async (req, res) => {
  if (!req.isAuthenticated() || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admins only' });
  }

  const { date, fileName, pdfData } = req.body;

  if (!date || !fileName || !pdfData) {
    return res.status(400).json({ error: 'Date, file name, and PDF data are required' });
  }

  const pdfBuffer = Buffer.from(pdfData, 'base64');

  if (pdfBuffer.length === 0 || pdfBuffer.length > 3 * 1024 * 1024) {
    return res.status(400).json({ error: 'PDF must be under 3MB' });
  }

  try {
    await sql`
      INSERT INTO wecaps (uploaded_at, file_name, pdf_data)
      VALUES (${date}, ${fileName}, ${pdfBuffer})
    `;

    return res.status(201).json({ message: 'Wecap uploaded successfully' });
  } catch (err) {
    console.error('Failed to upload wecap:', err);
    return res.status(500).json({ error: 'Failed to upload wecap' });
  }
});

app.post('/api/wecaps-archive', async (req, res) => {
  //send all or filtered by years
  const years = (req.body.years || []).map(Number).filter(Number.isInteger);
  try {
    const recent_wecaps = years.length > 0
      ? await sql`
          SELECT id, uploaded_at, file_name
          FROM wecaps
          WHERE EXTRACT(YEAR FROM uploaded_at)::int = ANY(${years})
          ORDER BY uploaded_at DESC
        `
      : await sql`
          SELECT id, uploaded_at, file_name
          FROM wecaps
          ORDER BY uploaded_at DESC
        `;

    return res.json({ recent_wecaps });
  } catch (err) {
    console.error('Failed to load recent wecaps:', err);
    return res.status(500).json({ error: 'Failed to load recent wecaps' });
  }
});

app.get('/api/get-pdf/:id', async (req, res) => { //specific wecap
  const { id } = req.params;

  try {
    const result = await sql`
      SELECT pdf_data, file_name
      FROM wecaps
      WHERE id = ${id}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'PDF not found' });
    }

    const pdfData = Buffer.from(result[0].pdf_data);
    const fileName = result[0].file_name;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.send(pdfData);
  } catch (err) {
    console.error('Failed to retrieve PDF:', err);
    return res.status(500).json({ error: 'Failed to retrieve PDF' });
  }
});

//listening
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

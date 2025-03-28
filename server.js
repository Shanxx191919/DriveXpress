const express = require('express');
const nodemailer = require('nodemailer');
const { put } = require('@vercel/blob');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
const upload = multer({ storage: multer.memoryStorage() });

// Serve static files (HTML, CSS, assets)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Enable CORS for all routes
app.use(cors({
    origin: '*', // Allow all origins; tighten this in production (e.g., 'http://localhost:3000')
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Parse JSON bodies (for /send-otp)
app.use(express.json());

// API endpoint to upload images to Vercel Blob
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        const name = req.body.name;

        if (!file || !name) {
            return res.status(400).json({ error: 'Missing file or name' });
        }

        const filename = `${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.${file.originalname.split('.').pop()}`;
        const blob = await put(`car-listings/${filename}`, file.buffer, {
            access: 'public',
            token: process.env.BLOB_READ_WRITE_TOKEN,
            cacheControl: 'max-age=0, no-cache',
        });

        res.status(200).json({ url: blob.url });
    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).json({ error: 'Failed to upload image', details: error.message });
    }
});

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for the homepage (alternative path)
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for view-cars page
app.get('/view-cars', (req, res) => {
    res.sendFile(path.join(__dirname, 'view-cars.html'));
});

// Route for about page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'about.html'));
});

// Route for contact page
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'contact.html'));
});

// Route for cart page
app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'cart.html'));
});

// Route for Privacy Policy (scroll to section)
app.get('/privacy-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for Refund Policy (scroll to section)
app.get('/refund-policy', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Route for Admin Dashboard
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Route for Orders
app.get('/order-tracking', (req, res) => {
    res.sendFile(path.join(__dirname, 'order-tracking.html'));
});

// Configure Nodemailer (using Gmail as an example)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'shanvillarico1@gmail.com', // Replace with your Gmail address
        pass: 'your-app-password' // Replace with your Gmail App Password
    }
});

// API Endpoint to Send OTP
app.post('/send-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    // Email options
    const mailOptions = {
        from: 'shanvillarico1@gmail.com', // Match your Gmail address
        to: email,
        subject: 'DriveXpress OTP Verification',
        text: `Dear Customer,\n\nYour One-Time Password (OTP) for completing your purchase on DriveXpress is: ${otp}\n\nPlease enter this code to verify your email and proceed with your purchase. This OTP is valid for 10 minutes.\n\nThank you for choosing DriveXpress!\n\nBest regards,\nThe DriveXpress Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send OTP', details: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
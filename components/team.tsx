const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Ensure ChapaService is available. 
// Assuming it's a class exported from './services/chapa' as suggested by the original imports.
const ChapaService = require('./services/chapaService'); 

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Chapa service
const chapaService = new ChapaService(); 

// --- Middleware ---

// Configure CORS for all origins and common methods/headers
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Added for completeness, though bodyParser.json() handles it

// Serve static files from the root and 'public' directory
app.use(express.static('.'));
app.use(express.static(path.join(__dirname, 'public')));


// --- Email Transporter Setup ---

// Create transporter for Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can change this to your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// --- General Endpoints ---

// Home/Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Chapa Payment Gateway API', 
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'Chapa Payment Gateway',
    timestamp: new Date().toISOString()
  });
});

// Route to serve the close-webview page (for Chapa return)
app.get('/close-webview', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'close.html'));
});


// --- Contact Form Endpoints ---

// Main contact form endpoint
app.post('/contact', async (req, res) => {
  try {
    const { name, email, subject = `Contact Form Submission from ${name}`, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Define email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.TO_EMAIL || 'info@ethiotechleaders.com',
      subject: `Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email on /contact:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Team contact form endpoint (sends email directly to a specified recipient)
app.post('/team-contact', async (req, res) => {
  try {
    const { name, email, subject, message, recipientEmail } = req.body;

    // Validate input
    if (!name || !email || !message || !recipientEmail) {
      return res.status(400).json({ error: 'Name, email, message, and recipient email are required' });
    }

    // Validate email formats
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid sender email format' });
    }
    
    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({ error: 'Invalid recipient email format' });
    }

    // Define email options - send to the specific team member
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: subject || `Message from ${name}`,
      html: `
        <h2>You have received a message</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This message was sent through the Ethiotech Leaders website contact form.</em></p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending email on /team-contact:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});


// --- Chapa Payment Endpoints ---

// Payment initialization endpoint
app.post('/api/payment', async (req, res) => {
  try {
    const { amount, email, firstName, lastName, plan } = req.body;
    
    // Validate required fields
    if (!amount || !email || !firstName || !lastName || !plan) {
      return res.status(400).json({ 
        error: 'Missing required fields: amount, email, firstName, lastName, plan' 
      });
    }
    
    // Create payment data object
    const paymentData = {
      amount,
      email,
      firstName,
      lastName,
      plan
    };
    
    // Initialize payment with Chapa
    const paymentResponse = await chapaService.initializePayment(paymentData);
    
    res.json({
      success: true,
      message: 'Payment initialized successfully',
      data: paymentResponse
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while processing the payment' 
    });
  }
});

// Webhook endpoint for Chapa to send payment notifications
app.post('/api/webhook/chapa', async (req, res) => {
  try {
    console.log('Webhook received:', req.body);
    
    // Extract transaction reference and status
    const { tx_ref, status } = req.body;
    
    if (tx_ref && status) {
      // Verify the payment with Chapa
      const verification = await chapaService.verifyPayment(tx_ref);
      
      console.log(`Payment ${status} for transaction ${tx_ref}`, verification);
      
      // If payment is successful, you might want to update user's plan in your database
      if (status === 'success' && verification && verification.status === 'success') {
        console.log('Payment successful and verified for transaction:', tx_ref);
        // !!! IMPORTANT: Update user subscription/service in your database here
      }
    }
    
    // Send success response to Chapa
    res.json({ 
      success: true, 
      message: 'Webhook received successfully' 
    });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing the webhook' 
    });
  }
});

// Verification endpoint for checking payment status
app.get('/api/verify/:tx_ref', async (req, res) => {
  try {
    const { tx_ref } = req.params;
    
    if (!tx_ref) {
      return res.status(400).json({ 
        error: 'Transaction reference is required' 
      });
    }
    
    // Verify payment with Chapa
    const verification = await chapaService.verifyPayment(tx_ref);
    
    res.json({
      success: true,
      data: verification
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      error: error.message || 'An error occurred while verifying the payment' 
    });
  }
});


// --- Server Start ---

// Start server only if this file is run directly (not imported)
if (require.main === module) {
  // Bind to all network interfaces to allow connections from other devices
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on all network interfaces on port ${PORT}`);
    console.log(`Accessible at http://localhost:${PORT}`);
    // Note: The specific local IP (192.168.1.5) is device-dependent and removed for generality.
  });
}

// Export app for testing or importing in other files
module.exports = app;

const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch'); // polyfill for fetch
global.fetch = fetch;

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

require('dotenv').config();
const app = express();
const port = 8080;
const websiteName = 'domain.com'; // Replace with your domain

const stripe = require('stripe')(process.env.STRIPE_SECRET);

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORS Middleware ---
const allowedOrigins = ['http://127.0.0.1:3000', 'http://localhost:3000', `https://${websiteName}`];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
    }
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// --- Stripe Payment ---
app.post('/api/pay', async (req, res) => {
    try {
        let price = parseInt(req.body.price) * 100;
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price,
            currency: 'usd',
            metadata: { integration_check: 'accept_a_payment' },
        });
        res.json({ client_secret: paymentIntent.client_secret, server_time: Date.now() });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- Membership Check ---
app.post('/api/check', async (req, res) => {
    try {
        const expDate = new Date(req.body.expDate);
        const currentDate = new Date();
        res.json({ status: currentDate.getTime() < expDate.getTime() ? 'true' : 'false' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- Current Date ---
app.post('/api/date', (req, res) => {
    res.json({ date: new Date() });
});

// --- Export Resume with Puppeteer ---
app.post('/api/export', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            executablePath: '/snap/bin/chromium', // adjust path if needed
        });

        const page = await browser.newPage();
        const url = `http://${websiteName}/export/${req.body.resumeName}/${req.body.resumeId}/${req.body.language}`;
        console.log('Navigating to:', url);
        await page.goto(url, { timeout: 60000 });
        await page.waitForSelector('#resumen', { visible: true });
        await page.waitForTimeout(3000);

        await page.pdf({ path: 'resume.pdf', format: 'a4' });
        await browser.close();
        res.download('./resume.pdf');
    } catch (err) {
        console.error('Export error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- AI Routes ---
const aiRoutes = require('./routes/ai'); // keep your AI routes as they are
app.use('/api', aiRoutes);

// --- Test Route ---
app.get('/api/return', (req, res) => res.send('Hello World'));

// --- LinkedIn Scraper ---
app.get('/api/linkedin-scraper', async (req, res) => {
    try {
        const cookiesPath = path.join(__dirname, 'cookies.json');
        const cookies = fs.existsSync(cookiesPath) ? JSON.parse(fs.readFileSync(cookiesPath, 'utf8')) : [];

        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        const page = await browser.newPage();

        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        );

        if (cookies.length > 0) await page.setCookie(...cookies);

        const linkedinURL =
            'https://www.linkedin.com/jobs/search?keywords=web%20developer&location=United%20States&geoId=103644278&trk=public_jobs_jobs-search-bar_search-submit&position=1&pageNum=0';
        await page.goto(linkedinURL, { timeout: 60000, waitUntil: 'networkidle0' });
        await page.waitForSelector('ul.jobs-search__results-list', { visible: true, timeout: 30000 });
        await page.waitForTimeout(3000);

        const jobs = await page.evaluate(() => {
            const jobCards = document.querySelectorAll('ul.jobs-search__results-list div.base-card');
            return Array.from(jobCards).map((card, index) => ({
                id: index + 1,
                content: card.textContent.trim(),
            }));
        });

        await browser.close();
        res.json({ success: true, totalJobs: jobs.length, jobs });
    } catch (err) {
        console.error('LinkedIn scraper error:', err);
        res.status(500).json({ success: false, error: 'Failed to scrape LinkedIn jobs', message: err.message });
    }
});

// --- Start Server ---
app.listen(port, () => console.log(`Server running on port ${port}`));

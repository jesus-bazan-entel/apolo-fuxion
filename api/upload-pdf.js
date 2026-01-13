import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
let app = null;

function getFirebaseAdmin() {
    if (app) return app;

    try {
        // Check if already initialized
        if (admin.apps.length > 0) {
            app = admin.apps[0];
            return app;
        }

        const serviceAccount = {
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        };

        if (!serviceAccount.projectId || !serviceAccount.privateKey) {
            throw new Error('Firebase Admin credentials not configured');
        }

        app = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
        });

        return app;
    } catch (error) {
        console.error('Firebase Admin init error:', error);
        throw error;
    }
}

async function shortenUrl(longUrl) {
    try {
        // Using TinyURL API (free, no key needed)
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        if (response.ok) {
            return await response.text();
        }
    } catch (error) {
        console.error('URL shortening failed:', error);
    }
    // Return original URL if shortening fails
    return longUrl;
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { pdfBase64, filename, clientName } = req.body;

        if (!pdfBase64) {
            return res.status(400).json({ error: 'PDF data is required' });
        }

        // Initialize Firebase Admin
        getFirebaseAdmin();
        const bucket = admin.storage().bucket();

        // Convert base64 to buffer
        const pdfBuffer = Buffer.from(pdfBase64, 'base64');

        // Create unique filename
        const timestamp = Date.now();
        const safeName = (clientName || 'cliente').toLowerCase().replace(/[^a-z0-9]/g, '-');
        const storagePath = `pdfs/${timestamp}-${safeName}.pdf`;

        // Upload to Firebase Storage
        const file = bucket.file(storagePath);
        await file.save(pdfBuffer, {
            metadata: {
                contentType: 'application/pdf',
                cacheControl: 'public, max-age=31536000' // Cache for 1 year
            }
        });

        // Make file public
        await file.makePublic();

        // Get public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

        // Shorten URL
        const shortUrl = await shortenUrl(publicUrl);

        return res.status(200).json({
            success: true,
            url: publicUrl,
            shortUrl: shortUrl,
            filename: storagePath
        });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({
            error: 'Error uploading PDF',
            details: error.message
        });
    }
}

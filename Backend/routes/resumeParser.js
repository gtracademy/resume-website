const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const admin = require('firebase-admin');
const router = express.Router();

// Store PDF in memory (don't save to disk on the server)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    },
});

/**
 * POST /api/parse-resume
 * Accepts a PDF file upload, extracts text, sends to Gemini for structured parsing.
 * Returns a JSON object matching the resume form structure.
 */
router.post('/parse-resume', upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        // 1. Extract raw text from PDF
        let pdfText = '';
        try {
            const pdfData = await pdfParse(req.file.buffer);
            pdfText = pdfData.text;
        } catch (parseError) {
            console.error('PDF parsing error:', parseError);
            return res.status(422).json({ error: 'Could not read the PDF. Please make sure it is a text-based PDF, not a scanned image.' });
        }

        if (!pdfText || pdfText.trim().length < 50) {
            return res.status(422).json({
                error: 'The PDF appears to be empty or is a scanned image. Please upload a text-based PDF resume.',
            });
        }

        // 2. Send to Gemini for structured extraction
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'AI service is not configured on the server.' });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
You are a resume parser. Extract structured data from the following resume text and return it as a valid JSON object.

IMPORTANT:
- Return ONLY the JSON object, no markdown, no explanation, no code fences.
- If a field is not found, use an empty string "" for text fields, or an empty array [] for array fields.
- For dates, use format "YYYY-MM" if possible, otherwise use what you find.
- Keep descriptions as plain text (no HTML).

JSON structure to return:
{
  "firstname": "",
  "lastname": "",
  "email": "",
  "phone": "",
  "occupation": "",
  "country": "",
  "city": "",
  "address": "",
  "postalcode": "",
  "summary": "",
  "employments": [
    {
      "jobTitle": "",
      "employer": "",
      "begin": "",
      "end": "",
      "description": "",
      "current": false
    }
  ],
  "educations": [
    {
      "school": "",
      "degree": "",
      "started": "",
      "finished": "",
      "description": "",
      "current": false
    }
  ],
  "skills": [
    {
      "skillName": "",
      "rating": 75
    }
  ],
  "languages": [
    {
      "language": "",
      "level": "Professional"
    }
  ]
}

Resume text:
${pdfText.substring(0, 8000)}
`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        // 3. Parse the Gemini response as JSON
        let parsedResume;
        try {
            // Strip any accidental markdown code fences
            const cleaned = responseText.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
            parsedResume = JSON.parse(cleaned);
        } catch (jsonError) {
            console.error('Failed to parse Gemini response as JSON:', responseText);
            return res.status(500).json({ error: 'AI could not parse resume into a structured format. Please try again.' });
        }

        // 4. Optionally save the PDF to Firebase Storage if userId is provided
        if (req.body.userId) {
            try {
                const bucket = admin.storage().bucket();
                const fileName = `resumes/${req.body.userId}/uploaded_resume_${Date.now()}.pdf`;
                const file = bucket.file(fileName);

                await file.save(req.file.buffer, {
                    metadata: {
                        contentType: 'application/pdf',
                        metadata: {
                            uploadedAt: new Date().toISOString(),
                            userId: req.body.userId,
                        },
                    },
                });

                // Make it accessible and get URL
                await file.makePublic();
                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                parsedResume.uploadedResumeUrl = publicUrl;
                parsedResume.uploadedResumeFileName = req.file.originalname;

                console.log(`Resume uploaded to Firebase Storage: ${fileName}`);
            } catch (storageError) {
                // Don't fail the whole request if storage fails — parsing succeeded
                console.error('Firebase Storage upload failed:', storageError.message);
            }
        }

        // 5. Add IDs to array items (the frontend expects them)
        const now = Date.now();
        if (Array.isArray(parsedResume.employments)) {
            parsedResume.employments = parsedResume.employments.map((emp, i) => ({
                id: now + i,
                ...emp,
            }));
        }
        if (Array.isArray(parsedResume.educations)) {
            parsedResume.educations = parsedResume.educations.map((edu, i) => ({
                id: now + 100 + i,
                ...edu,
            }));
        }
        if (Array.isArray(parsedResume.skills)) {
            parsedResume.skills = parsedResume.skills.map((skill, i) => ({
                id: `skill_${now}_${i}`,
                skillName: skill.skillName || skill.name || '',
                rating: skill.rating || 75,
            }));
        }

        return res.json({ success: true, data: parsedResume });
    } catch (error) {
        console.error('Resume parse error:', error);
        return res.status(500).json({ error: 'Failed to parse resume. Please try again.' });
    }
});

module.exports = router;

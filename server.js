const express = require("express");
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const unzipper = require("unzipper");
const mime = require("mime-types");
const fs = require("fs");
const mongoose = require('mongoose');
const cors = require("cors");
const authenticateToken = require('./middlewares/authMiddleware');
const checkAuth = require('./middlewares/checkAuth'); // Ensure this is imported

// Load environment variables
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB configuration
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    console.error("MongoDB URI is not defined in environment variables");
    process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Configure Multer for file uploads
const upload = multer({ dest: "uploads/" });

// AWS S3 configuration
const s3 = new S3Client({ region: process.env.AWS_REGION });

// MongoDB configuration
const collectionName = "uploads";

// Function to replace spaces with hyphens
const replaceSpacesWithHyphens = (str) => str.replace(/\s+/g, '-');

// Root route
app.get("/", (req, res) => {
    res.send("Welcome to the file upload service!");
});

const userRoutes = require('./routes/userRoutes'); // Adjust path as necessary
app.use('/api/users', userRoutes);

// Endpoint to handle file uploads
app.post("/upload", checkAuth,upload.single("file"), async (req, res) => {
    const zipFilePath = req.file.path;
    const uploadKeyPrefix = Date.now().toString();  // Unique folder name for this upload
    const bucketName = process.env.S3_BUCKET_NAME;
    const region = process.env.AWS_REGION;

    let responseSent = false; // Flag to ensure only one response is sent
    let originalFolderName = '';  // To store the folder name from the zip file
    let htmlFileName = '';  // Variable to store the original .html file name

    fs.createReadStream(zipFilePath)
        .pipe(unzipper.Parse())
        .on("entry", async (entry) => {
            const fileName = entry.path;

            // Extract the original folder name from the first file
            if (!originalFolderName) {
                originalFolderName = fileName.split('/')[0];
                console.log(`Original folder name: ${originalFolderName}`);
            }

            const relativePath = fileName.replace(`${originalFolderName}/`, '');
            const modifiedFileName = replaceSpacesWithHyphens(relativePath);

            console.log(`Relative path inside folder: ${relativePath}`);
            console.log(`Modified file name for S3: ${modifiedFileName}`);

            // Check if the file is an HTML file and store its name
            if (fileName.endsWith(".html")) {
                htmlFileName = relativePath;  // Store the HTML file relative path
            }

            const contentType = mime.lookup(fileName) || "application/octet-stream";

            const chunks = [];
            entry.on('data', chunk => chunks.push(chunk));
            entry.on('end', async () => {
                const fileBuffer = Buffer.concat(chunks);

                const uploadParams = {
                    Bucket: bucketName,
                    Key: `${uploadKeyPrefix}/${replaceSpacesWithHyphens(originalFolderName)}/${modifiedFileName}`,
                    Body: fileBuffer,
                    ContentType: contentType,
                };

                console.log(`Uploading file to S3 with key: ${uploadParams.Key}`);

                try {
                    const command = new PutObjectCommand(uploadParams);
                    await s3.send(command);
                } catch (err) {
                    if (!responseSent) {
                        console.error("Error uploading to S3:", err);
                        return res.status(500).json({ error: "Failed to upload file" });
                    }
                }
            });
        })
        .on("close", async () => {
            if (responseSent) return;  // Ensure only one response is sent

            const hostedUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${uploadKeyPrefix}/${replaceSpacesWithHyphens(originalFolderName)}/${replaceSpacesWithHyphens(htmlFileName)}`;

            console.log(`Hosted URL: ${hostedUrl}`);

            try {
                const collection = mongoose.connection.db.collection(collectionName);
                await collection.insertOne({
                    userId: req.userId || "anonymous",
                    uploadTimestamp: new Date(),
                    hostedUrl: hostedUrl,
                });

                res.json({ message: "Site hosted", url: hostedUrl });
                responseSent = true;
            } catch (err) {
                if (!responseSent) {
                    console.error("Error inserting into MongoDB:", err);
                    return res.status(500).json({ error: "Failed to store file metadata" });
                }
            }
        })
        .on('error', (err) => {
            console.error("Error during unzip process:", err);
            if (!responseSent) {
                res.status(500).json({ error: "Error processing the zip file" });
            }
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

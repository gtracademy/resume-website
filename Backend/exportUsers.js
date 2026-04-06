const admin = require("firebase-admin");
const XLSX = require("xlsx");

// 🔑 Firebase service key
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportUsers() {
  try {
    const snapshot = await db.collection("users").get();

    const users = [];

    snapshot.forEach((doc) => {
      const d = doc.data();

      users.push({
        UserID: doc.id,
        Name: d.name || d.fullName || "",
        Email: d.email || "",
        Phone: d.phone || "",
        City: d.city || "",
        Country: d.country || "",
        Occupation: d.occupation || "",

        // Stats (if stored)
        DocumentsGenerated: d.documentsGenerated || 0,
        DocumentsDownloaded: d.documentsDownloaded || 0,

        CreatedAt: d.created_at
          ? new Date(d.created_at.seconds * 1000).toLocaleString()
          : "",
      });
    });

    // ✅ Excel create
    const worksheet = XLSX.utils.json_to_sheet(users);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    XLSX.writeFile(workbook, "users.xlsx");

    console.log("✅ users.xlsx created successfully");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

exportUsers();



// Run Command - node exportUsers.js
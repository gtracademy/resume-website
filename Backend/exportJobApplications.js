const admin = require("firebase-admin");
const XLSX = require("xlsx");

// 🔑 Firebase key
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportJobApplications() {
  try {
    const snapshot = await db.collection("jobApplications").get();

    const data = [];

    snapshot.forEach((doc) => {
      const d = doc.data();

      data.push({
        ID: doc.id,
        Name: d.fullName || "",
        Email: d.email || "",
        Phone: d.phone || "",
        JobID: d.jobId || "",
        ResumeID: d.resumeId || "",
        ResumeURL: d.resumeUrl || "",
        Experience: d.experience || "",

        // ✅ Nested data handle
        Education:
          d.selectedResume?.data?.educations
            ?.map((e) => e.degree)
            .join(", ") || "",

        Skills:
          d.selectedResume?.data?.skills
            ?.map((s) => s.name)
            .join(", ") || "",

        CreatedAt: d.created_at
          ? new Date(d.created_at.seconds * 1000).toLocaleString()
          : "",
      });
    });

    // ✅ Convert to Excel
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Job Applications");

    XLSX.writeFile(workbook, "jobApplications.xlsx");

    console.log("✅ Excel file created: jobApplications.xlsx");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

exportJobApplications();



// Run Command - node exportJobApplications.js
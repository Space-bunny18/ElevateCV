
console.log("RESULT PAGE LOADED");

console.log(localStorage.getItem("resumeAnalysis"));
console.log("RESULT PAGE LOADED");

const raw = localStorage.getItem("resumeAnalysis");

console.log("RAW:", raw);

if (!raw) {
    alert("No data found in localStorage");
    // DON'T redirect yet
}

const analysis = raw ? JSON.parse(raw) : {};
// =======================
// Resume Information
// =======================

document.addEventListener("DOMContentLoaded", () => {

    const raw = localStorage.getItem("resumeAnalysis");
    const analysis = raw ? JSON.parse(raw) : {};

    const resumeName = localStorage.getItem("resumeName");
    const selectedRole = localStorage.getItem("selectedRole");

    document.getElementById("resumeName").textContent =
        resumeName || "Unknown Resume";

    document.getElementById("jobRoleName").textContent =
        selectedRole || "Not Selected";

    let rating = "Needs Improvement";

    if (analysis.score >= 90) {
        rating = "Excellent";
    } else if (analysis.score >= 75) {
        rating = "Very Good";
    } else if (analysis.score >= 60) {
        rating = "Good";
    } else if (analysis.score >= 40) {
        rating = "Average";
    }

    document.getElementById("resumeRating").textContent = rating;

});

// =======================
// ATS Score
// =======================

const scoreElement = document.getElementById("scoreValue");

const circle = document.querySelector(".progress");

const radius = 95;

const circumference = 2 * Math.PI * radius;

circle.style.strokeDasharray = circumference;

let current = 0;

const finalScore = analysis.score;

const counter = setInterval(()=>{

    current++;

    scoreElement.textContent=current+"%";

    const offset = circumference - (current/100)*circumference;

    circle.style.strokeDashoffset = offset;

    if(current>=finalScore){

        clearInterval(counter);

    }

},20);
// =======================
// Detected Skills
// =======================

const skillsContainer = document.getElementById("skillsContainer");

skillsContainer.innerHTML = "";

if (analysis.skills && analysis.skills.length > 0) {

    analysis.skills.forEach(skill => {

        const span = document.createElement("span");

        span.textContent = skill;

        skillsContainer.appendChild(span);

    });

} else {

    skillsContainer.innerHTML =
        "<p>No skills detected.</p>";

}

// =======================
// Missing Skills
// =======================

const missingContainer =
    document.getElementById("missingSkillsContainer");

missingContainer.innerHTML = "";

if (analysis.missingSkills && analysis.missingSkills.length > 0) {

    analysis.missingSkills.forEach(skill => {

        const span = document.createElement("span");

        span.textContent = skill;

        missingContainer.appendChild(span);

    });

} else {

    missingContainer.innerHTML =
        "<p>No missing skills 🎉</p>";

}

// =======================
// Suggestions
// =======================

const suggestions =
    document.getElementById("suggestionsList");

suggestions.innerHTML = "";

if (analysis.suggestions && analysis.suggestions.length > 0) {

    analysis.suggestions.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        suggestions.appendChild(li);

    });

} else {

    suggestions.innerHTML =
        "<li>No suggestions. Great resume! 🎉</li>";

}
// =======================
// ATS CHECKLIST
// =======================

const checklistContainer =
document.getElementById("checklistContainer");

checklistContainer.innerHTML = "";

Object.entries(analysis.sections).forEach(([section, found])=>{

    const item = document.createElement("div");

    item.className =
        found
        ? "check-item success"
        : "check-item fail";

    item.innerHTML = `

        <div class="check-left">

            <div class="check-icon">

                ${found ? "✓" : "✕"}

            </div>

            <span>

                ${section.charAt(0).toUpperCase()+section.slice(1)}

            </span>

        </div>

        <span class="check-status">

            ${found ? "Found" : "Missing"}

        </span>

    `;

    checklistContainer.appendChild(item);

});

// =======================
// Resume Statistics
// =======================

document.getElementById("skillCount").textContent =
analysis.skills.length;

document.getElementById("missingCount").textContent =
analysis.missingSkills.length;

document.getElementById("atsStat").textContent =
analysis.score + "%";

let grade = "";
let stars = "";

if (analysis.score >= 90){

    grade = "A+";
    stars = "★★★★★";

}
else if (analysis.score >= 80){

    grade = "A";
    stars = "★★★★☆";

}
else if (analysis.score >= 70){

    grade = "B";
    stars = "★★★☆☆";

}
else if (analysis.score >= 50){

    grade = "C";
    stars = "★★☆☆☆";

}
else{

    grade = "D";
    stars = "★☆☆☆☆";

}

document.getElementById("overallRating").textContent = "Grade " + grade;
document.getElementById("overallStars").textContent = stars;
let chance = Math.min(95, analysis.score + 4);

let chanceText = "";

if (chance >= 85){

    chanceText = "Excellent";

}
else if (chance >= 70){

    chanceText = "High";

}
else if (chance >= 50){

    chanceText = "Moderate";

}
else{

    chanceText = "Low";

}

document.getElementById("interviewChance").innerHTML = `
    <div class="chance-percent">${chance}%</div>
    <div class="chance-text">${chanceText} Chance</div>
`;
// =======================
// Resume Strengths
// =======================

const strengthsList = document.getElementById("strengthsList");

strengthsList.innerHTML = "";

if (analysis.strengths && analysis.strengths.length > 0) {
    console.log("Strengths:", analysis.strengths);
    analysis.strengths.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        strengthsList.appendChild(li);

    });

} else {

    strengthsList.innerHTML =
        "<li>No strengths detected.</li>";

}


// =======================
// Resume Weaknesses
// =======================

const weaknessesList = document.getElementById("weaknessesList");

weaknessesList.innerHTML = "";

if (analysis.weaknesses && analysis.weaknesses.length > 0) {

    analysis.weaknesses.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        weaknessesList.appendChild(li);

    });

} else {

    weaknessesList.innerHTML =
        "<li>No weaknesses detected.</li>";

}


// =======================
// AI Recommendations
// =======================

const recommendationsList = document.getElementById("recommendationsList");

recommendationsList.innerHTML = "";

if (analysis.recommendations && analysis.recommendations.length > 0) {

    analysis.recommendations.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item;

        recommendationsList.appendChild(li);

    });

} else {

    recommendationsList.innerHTML =
        "<li>No recommendations available.</li>";

}

// =======================
// AI SUMMARY
// =======================

document.getElementById("verdictText").textContent =
analysis.summary;
// =======================
// DOWNLOAD PDF REPORT
// =======================

const downloadBtn = document.getElementById("downloadReport");
function cleanPdfText(text){

    if(!text) return "";

    return String(text)

        .replace(/[*#`]/g,"")          // Remove markdown
        .replace(/[•●▪]/g,"-")         // Replace bullets
        .replace(/✓/g,"Yes")           // Replace tick
        .replace(/\r?\n/g," ")         // Remove new lines
        .replace(/\s+/g," ")           // Remove extra spaces
        .trim();

}

function downloadReport(){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();

    let y = 0;
    const pageHeight = doc.internal.pageSize.getHeight();
    function checkPage(requiredSpace = 15){

        if(y + requiredSpace > pageHeight - 20){

            doc.addPage();

            y = 20;

        }

    }

// =====================================
// HEADER
// =====================================

checkPage(30);

doc.setFillColor(32,58,124);
doc.rect(0,0,pageWidth,42,"F");

doc.setTextColor(255,255,255);

doc.setFont("helvetica","bold");
doc.setFontSize(24);

doc.text(
    "ElevateCV",
    pageWidth/2,
    17,
    {align:"center"}
);

doc.setFont("helvetica","normal");
doc.setFontSize(12);

doc.text(
    "AI Resume Analysis Report",
    pageWidth/2,
    28,
    {align:"center"}
);

doc.setDrawColor(255);
doc.setLineWidth(0.4);

doc.line(
    20,
    36,
    pageWidth-20,
    36
);

y = 55;

// =====================================
// RESUME INFORMATION
// =====================================

checkPage(45);

doc.setFillColor(248,249,255);

doc.roundedRect(
    20,
    y,
    170,
    42,
    4,
    4,
    "F"
);

doc.setDrawColor(220);

doc.roundedRect(
    20,
    y,
    170,
    42,
    4,
    4
);

doc.setTextColor(35);

doc.setFont("helvetica","bold");

doc.setFontSize(16);

doc.text(
    "Resume Information",
    28,
    y+10
);

doc.setFontSize(11);

doc.setFont("helvetica","normal");

doc.text(
    `Resume : ${analysis.filename}`,
    28,
    y+20
);

doc.text(
    `Role : ${analysis.role}`,
    28,
    y+28
);

doc.text(
    `Generated : ${new Date().toLocaleDateString()}`,
    28,
    y+36
);

y += 55;
// =====================================
// ATS SCORE CARD
// =====================================

checkPage(55);

// Card Background
doc.setFillColor(235,242,255);

doc.roundedRect(
    20,
    y,
    170,
    52,
    6,
    6,
    "F"
);

// Card Border
doc.setDrawColor(185,205,255);

doc.roundedRect(
    20,
    y,
    170,
    52,
    6,
    6
);

// Title
doc.setFont("helvetica","bold");
doc.setFontSize(16);
doc.setTextColor(30);

doc.text(
    "ATS SCORE",
    28,
    y + 12
);

// Score
doc.setFontSize(28);
doc.setTextColor(52,95,255);

doc.text(
    `${analysis.score}%`,
    160,
    y + 18,
    { align: "right" }
);

// Grade
let pdfGrade = "";

if (analysis.score >= 90){

    pdfGrade = "A+";

}
else if (analysis.score >= 80){

    pdfGrade = "A";

}
else if (analysis.score >= 70){

    pdfGrade = "B";

}
else if (analysis.score >= 50){

    pdfGrade = "C";

}
else{

    pdfGrade = "D";

}

doc.setFontSize(14);
doc.setTextColor(60);

doc.text(
    `Overall Grade : ${pdfGrade}`,
    28,
    y + 30
);

// Recruiter Opinion
doc.setFontSize(11);
doc.setTextColor(90);

doc.text(
    "Higher ATS scores improve the chances of passing recruiter screening.",
    28,
    y + 42
);

y += 65;

    // =====================================
    // SKILLS
    // =====================================
checkPage(25);
    doc.setTextColor(20);

    doc.setFontSize(16);

    doc.setFont("helvetica","bold");

    doc.text("Detected Skills",20,y);

    y+=10;

    doc.setFontSize(11);

    doc.setFont("helvetica","normal");

    analysis.skills.forEach(skill=>{
checkPage(12);
        doc.setFillColor(227,236,255);

        doc.roundedRect(20,y-5,45,8,2,2,"F");

        doc.text(skill,24,y);

        y+=10;

    });

    y+=8;

    // =====================================
    // MISSING SKILLS
    // =====================================
checkPage(25);
    doc.setFont("helvetica","bold");

    doc.setFontSize(16);

    doc.text("Missing Skills",20,y);

    y+=10;

    doc.setFontSize(11);

    doc.setFont("helvetica","normal");

    analysis.missingSkills.forEach(skill=>{
checkPage(12);
        doc.setFillColor(255,236,236);

        doc.roundedRect(20,y-5,45,8,2,2,"F");

        doc.text(skill,24,y);

        y+=10;

    });

    y+=10;

    // =====================================
    // CHECKLIST
    // =====================================
checkPage(25);
    doc.setFont("helvetica","bold");

    doc.setFontSize(16);

    doc.text("ATS Checklist",20,y);

    y+=10;

    doc.setFont("helvetica","normal");

    Object.entries(analysis.sections).forEach(([section, found]) => {

    checkPage(10);

    const status = found ? "FOUND" : "MISSING";

    doc.text(
        `${section.toUpperCase()} : ${status}`,
        24,
        y
    );

    y += 8;

});

    y+=10;
    // =====================================
// STRENGTHS
// =====================================

checkPage(35);

doc.setFont("helvetica","bold");
doc.setFontSize(16);
doc.setTextColor(20);

doc.text("Resume Strengths",20,y);

y += 10;

doc.setFont("helvetica","normal");
doc.setFontSize(11);

analysis.strengths.forEach(item=>{

    checkPage(10);

    const text = doc.splitTextToSize(
    "- " + cleanPdfText(item),
    155
);

doc.text(text,25,y);

y += text.length * 6;

    y += 8;

});

y += 10;


// =====================================
// WEAKNESSES
// =====================================

checkPage(35);

doc.setFont("helvetica","bold");
doc.setFontSize(16);

doc.text("Areas to Improve",20,y);

y += 10;

doc.setFont("helvetica","normal");
doc.setFontSize(11);

analysis.weaknesses.forEach(item=>{

    checkPage(10);
const text = doc.splitTextToSize(
    "- " + cleanPdfText(item),
    155
);

doc.text(text,25,y);

y += text.length * 6;
    y += 8;

});

y += 12;
// =====================================
// AI RECRUITER SUMMARY
// =====================================

checkPage(45);

doc.setFillColor(245,248,255);

doc.roundedRect(
    20,
    y,
    170,
    42,
    5,
    5,
    "F"
);

doc.setDrawColor(220);

doc.roundedRect(
    20,
    y,
    170,
    42,
    5,
    5
);

doc.setFont("helvetica","bold");
doc.setFontSize(16);
doc.setTextColor(25);

doc.text(
    "AI Recruiter's Summary",
    28,
    y + 10
);

doc.setFont("helvetica","normal");
doc.setFontSize(11);
doc.setTextColor(70);

const summaryLines = doc.splitTextToSize(
    analysis.summary,
    150
);

doc.text(
    summaryLines,
    28,
    y + 20
);

y += 55;
    // =====================================
    // SUGGESTIONS
    // =====================================
checkPage(25);
    doc.setFont("helvetica","bold");

    doc.setFontSize(16);

    doc.text("AI Suggestions",20,y);

    y+=10;

    doc.setFont("helvetica","normal");

    analysis.suggestions.forEach(item=>{
 checkPage(12);
        const text = doc.splitTextToSize(
    "- " + cleanPdfText(item),
    155
);

doc.text(text,24,y);

y += text.length * 6;

        y+=8;

    });

// =====================================
// FOOTER
// =====================================

const footerY = doc.internal.pageSize.getHeight() - 20;

// Divider
doc.setDrawColor(210);

doc.line(
    20,
    footerY - 8,
    pageWidth - 20,
    footerY - 8
);

// Branding
doc.setFont("helvetica","bold");
doc.setFontSize(11);
doc.setTextColor(40);

doc.text(
    "ElevateCV",
    pageWidth / 2,
    footerY - 1,
    { align: "center" }
);

// Subtitle
doc.setFont("helvetica","normal");
doc.setFontSize(9);
doc.setTextColor(120);

doc.text(
    "AI Resume Analyzer • Version 1.0",
    pageWidth / 2,
    footerY + 5,
    { align: "center" }
);

// Generated Date
doc.setFontSize(8);

doc.text(
    `Generated on ${new Date().toLocaleString()}`,
    pageWidth / 2,
    footerY + 10,
    { align: "center" }
);

// Save PDF
const fileName = (analysis.filename || "Resume")
    .replace(".pdf", "")
    .replace(/\s+/g, "_");

doc.save(`${fileName}_ATS_Report.pdf`);

}
downloadBtn.addEventListener("click", () => {

    downloadBtn.disabled = true;

    downloadBtn.textContent = "Generating Report...";

    setTimeout(() => {

        downloadReport();

        downloadBtn.disabled = false;

        downloadBtn.textContent = "Download Report";

    }, 700);

});
downloadBtn.textContent = "Downloaded ✓";

setTimeout(()=>{

    downloadBtn.textContent = "Download Report";

},1500);

// =======================
// ATS SCORE BREAKDOWN
// =======================

const breakdownContainer =
document.getElementById("breakdownContainer");

breakdownContainer.innerHTML = "";

const maxScores = {

    "Contact Information": 10,

    "Technical Skills": 40,

    "Projects": 20,

    "Education": 10,

    "Experience": 20

};

Object.entries(analysis.breakdown).forEach(([category, score]) => {

    const max = maxScores[category];

    const percentage = (score / max) * 100;

    const row = document.createElement("div");

    row.className = "breakdown-row";

    row.innerHTML = `

        <div class="breakdown-header">

            <span>${category}</span>

            <span>${score}/${max}</span>

        </div>

        <div class="breakdown-bar">

            <div
                class="breakdown-fill"
                style="width:${percentage}%"
            ></div>

        </div>

    `;

    breakdownContainer.appendChild(row);

});

const verdictCard = document.querySelector(".verdict-card");

if (analysis.score >= 80) {

    verdictCard.style.borderColor = "#3BCF6E";

}

else if (analysis.score >= 50) {

    verdictCard.style.borderColor = "#F6C343";

}

else {

    verdictCard.style.borderColor = "#FF5A5F";

}

// ==========================================
// AI RESUME IMPROVEMENT ASSISTANT
// ==========================================

if (analysis.rewrite) {

    // Professional Summary
    document.getElementById("rewriteSummary").textContent =
        analysis.rewrite.summary || "No summary generated.";

    // Suggested Projects
    const projects =
        document.getElementById("rewriteProjects");

    projects.innerHTML = "";

    if (analysis.rewrite.projects) {

        analysis.rewrite.projects.forEach(project => {

            const li = document.createElement("li");

            li.textContent = project;

            projects.appendChild(li);

        });

    }

    // Skills To Learn
    const skills =
        document.getElementById("rewriteSkills");

    skills.innerHTML = "";

    if (analysis.rewrite.skills) {

        analysis.rewrite.skills.forEach(skill => {

            const span = document.createElement("span");

            span.textContent = skill;

            skills.appendChild(span);

        });

    }

    // Certifications
    const certs =
        document.getElementById("rewriteCertificates");

    certs.innerHTML = "";

    if (analysis.rewrite.certifications) {

        analysis.rewrite.certifications.forEach(cert => {

            const li = document.createElement("li");

            li.textContent = cert;

            certs.appendChild(li);

        });

    }

}

// ==========================================
// COPY SUMMARY BUTTON
// ==========================================

document.querySelector(".copy-btn").addEventListener("click", () => {

    const text =
        document.getElementById("rewriteSummary").textContent;

    navigator.clipboard.writeText(text);

    const btn =
        document.querySelector(".copy-btn");

    btn.textContent = "Copied ✓";

    setTimeout(() => {

        btn.textContent = "Copy";

    }, 2000);

});
const API_URL = "http://127.0.0.1:8000";
/* ==========================================
   TOAST NOTIFICATIONS
========================================== */

function showToast(message, type = "info"){

    const toast = document.getElementById("toast");

    toast.textContent = message;

    toast.className = "";

    toast.classList.add(type);

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },3000);

}
let selectedResume = null;
const steps = document.querySelectorAll(".analysis-step");

const progress = document.querySelector(".progress");

let current = 0;

function animateAnalysis(){

    steps.forEach(step => step.classList.remove("active"));

    steps[current].classList.add("active");

    progress.style.width = ((current+1)/steps.length)*100 + "%";

    current++;

    if(current>=steps.length){

        current=0;

    }

}

setInterval(animateAnalysis,1200);

animateAnalysis();

/* ==========================================
   SCROLL REVEAL
========================================== */

const hiddenElements = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

        }

    });

});

hiddenElements.forEach((el)=>observer.observe(el));

/* ==========================================
   FAQ ACCORDION
========================================== */

const faqs = document.querySelectorAll(".faq-item");

faqs.forEach((faq)=>{

    faq.addEventListener("click",()=>{

        faqs.forEach((item)=>{

            if(item!==faq){

                item.classList.remove("active");

            }

        });

        faq.classList.toggle("active");

    });

});

/* ==========================================
   CURSOR GLOW
========================================== */

const glow = document.querySelector(".cursor-glow");

document.addEventListener("mousemove",(e)=>{

    glow.style.left = e.clientX + "px";

    glow.style.top = e.clientY + "px";

});
/* ==========================================
   UPLOAD MODAL
========================================== */

const uploadModal = document.getElementById("uploadModal");

const analyzeBtn = document.getElementById("analyzeBtn");

const navAnalyzeBtn = document.getElementById("navAnalyzeBtn");

const closeModal = document.getElementById("closeModal");

const browseBtn = document.getElementById("browseBtn");

const resumeInput = document.getElementById("resumeInput");

const uploadArea = document.getElementById("uploadArea");

const fileName = document.getElementById("fileName");

const analyzeResume = document.getElementById("analyzeResume");
const jobRole = document.getElementById("jobRole");

function openModal(){

    uploadModal.classList.add("active");

}

analyzeBtn.addEventListener("click",openModal);

navAnalyzeBtn.addEventListener("click",(e)=>{

    e.preventDefault();

    openModal();

});

closeModal.addEventListener("click",()=>{

    uploadModal.classList.remove("active");

});

uploadModal.addEventListener("click",(e)=>{

    if(e.target===uploadModal){

        uploadModal.classList.remove("active");

    }

});

browseBtn.addEventListener("click",()=>{

    resumeInput.click();

});
resumeInput.addEventListener("change", () => {

    const file = resumeInput.files[0];

    if (!file) return;

    validateFile(file);

    // Update Upload Box
    uploadArea.innerHTML = `

        <div class="upload-success">

            <div class="success-icon">✅</div>

            <h3>Resume Uploaded!</h3>

            <p class="uploaded-file">${file.name}</p>

            <p class="file-size">${(file.size / (1024 * 1024)).toFixed(2)} MB</p>

            <button class="browse-btn" id="replaceResume">

                Replace Resume

            </button>

            <small>

                PDF only • Maximum 5 MB

            </small>

        </div>

    `;

    document
        .getElementById("replaceResume")
        .addEventListener("click", () => {

            resumeInput.click();

        });

});
function validateFile(file){

    if(!file) return;

    if(file.type!=="application/pdf"){

        showToast("❌ Only PDF files are allowed.","error");

        return;

    }
    if(
    file.type !== "application/pdf" &&
    !file.name.toLowerCase().endsWith(".pdf")
    ){
        showToast("📄 Please upload a PDF file.","error");
        return;
    }
    if(file.size>5*1024*1024){

       showToast("⚠ Maximum file size is 5 MB.","error");

        return;

    }
    selectedResume = file;
}
uploadArea.addEventListener("dragover",(e)=>{

    e.preventDefault();

    uploadArea.classList.add("dragover");

});
uploadArea.addEventListener("dragleave",()=>{

    uploadArea.classList.remove("dragover");

});

uploadArea.addEventListener("drop",(e)=>{

    e.preventDefault();

    uploadArea.classList.remove("dragover");

    const file = e.dataTransfer.files[0];

    resumeInput.files = e.dataTransfer.files;

    validateFile(file);

});
analyzeResume.addEventListener("click",(e)=>{
    e.preventDefault();
    startAnalysis();
});

async function startAnalysis(e){

    if(e){
        e.preventDefault();
    }

    if(!selectedResume){
        showToast("📄 Please select a PDF first.","error");
        return;
    }

    const uploadCard = document.querySelector(".upload-card");

    uploadCard.innerHTML = `

        <h2>🤖 AI Resume Analysis</h2>

        <p class="upload-subtitle">

            Please wait while ElevateCV analyzes your resume.

        </p>

        <div class="upload-modal">

            <div class="loader-bar">

                <div class="loader-progress"></div>

            </div>

            <div class="analysis-status">

                Initializing...

            </div>

        </div>

        <div class="analysis-steps"> 

            <div class="step active">
                <span>📄</span>
                Reading Resume
            </div>

            <div class="step">
                <span>🧠</span>
                Detecting Skills
            </div>

            <div class="step">
                <span>📊</span>
                Calculating ATS Score
            </div>

            <div class="step">
                <span>🤖</span>
                AI Analysis
            </div>

            <div class="step">
                <span>✅</span>
                Generating Report
            </div>

        </div>

    `;

    await uploadResume();

}
async function uploadResume(){

    const progress = document.querySelector(".loader-progress");
    const status = document.querySelector(".analysis-status");
    const loadingSteps = document.querySelectorAll(".analysis-steps .step");

function activateStep(index, text, width){

    loadingSteps.forEach((step, i) => {

        step.classList.remove("active", "completed");

        if(i < index){
            step.classList.add("completed");
        }
        else if(i === index){
            step.classList.add("active");
        }

    });

    progress.style.width = width;
    status.textContent = text;

}

    const formData = new FormData();

    formData.append("file", selectedResume);
    formData.append("role", jobRole.value);

    try{

        activateStep(0, "Reading Resume...", "15%");

        const response = await fetch(`${API_URL}/upload`,{
            method:"POST",
            body:formData
        });

        if(!response.ok){
            throw new Error("Upload failed");
        }

        progress.style.width = "70%";
        status.textContent = "Analyzing Resume...";

        const result = await response.json();

        activateStep(1, "Detecting Skills...", "35%");
    await new Promise(resolve => setTimeout(resolve, 350));

    activateStep(2, "Calculating ATS Score...", "60%");

    await new Promise(resolve => setTimeout(resolve, 350));

    activateStep(3, "Performing AI Analysis...", "82%");

    await new Promise(resolve => setTimeout(resolve, 350));

    activateStep(4, "Generating Report...", "100%");

    await new Promise(resolve => setTimeout(resolve, 500));

    status.textContent = "Analysis Complete ✓";

        localStorage.setItem(
            "resumeAnalysis",
            JSON.stringify(result)
        );
        localStorage.setItem("resumeName", selectedResume.name);
        localStorage.setItem("selectedRole", jobRole.value);
        showToast("✅ Analysis completed successfully!","success");
        setTimeout(()=>{

            location.assign("./result.html");

        },700);

    }

    catch(error){

        console.error(error);

        showToast("❌ Unable to connect to the backend.","error");

    }

}
function simulateAnalysis(){

    const progress = document.querySelector(".loader-progress");

    const status = document.querySelector(".analysis-status");

    const steps = [

        "Reading PDF...",

        "Extracting Resume Text...",

        "Detecting Skills...",

        "Checking ATS Compatibility...",

        "Finding Missing Keywords...",

        "Generating AI Suggestions...",

        "Analysis Complete ✓"

    ];

    let index = 0;

    const interval = setInterval(()=>{

        progress.style.width=((index+1)/steps.length)*100+"%";

        status.textContent=steps[index];

        index++;

        if(index===steps.length){

            clearInterval(interval);

            setTimeout(()=>{

                setTimeout(() => {
                    console.log("Redirecting now...");
                    location.assign("./result.html");
                }, 1000);

            },1000);

        }

    },900);

}

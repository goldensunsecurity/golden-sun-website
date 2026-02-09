// Function to switch between sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
    setTimeout(revealOnScroll, 100);
    window.scrollTo(0, 0);
}

// Function for Scroll Animations
function revealOnScroll() {
    var reveals = document.querySelectorAll(".reveal");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// Handle Staff Login Button
document.querySelector('.login-btn').addEventListener('click', function(e) {
    e.preventDefault();
    alert("Staff Portal: Please contact HR for access credentials.");
});

// --- FINAL FIXED FORM SUBMISSION ---
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enquiryForm');
    
    // Only run this if the form actually exists on the page
    if (form) {
        form.addEventListener('submit', function(e) {
            
            // 1. BLOCK the form from submitting immediately
            e.preventDefault();

            // 2. CHECK if the user clicked the Captcha
            const recaptchaResponse = grecaptcha.getResponse();

            if (!recaptchaResponse) {
                // If Captcha is empty, alert the user and STOP here.
                alert('Please verify that you are not a robot.');
                return; 
            }

            // 3. If Captcha is valid, RELEASE the form to Web3Forms
            // This bypasses the old "mailto" code and sends the email properly.
            form.submit();
        });
    }
});
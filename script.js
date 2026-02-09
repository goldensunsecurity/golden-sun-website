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

// --- FINAL FORM SUBMISSION LOGIC ---
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('enquiryForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop default submit
            
            // Check Captcha
            const recaptchaResponse = grecaptcha.getResponse();
            if (!recaptchaResponse) {
                alert('Please check the box to prove you are not a robot.');
                return;
            }

            // Submit to Web3Forms
            form.submit(); 
        });
    }
});
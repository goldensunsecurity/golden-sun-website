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

// Handle "Staff Login" Button
document.querySelector('.login-btn').addEventListener('click', function(e) {
    e.preventDefault();
    alert("Staff Portal: Please contact HR for access credentials.");
});

// Handle "Request a Quote" Form Submission
document.getElementById('enquiryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get values from ALL form inputs
    const name = document.getElementById('name').value;
    const company = document.getElementById('company').value;       // NEW
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const service = document.getElementById('service').value;
    const staffCount = document.getElementById('staff_count').value; // NEW
    const duration = document.getElementById('duration').value;      // NEW
    const location = document.getElementById('location').value;
    const message = document.getElementById('message').value;
    
    // Format the email body cleanly
    const emailBody = 
    `REQUEST FOR QUOTE%0D%0A` +
    `--------------------------------%0D%0A` +
    `Name: ${name}%0D%0A` +
    `Company: ${company}%0D%0A` +
    `Phone: ${phone}%0D%0A` +
    `Email: ${email}%0D%0A` +
    `--------------------------------%0D%0A` +
    `Service Required: ${service}%0D%0A` +
    `Number of Staff: ${staffCount}%0D%0A` +
    `Duration: ${duration}%0D%0A` +
    `Location: ${location}%0D%0A` +
    `--------------------------------%0D%0A` +
    `Specific Message: ${message}`;
    
    const mailtoLink = `mailto:info@goldensunsecurity.com?subject=Quote Request: ${service} - ${company || name}&body=${emailBody}`;
    
    // Redirect to email client
    window.location.href = mailtoLink;
});
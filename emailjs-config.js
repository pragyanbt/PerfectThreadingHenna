// EmailJS Configuration
// Replace these placeholder values with your actual EmailJS credentials

const EMAILJS_CONFIG = {
    // Your EmailJS Public Key (found in Account > API Keys)
    PUBLIC_KEY: "3T8j3ib9sK0E9lolv",
    
    // Your EmailJS Service ID (found in Email Services)
    SERVICE_ID: "service_yeojsri",
    
    // Your EmailJS Template ID for auto-reply to customers
    TEMPLATE_ID: "template_zsykeqj",
    
    // Your EmailJS Template ID for appointment notifications to you (create this new template)
    APPOINTMENT_TEMPLATE_ID: "template_smzc033",
    
    // Recipient email address (where appointment requests will be sent)
    RECIPIENT_EMAIL: "perfect.tah.longmont@gmail.com"
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMAILJS_CONFIG;
}

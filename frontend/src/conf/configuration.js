var config = {
    adminEmail: 'admin@admin.com', // The website will consider this email  as an admin
    brand: {
        useImg: true, // 320X70 Preferable Size , replace with true if you want to use image logo. and keep false if you want to keep the logo as text
        name: 'Resumen', // This will be shown in the absence of the logo
    },
    // PayPal Configuration
    paypalClientID: '', // Replace with your actual PayPal Client ID
    paypalEnvironment: 'sandbox', // Use 'sandbox' for testing, 'live' for production
    // Legacy PayPal config (remove this after updating)

    stripe_publishable_key: '', // Make sure its th publishable key
    backendUrl: 'srv1128102.hstgr.cloud/', // our domain in this format :  domain.com . if you use subdomain for the app then it should be like : subdomain.domain.com,
    provider: 'https',
};
export default config;

// Configuration for different environments
const config = {
  // API Base URL - automatically detects environment
  apiBaseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? "http://localhost:5000" 
    : "https://college-placement-portal-backend.onrender.com", // Your Render URL will be here
  
  // Environment detection
  isDevelopment: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  isProduction: !(window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
};

// Helper function to build API URLs
function getApiUrl(endpoint) {
  return `${config.apiBaseUrl}${endpoint}`;
}

// Export for use in other files
window.appConfig = config;
window.getApiUrl = getApiUrl; 
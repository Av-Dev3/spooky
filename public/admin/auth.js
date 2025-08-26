// Simple admin authentication check
function checkAdminAuth() {
  const cookies = document.cookie.split(';');
  const adminAuth = cookies.find(cookie => cookie.trim().startsWith('admin_auth='));
  
  if (!adminAuth || adminAuth.split('=')[1] !== 'ok') {
    // Not authenticated, redirect to login
    const currentPath = window.location.pathname;
    if (currentPath !== '/admin/login.html') {
      window.location.href = `/admin/login.html?next=${encodeURIComponent(currentPath)}`;
    }
  }
}

// Check auth when page loads
document.addEventListener('DOMContentLoaded', checkAdminAuth);

// Export for use in other scripts
window.checkAdminAuth = checkAdminAuth;

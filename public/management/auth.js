// Admin authentication check
function checkAdminAuth() {
  console.log('Checking admin authentication...');
  
  const cookies = document.cookie.split(';');
  const adminAuth = cookies.find(cookie => cookie.trim().startsWith('admin_auth='));
  
  console.log('Admin auth cookie:', adminAuth ? 'Found' : 'Not found');
  
  if (!adminAuth || adminAuth.split('=')[1] !== 'ok') {
    console.log('Not authenticated, redirecting to login');
    // Not authenticated, redirect to login
    const currentPath = window.location.pathname;
    if (currentPath !== '/auth.html') {
      window.location.href = `/auth.html?next=${encodeURIComponent(currentPath)}`;
      return false;
    }
  } else {
    console.log('Authentication successful');
    return true;
  }
}

// Logout function
function adminLogout() {
  // Clear the admin cookie
  document.cookie = 'admin_auth=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  
  // Redirect to auth page
  window.location.href = '/auth.html';
}

// Check auth when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Only check auth if we're on an admin page
  const currentPath = window.location.pathname;
  if (currentPath.startsWith('/management/') && currentPath !== '/auth.html') {
    checkAdminAuth();
  }
});

// Export functions for use in other scripts
window.checkAdminAuth = checkAdminAuth;
window.adminLogout = adminLogout;

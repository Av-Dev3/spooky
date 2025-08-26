// Simple admin authentication check
function checkAdminAuth() {
  console.log('Checking admin auth...');
  console.log('All cookies:', document.cookie);
  
  const cookies = document.cookie.split(';');
  const adminAuth = cookies.find(cookie => cookie.trim().startsWith('admin_auth='));
  
  console.log('Found admin_auth cookie:', adminAuth);
  
  if (!adminAuth || adminAuth.split('=')[1] !== 'ok') {
    console.log('Not authenticated, redirecting to login');
    // Not authenticated, redirect to login
    const currentPath = window.location.pathname;
    if (currentPath !== '/management/login.html') {
      window.location.href = `/management/login.html?next=${encodeURIComponent(currentPath)}`;
    }
  } else {
    console.log('Authenticated successfully!');
  }
}

// Check auth when page loads
document.addEventListener('DOMContentLoaded', checkAdminAuth);

// Export for use in other scripts
window.checkAdminAuth = checkAdminAuth;

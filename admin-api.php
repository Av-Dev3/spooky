<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Simple authentication (you should implement proper authentication in production)
session_start();

// Check if admin is logged in (simple check - you should implement proper auth)
if (!isset($_SESSION['admin_logged_in']) && $_GET['action'] !== 'login') {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'upload':
        handleFileUpload();
        break;
    case 'save-shop':
        saveShopData();
        break;
    case 'save-gallery':
        saveGalleryData();
        break;
    case 'save-links':
        saveLinksData();
        break;
    case 'login':
        handleLogin();
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action']);
        break;
}

function handleFileUpload() {
    if (!isset($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded']);
        return;
    }
    
    $file = $_FILES['image'];
    $uploadDir = 'assets/uploads/';
    
    // Create uploads directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($file['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Only images are allowed.']);
        return;
    }
    
    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid() . '.' . $extension;
    $filepath = $uploadDir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $filepath)) {
        echo json_encode([
            'success' => true,
            'filename' => $filename,
            'filepath' => $filepath,
            'url' => $filepath
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to upload file']);
    }
}

function saveShopData() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        return;
    }
    
    $filepath = 'data/shop.json';
    if (file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'message' => 'Shop data saved successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save shop data']);
    }
}

function saveGalleryData() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        return;
    }
    
    $filepath = 'data/gallery.json';
    if (file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'message' => 'Gallery data saved successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save gallery data']);
    }
}

function saveLinksData() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
        return;
    }
    
    $filepath = 'data/links.json';
    if (file_put_contents($filepath, json_encode($data, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'message' => 'Links data saved successfully']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save links data']);
    }
}

function handleLogin() {
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Simple login - you should implement proper authentication
    $username = $data['username'] ?? '';
    $password = $data['password'] ?? '';
    
    // Default admin credentials (change these!)
    if ($username === 'admin' && $password === 'spooky123') {
        $_SESSION['admin_logged_in'] = true;
        echo json_encode(['success' => true, 'message' => 'Login successful']);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid credentials']);
    }
}
?>

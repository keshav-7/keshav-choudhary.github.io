<?php
// Set headers for CORS and JSON
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->name) || !isset($data->email) || !isset($data->message)) {
    echo json_encode(["success" => false, "error" => "Invalid input"]);
    exit;
}

// Load credentials from environment or manually set them
$service_id = getenv("EMAILJS_SERVICE_ID") ?: "your_service_id";
$template_id = getenv("EMAILJS_TEMPLATE_ID") ?: "your_template_id";
$public_key = getenv("EMAILJS_PUBLIC_KEY") ?: "your_public_key";

// Prepare request to EmailJS REST API
$url = "https://api.emailjs.com/api/v1.0/email/send";

$payload = json_encode([
    "service_id" => $service_id,
    "template_id" => $template_id,
    "user_id" => $public_key, // public_key
    "template_params" => [
        "name" => $data->name,
        "email" => $data->email,
        "message" => $data->message,
        "title" => $data->message,
    ]
]);

$headers = [
    "Content-Type: application/json",
    "Authorization: Bearer $private_key"
];

// Send POST request via curl
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpcode === 200) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $response]);
}

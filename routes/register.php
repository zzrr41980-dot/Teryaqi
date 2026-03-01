<?php

require_once __DIR__ . "/../config/database.php";

$db = new Database();
$conn = $db->connect();

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->email) || !isset($data->password)) {
    echo json_encode(["message" => "Invalid Data"]);
    exit;
}

$checkQuery = "SELECT id FROM users WHERE email = :email";
$checkStmt = $conn->prepare($checkQuery);
$checkStmt->bindParam(":email", $data->email);
$checkStmt->execute();

if ($checkStmt->rowCount() > 0) {
    echo json_encode(["message" => "Email Already Exists"]);
    exit;
}

$hashedPassword = password_hash($data->password, PASSWORD_BCRYPT);

$query = "INSERT INTO users (full_name, email, password, phone)
          VALUES (:full_name, :email, :password, :phone)";

$stmt = $conn->prepare($query);
$stmt->bindParam(":full_name", $data->full_name);
$stmt->bindParam(":email", $data->email);
$stmt->bindParam(":password", $hashedPassword);
$stmt->bindParam(":phone", $data->phone);

if ($stmt->execute()) {
    echo json_encode(["message" => "User Registered Successfully"]);
} else {
    echo json_encode(["message" => "Registration Failed"]);
}
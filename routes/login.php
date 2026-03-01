<?php

require_once __DIR__ . "/../config/database.php";

$db = new Database();
$conn = $db->connect();

$data = json_decode(file_get_contents("php://input"));

$query = "SELECT * FROM users WHERE email = :email";
$stmt = $conn->prepare($query);
$stmt->bindParam(":email", $data->email);
$stmt->execute();

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($data->password, $user['password'])) {

    echo json_encode([
        "message" => "Login Successful",
        "user_id" => $user['id'],
        "full_name" => $user['full_name']
    ]);

} else {
    echo json_encode(["message" => "Invalid Email or Password"]);
}
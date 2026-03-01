<?php

require_once __DIR__ . "/../config/database.php";

$db = new Database();
$conn = $db->connect();

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->user_id)) {
    echo json_encode(["message" => "Invalid Data"]);
    exit;
}

$query = "INSERT INTO device_logs (user_id, device_status, sensor_value)
          VALUES (:user_id, :device_status, :sensor_value)";

$stmt = $conn->prepare($query);
$stmt->bindParam(":user_id", $data->user_id);
$stmt->bindParam(":device_status", $data->device_status);
$stmt->bindParam(":sensor_value", $data->sensor_value);

if ($stmt->execute()) {
    echo json_encode(["message" => "Device Data Saved"]);
} else {
    echo json_encode(["message" => "Failed"]);
}
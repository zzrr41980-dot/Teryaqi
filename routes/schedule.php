<?php

require_once __DIR__ . "/../config/database.php";

$db = new Database();
$conn = $db->connect();

$data = json_decode(file_get_contents("php://input"));

if (!$data || !isset($data->medication_id)) {
    echo json_encode(["message" => "Invalid Data"]);
    exit;
}

$query = "INSERT INTO schedules (medication_id, scheduled_time)
          VALUES (:medication_id, :scheduled_time)";

$stmt = $conn->prepare($query);
$stmt->bindParam(":medication_id", $data->medication_id);
$stmt->bindParam(":scheduled_time", $data->scheduled_time);

if ($stmt->execute()) {
    echo json_encode(["message" => "Schedule Created"]);
} else {
    echo json_encode(["message" => "Failed"]);
}
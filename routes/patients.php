<?php
require_once "config/database.php";
$db = new Database();
$conn = $db->connect();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "POST") {

    $data = json_decode(file_get_contents("php://input"));

    if (!$data || !isset($data->user_id) || !isset($data->full_name)) {
        echo json_encode(["message" => "Invalid Data"]);
        exit;
    }

    $query = "INSERT INTO patients (user_id, full_name) VALUES (:user_id, :full_name)";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":full_name", $data->full_name);

    echo json_encode([
        "message" => $stmt->execute() ? "Patient Added" : "Failed"
    ]);
}


if ($method === "GET") {

    if (!isset($_GET['user_id'])) {
        echo json_encode([]);
        exit;
    }

    $stmt = $conn->prepare("SELECT id, full_name FROM patients WHERE user_id = :user_id");
    $stmt->bindParam(":user_id", $_GET['user_id']);
    $stmt->execute();

    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}
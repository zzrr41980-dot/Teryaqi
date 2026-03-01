<?php

require_once __DIR__ . "/../config/database.php";

$db = new Database();
$conn = $db->connect();

$method = $_SERVER['REQUEST_METHOD'];


// ================== ADD MEDICATION ==================
if ($method === "POST") {

    $data = json_decode(file_get_contents("php://input"));

    $query = "INSERT INTO medications (user_id, medicine_name, dosage)
              VALUES (:user_id, :medicine_name, :dosage)";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":medicine_name", $data->medicine_name);
    $stmt->bindParam(":dosage", $data->dosage);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Medication Added"]);
    } else {
        echo json_encode(["message" => "Failed"]);
    }
}


// ================== GET MEDICATIONS ==================
if ($method === "GET") {

    if (!isset($_GET['user_id'])) {
        echo json_encode(["message" => "User ID Required"]);
        exit;
    }

    $user_id = $_GET['user_id'];

    $query = "SELECT * FROM medications WHERE user_id = :user_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($data);
}
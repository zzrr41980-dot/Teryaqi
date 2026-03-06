<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET");

include_once '../../config/database.php';
include_once '../../includes/medication.php';

$database = new Database();
$db = $database->getConnection();

$medication = new Medication($db);

$patient_id = isset($_GET['patient_id']) ? $_GET['patient_id'] : die();

$medications_list = $medication->getForPatient($patient_id);

if($medications_list) {
    http_response_code(200);
    echo json_encode($medications_list);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "No medications found for this patient."));
}
?>

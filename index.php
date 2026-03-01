<?php

header("Content-Type: application/json");

$request = $_SERVER['REQUEST_URI'];

if (strpos($request, "register") !== false) {
    require "routes/register.php";
} 
elseif (strpos($request, "login") !== false) {
    require "routes/login.php";
}
elseif (strpos($request, "medications") !== false) {
    require "routes/medications.php";
}
elseif (strpos($request, "schedule") !== false) {
    require "routes/schedule.php";
}
elseif (strpos($request, "device-data") !== false) {
    require "routes/device.php";
}
else {
    echo json_encode(["message" => "Endpoint Not Found"]);
}
<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$service = $_GET["service"];

include("./pdo.php");
$pdo = PdoGLC::getPdoGLC();

switch ($service) {

}
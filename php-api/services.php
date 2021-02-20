<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$service = $_GET["service"];

include("./pdo.php");
$pdo = PdoGLC::getPdoGLC();

switch ($service) {
    case "addPlayer": {
        $idPlayer = $_GET['idPlayer'];
        $ret = $pdo->addPlayer($idPlayer);
        echo json_encode($ret);
        break;
    }
    
    case "addRole": {
        $idRole = $_GET['idRole'];
        $ret = $pdo->addRole($idRole);
        echo json_encode($ret);
        break;
    }
    
    case "assignRole": {
        $idPlayer = $_GET['idPlayer'];
        $idRole = $_GET['idRole'];
        $ret = $pdo->assignRole($idPlayer, $idRole);
        echo json_encode($ret);
        break;
    }

    case "getPlayersWithRole": {
        $idRole = $_GET['idRole'];
        $players = $pdo->getPlayersWithRole($idRole);
        echo json_encode($players);
        break;
    }

    case "deleteAssignement": {
        $idPlayer = $_GET['idPlayer'];
        $idRole = $_GET['idRole'];
        $ret = $pdo->deleteAssignement($idPlayer, $idRole);
        echo json_encode($ret);
        break;
    }

    case "clearGame": {
		$ret = $pdo->clearGame();
        echo json_encode($ret);
        break;
	}
}
<?php

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$service = $_GET["service"];

include("./pdo.php");
$pdo = PdoGLC::getPdoGLC();

switch ($service) {
    case "initdb": {
        $lstRolesByPlayer = json_decode(file_get_contents('php://input'));
        $ret = $pdo->initdb($lstRolesByPlayer);
        echo json_encode($ret);
        break;
    }
    
    case "addPlayer": {
        $player = json_decode(file_get_contents('php://input'));
        $ret = $pdo->addPlayer($player);
        echo json_encode($ret);
        break;
    }
    
    case "addRole": {
        $role = json_decode(file_get_contents('php://input'));
        $ret = $pdo->addRole($role);
        echo json_encode($ret);
        break;
    }
    
    case "assignRole": {
        $assignement = json_decode(file_get_contents('php://input'));
        $ret = $pdo->assignRole($assignement);
        echo json_encode($ret);
        break;
    }

    case "assignRoles": {
        $lstAssignements = json_decode(file_get_contents('php://input'));
        $ret = $pdo->assignRoles($lstAssignements);
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
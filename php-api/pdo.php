<?php

class PdoGLC
{
	private static $serveur = '';
	private static $bdd = '';
	private static $user = '';
	private static $mdp = '';
	private static $monPdo;
	private static $monPdoGLC = null;

	/**
	 * Constructeur privé, crée l'instance de PDO qui sera sollicitée
	 * pour toutes les méthodes de la classe
	 */
	private function __construct()
	{	
		include("./config.php");
		PdoGLC::$serveur = $serveur;
		PdoGLC::$bdd = $bdd;
		PdoGLC::$user = $user;
		PdoGLC::$mdp = $mdp;

		PdoGLC::$monPdo = new PDO(PdoGLC::$serveur . ';' . PdoGLC::$bdd, PdoGLC::$user, PdoGLC::$mdp);
	}

	private function _destruct()
	{
		PdoGLC::$monPdo = null;
	}

	/**
	 * Fonction qui crée l'unique instance de la classe
	 * Appel : $instancePdoGLC = PdoGLC::getPdoGLC();
	 * @return l'unique objet de la classe PdoGLC
	 */
	public  static function getPdoGLC()
	{
		if (PdoGLC::$monPdoGLC == null) {
			PdoGLC::$monPdoGLC = new PdoGLC();
		}
		return PdoGLC::$monPdoGLC;
	}

	public static function initdb(array $lstRolesByPlayer) {
		$ret = true;
		foreach ($lstRolesByPlayer as $player) {
			$ret = $ret && PdoGLC::addPlayer($player);
			foreach($player->lstIdRoles as $idRole) {
				$assignement = (object) [
					"idPlayer" => $player->idPlayer,
					"idRole" => $idRole
				];
				$ret = $ret && PdoGLC::assignRole($assignement);
			}
		}
		return $ret;
	}

	public static function addPlayer(Object $player) {
		$sql = "INSERT INTO players VALUES(:idPlayer);";
		$rep = PdoGLC::$monPdo->prepare($sql);
		$rep->bindParam(':idPlayer', $player->idPlayer);
		$ret = $rep->execute();
		return $ret;
	}

	public static function addRole(Object $role) {
		$sql = "INSERT INTO roles VALUES(:idRole);";
		$rep = PdoGLC::$monPdo->prepare($sql);
		$rep->bindParam(':idRole', $role->idRole);
		$ret = $rep->execute();
		return $ret;
	}

	public static function assignRole(Object $assignement) {
		$sql = "INSERT INTO assigned_roles(idPlayer, idRole) VALUES(:idPlayer, :idRole);";
		$rep = PdoGLC::$monPdo->prepare($sql);
		$rep->bindParam(':idPlayer', $assignement->idPlayer);
		$rep->bindParam(':idRole', $assignement->idRole);
		$ret = $rep->execute();
		return $ret;
	}

	public static function assignRoles(array $lstAssignements) {
		$ret = true;
		foreach ($lstAssignements as $assignement) {
			$ret = $ret && PdoGLC::assignRole($assignement);
		}
		return $ret;
	}
	
	public static function getPlayers() {
		$sql = "SELECT * FROM players;";
		$rep = PdoGLC::$monPdo->prepare($sql);
		$rep->execute();
		$lstPlayers = $rep->fetchAll(PDO::FETCH_ASSOC);
		return $lstPlayers;
	}
	
	public static function getRolesByPlayer(string $idPlayer) {
		$sql = "SELECT idRole FROM assigned_roles WHERE idPlayer = :idPlayer;";
		$rep = PdoGLC::$monPdo->prepare($sql);
		$rep->bindParam(':idPlayer', $idPlayer);
		$rep->execute();
		$lstRoles = $rep->fetchAll(PDO::FETCH_ASSOC);
		return $lstRoles;
	}

	public static function getAssignements(array $lstExcludedRoles) {
		$sql = "SELECT * FROM assigned_roles WHERE idRole NOT IN (";
		for ($i = 0; $i < count($lstExcludedRoles); $i++) {
			$sql .= count($lstExcludedRoles) -1 === $i ? ":idRole{$i}" : ":idRole{$i}, ";
		}
		$sql .= ");";
		$rep = PdoGLC::$monPdo->prepare($sql);
		for ($i = 0; $i < count($lstExcludedRoles); $i++) {
			$rep->bindParam(":idRole{$i}", $lstExcludedRoles[$i]);
		}
		$rep->execute();
		$lstAssignements = $rep->fetchAll(PDO::FETCH_ASSOC);
		return $lstAssignements;
	}

	public static function getCountByAssignedRoles(array $lstExcludedRoles) {
		$sql = "SELECT idRole, COUNT(*) AS nbAssigned FROM assigned_roles WHERE idRole NOT IN (";
		for ($i = 0; $i < count($lstExcludedRoles); $i++) {
			$sql .= count($lstExcludedRoles) -1 === $i ? ":idRole{$i}" : ":idRole{$i}, ";
		}
		$sql .= ") GROUP BY idRole;";
		$rep = PdoGLC::$monPdo->prepare($sql);
		for ($i = 0; $i < count($lstExcludedRoles); $i++) {
			$rep->bindParam(":idRole{$i}", $lstExcludedRoles[$i]);
		}
		$rep->execute();
		$lstAssignements = $rep->fetchAll(PDO::FETCH_ASSOC);
		return $lstAssignements;
	}

	public static function deleteAssignement(string $idPlayer, string $idRole) {
		$sql = "DELETE FROM assigned_roles WHERE idPlayer = :idPlayer AND idRole = :idRole;";
		$rep = PdoGLC::$monPdo->prepare($sql);
		$rep->bindParam(':idPlayer', $idPlayer);
		$rep->bindParam(':idRole', $idRole);
		$ret = $rep->execute();
		return $ret;
	}

	public function clearGame() {
		$sql = "DELETE FROM assigned_roles;";
		$rep = PdoGLC::$monPdo->prepare($sql);
		$ret = $rep->execute();

		$sql = "DELETE FROM players;";
		$rep = PdoGLC::$monPdo->prepare($sql);
		$ret = $rep->execute() && $ret;
		return $ret;
	}
}

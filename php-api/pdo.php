<?php

class PdoGLC
{
	private static $serveur = 'pgsql:host=';
	private static $bdd = 'dbname=';
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
		PdoGLC::$monPdo = new PDO(PdoGLC::$serveur . ';' . PdoGLC::$bdd, PdoGLC::$user, PdoGLC::$mdp);
		PdoGLC::$monPdo->query("SET CHARACTER SET utf8");
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
}

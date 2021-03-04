CREATE TABLE players(
    idPlayer varchar(30) NOT NULL PRIMARY KEY
);

CREATE TABLE roles(
    idRole varchar(30) NOT NULL PRIMARY KEY
);

CREATE TABLE assigned_roles(
    idPlayer varchar(30) NOT NULL REFERENCES players(idPlayer),
    idRole varchar(30) NOT NULL REFERENCES roles(idRole),
    PRIMARY KEY (idPlayer, idRole),
    FOREIGN KEY (idPlayer) REFERENCES players(idPlayer),
    FOREIGN KEY (idRole) REFERENCES roles(idRole)
);

INSERT INTO roles (idRole) VALUES 
    -- insert your idRoles here
;
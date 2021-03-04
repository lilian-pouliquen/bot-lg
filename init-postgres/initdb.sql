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
    ('698248264688074845'),
    ('698312905015296141'),
    ('698586065849679943'),
    ('698586035969327196'),
    ('698321718850224238'),
    ('698586269747249232'),
    ('698312915211649036'),
    ('698586001563713577'),
    ('698608875775197215'),
    ('708420099844997200'),
    ('698585821048995980'),
    ('698585863088504905'),
    ('698586138612465725'),
    ('698599994403454976'),
    ('773587858887016499'),
    ('698586202693173288'),
    ('708414712202657812'),
    ('698585942901915668'),
    ('698586171114258472'),
    ('698586246204620891'),
    ('698585896920023130'),
    ('698585973264613476'),
    ('698596029578215584'),
    ('700128189384491039'),
    ('695735167477612676');
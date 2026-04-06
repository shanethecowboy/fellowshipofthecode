-- +goose Up
CREATE TABLE IF NOT EXISTS athletes (
    id    INT          PRIMARY KEY AUTO_INCREMENT,
    name  VARCHAR(100) NOT NULL,
    grade VARCHAR(2)   NOT NULL,
    event VARCHAR(20)  NOT NULL,
    pr    VARCHAR(10)  NOT NULL
);

CREATE TABLE IF NOT EXISTS meets (
    id       INT          PRIMARY KEY AUTO_INCREMENT,
    name     VARCHAR(100) NOT NULL,
    date     DATE         NOT NULL,
    location VARCHAR(150) NOT NULL
);

CREATE TABLE IF NOT EXISTS results (
    id         INT         PRIMARY KEY AUTO_INCREMENT,
    athlete_id INT         NOT NULL,
    meet_id    INT         NOT NULL,
    time       VARCHAR(10) NOT NULL,
    place      INT         NOT NULL,
    FOREIGN KEY (athlete_id) REFERENCES athletes(id),
    FOREIGN KEY (meet_id)    REFERENCES meets(id)
);

-- +goose Down
DROP TABLE IF EXISTS results;
DROP TABLE IF EXISTS meets;
DROP TABLE IF EXISTS athletes;

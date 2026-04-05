-- name: GetAllAthletes :many
SELECT * FROM athletes;

-- name: GetAthleteByID :one
SELECT * FROM athletes WHERE id = ?;

-- name: GetAllMeets :many
SELECT * FROM meets ORDER BY date ASC;

-- name: GetMeetResults :many
SELECT r.id, r.athlete_id, a.name AS athlete_name, r.meet_id, r.time, r.place
FROM results r
JOIN athletes a ON a.id = r.athlete_id
WHERE r.meet_id = ?;

-- name: CreateResult :execlastid
INSERT INTO results (athlete_id, meet_id, time, place)
VALUES (?, ?, ?, ?);

-- name: GetTopTimes :many
SELECT r.id, r.athlete_id, a.name AS athlete_name, r.meet_id, m.name AS meet_name, r.time, r.place
FROM results r
JOIN athletes a ON a.id = r.athlete_id
JOIN meets m ON m.id = r.meet_id
ORDER BY r.time ASC
LIMIT 10;

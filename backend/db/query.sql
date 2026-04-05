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

-- name: GetAllResults :many
SELECT r.id, r.athlete_id, a.name AS athlete_name, r.meet_id, m.name AS meet_name, r.time, r.place
FROM results r
JOIN athletes a ON a.id = r.athlete_id
JOIN meets m ON m.id = r.meet_id
ORDER BY r.meet_id ASC, r.place ASC;

-- name: UpdateAthlete :exec
UPDATE athletes SET name = ?, grade = ?, event = ?, pr = ? WHERE id = ?;

-- name: DeleteAthlete :exec
DELETE FROM athletes WHERE id = ?;

-- name: UpdateMeet :exec
UPDATE meets SET name = ?, date = ?, location = ? WHERE id = ?;

-- name: DeleteMeet :exec
DELETE FROM meets WHERE id = ?;

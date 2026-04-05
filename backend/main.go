package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"fellowshipofthecode.com/backend/db"
	_ "github.com/go-sql-driver/mysql"
)

type server struct {
	queries *db.Queries
}

func main() {
	staticDir := "./static"
	if dir := os.Getenv("STATIC_DIR"); dir != "" {
		staticDir = dir
	}

	port := ":8080"
	if p := os.Getenv("PORT"); p != "" {
		port = ":" + p
	}

	dsn := "root@unix(/var/run/mysqld/mysqld.sock)/fotc?parseTime=true"
	if d := os.Getenv("DATABASE_URL"); d != "" {
		dsn = d
	}

	sqlDB, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal(err)
	}
	defer sqlDB.Close()

	if err := migrate(sqlDB); err != nil {
		log.Fatal(err)
	}

	s := &server{queries: db.New(sqlDB)}

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("GET /api/athletes", s.getAllAthletes)
	mux.HandleFunc("GET /api/athletes/{id}", s.getAthlete)
	mux.HandleFunc("PUT /api/athletes/{id}", s.updateAthlete)
	mux.HandleFunc("DELETE /api/athletes/{id}", s.deleteAthlete)
	mux.HandleFunc("GET /api/meets", s.getAllMeets)
	mux.HandleFunc("PUT /api/meets/{id}", s.updateMeet)
	mux.HandleFunc("DELETE /api/meets/{id}", s.deleteMeet)
	mux.HandleFunc("GET /api/meets/{id}/results", s.getResultsForMeet)
	mux.HandleFunc("GET /api/results", s.getAllResults)
	mux.HandleFunc("POST /api/results", s.createResult)
	mux.HandleFunc("GET /api/top-times", s.getTopTimes)
	mux.Handle("/", spaHandler(staticDir))

	log.Printf("Server starting on %s", port)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatal(err)
	}
}

func migrate(sqlDB *sql.DB) error {
	stmts := []string{
		`CREATE TABLE IF NOT EXISTS athletes (
			id    INT          PRIMARY KEY AUTO_INCREMENT,
			name  VARCHAR(100) NOT NULL,
			grade VARCHAR(2)   NOT NULL,
			event VARCHAR(20)  NOT NULL,
			pr    VARCHAR(10)  NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS meets (
			id       INT          PRIMARY KEY AUTO_INCREMENT,
			name     VARCHAR(100) NOT NULL,
			date     DATE         NOT NULL,
			location VARCHAR(150) NOT NULL
		)`,
		`CREATE TABLE IF NOT EXISTS results (
			id         INT         PRIMARY KEY AUTO_INCREMENT,
			athlete_id INT         NOT NULL,
			meet_id    INT         NOT NULL,
			time       VARCHAR(10) NOT NULL,
			place      INT         NOT NULL,
			FOREIGN KEY (athlete_id) REFERENCES athletes(id),
			FOREIGN KEY (meet_id)    REFERENCES meets(id)
		)`,
	}
	for _, s := range stmts {
		if _, err := sqlDB.ExecContext(context.Background(), s); err != nil {
			return err
		}
	}
	return nil
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *server) getAllAthletes(w http.ResponseWriter, r *http.Request) {
	athletes, err := s.queries.GetAllAthletes(r.Context())
	if err != nil {
		http.Error(w, "failed to get athletes", http.StatusInternalServerError)
		return
	}
	if athletes == nil {
		athletes = []db.Athlete{}
	}
	writeJSON(w, http.StatusOK, athletes)
}

func (s *server) getAthlete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 32)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}
	athlete, err := s.queries.GetAthleteByID(r.Context(), int32(id))
	if errors.Is(err, sql.ErrNoRows) {
		http.Error(w, "athlete not found", http.StatusNotFound)
		return
	}
	if err != nil {
		http.Error(w, "failed to get athlete", http.StatusInternalServerError)
		return
	}
	writeJSON(w, http.StatusOK, athlete)
}

func (s *server) getAllMeets(w http.ResponseWriter, r *http.Request) {
	meets, err := s.queries.GetAllMeets(r.Context())
	if err != nil {
		http.Error(w, "failed to get meets", http.StatusInternalServerError)
		return
	}
	if meets == nil {
		meets = []db.Meet{}
	}
	writeJSON(w, http.StatusOK, meets)
}

// GET /api/meets/:id/results
func (s *server) getResultsForMeet(w http.ResponseWriter, r *http.Request) {
	meetID, err := strconv.ParseInt(r.PathValue("id"), 10, 32)
	if err != nil {
		http.Error(w, "invalid meet_id", http.StatusBadRequest)
		return
	}
	results, err := s.queries.GetMeetResults(r.Context(), int32(meetID))
	if err != nil {
		http.Error(w, "failed to get results", http.StatusInternalServerError)
		return
	}
	if results == nil {
		results = []db.GetMeetResultsRow{}
	}
	writeJSON(w, http.StatusOK, results)
}

// GET /api/top-times
func (s *server) getTopTimes(w http.ResponseWriter, r *http.Request) {
	times, err := s.queries.GetTopTimes(r.Context())
	if err != nil {
		http.Error(w, "failed to get top times", http.StatusInternalServerError)
		return
	}
	if times == nil {
		times = []db.GetTopTimesRow{}
	}
	writeJSON(w, http.StatusOK, times)
}

// PUT /api/athletes/:id
func (s *server) updateAthlete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 32)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}
	var params db.UpdateAthleteParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	params.ID = int32(id)
	if err := s.queries.UpdateAthlete(r.Context(), params); err != nil {
		http.Error(w, "failed to update athlete", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// DELETE /api/athletes/:id
func (s *server) deleteAthlete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 32)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}
	if err := s.queries.DeleteAthlete(r.Context(), int32(id)); err != nil {
		http.Error(w, "failed to delete athlete", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// PUT /api/meets/:id
func (s *server) updateMeet(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 32)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}
	var params db.UpdateMeetParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	params.ID = int32(id)
	if err := s.queries.UpdateMeet(r.Context(), params); err != nil {
		http.Error(w, "failed to update meet", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// DELETE /api/meets/:id
func (s *server) deleteMeet(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(r.PathValue("id"), 10, 32)
	if err != nil {
		http.Error(w, "invalid id", http.StatusBadRequest)
		return
	}
	if err := s.queries.DeleteMeet(r.Context(), int32(id)); err != nil {
		http.Error(w, "failed to delete meet", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// GET /api/results
func (s *server) getAllResults(w http.ResponseWriter, r *http.Request) {
	results, err := s.queries.GetAllResults(r.Context())
	if err != nil {
		http.Error(w, "failed to get results", http.StatusInternalServerError)
		return
	}
	if results == nil {
		results = []db.GetTopTimesRow{}
	}
	writeJSON(w, http.StatusOK, results)
}

// POST /api/results  body: {"athlete_id":1,"meet_id":1,"time":"18:45","place":3}
func (s *server) createResult(w http.ResponseWriter, r *http.Request) {
	var params db.CreateResultParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	id, err := s.queries.CreateResult(r.Context(), params)
	if err != nil {
		http.Error(w, "failed to create result", http.StatusInternalServerError)
		return
	}
	writeJSON(w, http.StatusCreated, map[string]int64{"id": id})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

// spaHandler serves static files from dir, falling back to index.html
// for any path that doesn't match a file (so React Router can handle it).
func spaHandler(dir string) http.Handler {
	fs := http.Dir(dir)
	fileServer := http.FileServer(fs)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(dir, filepath.Clean(r.URL.Path))
		if info, err := os.Stat(path); err == nil && !info.IsDir() {
			fileServer.ServeHTTP(w, r)
			return
		}
		http.ServeFile(w, r, filepath.Join(dir, "index.html"))
	})
}

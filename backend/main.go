package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

type Athlete struct {
	Name  string `json:"name"`
	Grade string `json:"grade"`
	PR    string `json:"pr"`
}

type Meet struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Date     string `json:"date"`
	Location string `json:"location"`
}

type Result struct {
	ID        int    `json:"id"`
	AthleteID int    `json:"athleteId"`
	MeetID    int    `json:"meetId"`
	Time      string `json:"time"`
	Place     int    `json:"place"`
}

var meets = []Meet{
	{ID: 1, Name: "Riverside Invitational", Date: "2026-04-05", Location: "Riverside Park, Springfield"},
	{ID: 2, Name: "Spring Classic", Date: "2026-04-19", Location: "Lakeview High School"},
	{ID: 3, Name: "District Championships", Date: "2026-05-10", Location: "Central Stadium"},
}

var results = []Result{
	{ID: 1, AthleteID: 1, MeetID: 1, Time: "18:45", Place: 3},
	{ID: 2, AthleteID: 2, MeetID: 1, Time: "16:52", Place: 1},
	{ID: 3, AthleteID: 3, MeetID: 1, Time: "19:30", Place: 5},
	{ID: 4, AthleteID: 4, MeetID: 1, Time: "16:10", Place: 2},
	{ID: 5, AthleteID: 1, MeetID: 2, Time: "18:32", Place: 2},
	{ID: 6, AthleteID: 5, MeetID: 2, Time: "20:44", Place: 8},
}

var athletes = []Athlete{
	{Name: "Emma Johnson", Grade: "12", PR: "18:32"},
	{Name: "Liam Carter", Grade: "11", PR: "16:45"},
	{Name: "Sophia Martinez", Grade: "10", PR: "19:10"},
	{Name: "Noah Williams", Grade: "12", PR: "15:58"},
	{Name: "Olivia Brown", Grade: "9", PR: "20:14"},
	{Name: "Mason Davis", Grade: "11", PR: "17:22"},
	{Name: "Ava Wilson", Grade: "10", PR: "18:55"},
	{Name: "Ethan Moore", Grade: "12", PR: "16:03"},
	{Name: "Isabella Taylor", Grade: "9", PR: "21:07"},
	{Name: "Lucas Anderson", Grade: "11", PR: "17:48"},
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

	mux := http.NewServeMux()
	mux.HandleFunc("/health", healthHandler)
	mux.HandleFunc("/api/athletes", athletesHandler)
	mux.HandleFunc("/api/meets", meetsHandler)
	mux.HandleFunc("/api/results", resultsHandler)
	mux.Handle("/", spaHandler(staticDir))

	log.Printf("Server starting on %s (static files from %s)", port, staticDir)
	if err := http.ListenAndServe(port, mux); err != nil {
		log.Fatal(err)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func meetsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(meets)
}

func resultsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(results)
}

func athletesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(athletes)
}

// spaHandler serves static files from dir, falling back to index.html
// for any path that doesn't match a file (so React Router can handle it).
func spaHandler(dir string) http.Handler {
	fs := http.Dir(dir)
	fileServer := http.FileServer(fs)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Check if the requested file exists
		path := filepath.Join(dir, filepath.Clean(r.URL.Path))
		if info, err := os.Stat(path); err == nil && !info.IsDir() {
			fileServer.ServeHTTP(w, r)
			return
		}

		// SPA fallback: serve index.html for unknown routes
		http.ServeFile(w, r, filepath.Join(dir, "index.html"))
	})
}

  Fellowship of the Code — Feature Summary
                                                                                                                                                         
  Backend & Database                                        
  - MySQL database with three tables: athletes, meets, and results with foreign key relationships                                                        
  - Go backend API server running on a Lightsail server, accessible over HTTPS at fellowshipofthecode.com
  - Type-safe database queries using sqlc with a MySQL driver                                                                                            
  - Auto-migration on startup — tables are created automatically if they don't exist                                                                     
  - Sample data seeded: 12 Jones County runners, 3 meets at real Georgia locations, and 10 race results                                                  
                                                                                                                                                         
  API Endpoints                                                                                                                                          
  - GET /api/athletes — returns all athletes                                                                                                             
  - GET /api/athletes/{id} — returns a single athlete by ID                                                                                              
  - PUT /api/athletes/{id} — updates an athlete's name, grade, event, or PR
  - DELETE /api/athletes/{id} — removes an athlete                                                                                                       
  - GET /api/meets — returns all meets ordered by date                                                                                                   
  - PUT /api/meets/{id} — updates a meet's name, date, or location                                                                                       
  - DELETE /api/meets/{id} — removes a meet                                                                                                              
  - GET /api/meets/{id}/results — returns results for a specific meet with athlete names                                                                 
  - GET /api/results — returns all results across all meets with athlete and meet names joined                                                           
  - POST /api/results — adds a new race result                                                
  - GET /api/top-times — returns the top 10 times across all meets                                                                                       
                                                            
  Frontend                                                                                                                                               
  - React + Vite single-page app with React Router for navigation
  - Athletes page displaying all runners with their grade, event, and personal record                                                                    
  - Inline edit and delete controls on each athlete row                              
  - Meets page displaying upcoming meets with date and location                                                                                          
  - Inline edit and delete controls on each meet row           
  - Results table on the Meets page showing place, athlete, time, and meet                                                                               
  - Fellowship page with individual bio pages for Lord of the Rings characters
  - Navbar with Athletes, Fellowship, and Meets tabs                                                                                                     
                                                                                                                                                         
  Deployment                                                                                                                                             
  - Deployed to AWS Lightsail with nginx proxying API requests to the Go server                                                                          
  - HTTPS via Cloudflare at fellowshipofthecode.com                                                                                                      
  - systemd service keeping the backend running automatically

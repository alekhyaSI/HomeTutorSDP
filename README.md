# HomeTutor (Full Non-Lombok Version)

## Backend
- Java 17+, Maven, MySQL
- Edit `backend/src/main/resources/application.properties` for DB creds
- Run: `cd backend && mvn spring-boot:run` (server on 1202)

## Frontend
- Node 18+
- `cd frontend && npm i && npm run dev` (Vite 5.x on 5173)

Dashboards:
- Admin: Approvals, users, bookings/availability
- Tutor: Manage profile, approve/deny requests
- Student: Search & request tutors, view my requests

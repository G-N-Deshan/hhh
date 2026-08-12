# OpportunityBridge - Faculty of Technology, University of Ruhuna

**OpportunityBridge** is a professional MERN stack web platform designed for the Faculty of Technology at the University of Ruhuna, Sri Lanka.

## Features
- **Discover Opportunities**: Browse internships, research projects, tech workshops, scholarships, and grants categorized by department (ICT, Engineering Technology, Biosystems Technology).
- **Report Access Barriers**: Students and faculty members can submit reports on barriers (equipment shortages, mentorship gaps, access issues) and track resolution progress.
- **Admin Dashboard**: Analytics charts (powered by Recharts) visualizing access barriers, category distributions, urgency levels, and opportunity metrics.
- **User Roles & Authentication**: Student, Provider/Lecturer, and Administrator roles secured with JWT & Bcrypt password hashing.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios, Recharts, React Hot Toast, React Icons.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, BcryptJS, Express Validator, Helmet, Morgan, Express Rate Limit.

## How to Run

### Installation
From the root directory:
```bash
npm run install-all
```

### Running Development Server
Run backend (Port 5000) and frontend (Port 5173) simultaneously:
```bash
npm run dev
```

- Backend API: http://localhost:5000/api
- Frontend Application: http://localhost:5173

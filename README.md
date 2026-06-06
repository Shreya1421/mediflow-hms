# MediFlow HMS — Backend API

Node.js + Express.js REST API for the MediFlow Hospital Management System, connected to MySQL via Sequelize ORM.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Sequelize
- **Auth:** JWT + bcrypt
- **Other:** CORS, dotenv

## Project Structure
```
MediFlow-Backend/
├── server.js              ← Entry point
├── .env.example           ← Environment variables template
├── config/
│   └── db.js              ← MySQL connection
├── models/
│   ├── Admin.js
│   ├── Doctor.js
│   ├── Patient.js
│   └── Appointment.js
├── controllers/
│   ├── authController.js
│   ├── doctorController.js
│   ├── patientController.js
│   └── appointmentController.js
├── routes/
│   ├── auth.js
│   ├── doctors.js
│   ├── patients.js
│   └── appointments.js
└── middleware/
    └── auth.js            ← JWT verification + role-based access
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login/admin | Admin login |
| POST | /api/auth/login/doctor | Doctor login |
| POST | /api/auth/login/patient | Patient login |
| POST | /api/auth/register/patient | Patient self-register |

### Doctors
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/doctors | Admin, Doctor |
| GET | /api/doctors/:id | Admin, Doctor |
| POST | /api/doctors | Admin only |
| PUT | /api/doctors/:id | Admin only |
| DELETE | /api/doctors/:id | Admin only |

### Patients
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/patients | Admin only |
| GET | /api/patients/:id | Admin, Doctor |
| POST | /api/patients | Admin only |
| PUT | /api/patients/:id | Authenticated |
| DELETE | /api/patients/:id | Admin only |

### Appointments
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/appointments | Admin only |
| GET | /api/appointments/report/weekly | Admin only |
| GET | /api/appointments/doctor/:id | Admin, Doctor |
| GET | /api/appointments/patient/:id | Authenticated |
| POST | /api/appointments | Authenticated |
| PUT | /api/appointments/:id | Authenticated |
| DELETE | /api/appointments/:id | Admin only |

## Setup Instructions

### 1. Clone and install
```bash
cd MediFlow-Backend
npm install
```

### 2. Configure environment
```bash
# Copy .env.example to .env
cp .env.example .env
# Fill in your MySQL password and JWT secret
```

### 3. Create MySQL database
```sql
CREATE DATABASE mediflow_db;
```

### 4. Run the server
```bash
npm run dev     # development (nodemon)
npm start       # production
```

Server runs on http://localhost:5000

## Frontend
The frontend (HTML/CSS/JS) is in the [MediFlow HMS Frontend](../MediFlow) folder.

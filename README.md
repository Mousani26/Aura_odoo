<b>Project Links :</b>
## Live Demo : https://aura1-n2ne.onrender.com/
## GitHub Repository : https://github.com/Mousani26/Aura_odoo.git
------------------------------------------------------------

AURA ENGINE
Aligned Workflow

AURA Engine is an AI-powered Human Resource Management System (HRMS) built during the Odoo Hackathon. The idea behind this project was to create a single platform that makes day-to-day HR operations easier for both employees and HR teams.

Instead of managing attendance, leaves, payroll, and employee information across different systems, AURA Engine brings everything together in one place and also adds AI-powered insights to make HR management smarter.

------------------------------------------------------------

What does AURA Engine do?

The platform allows employees to:

- View and update their profile
- Mark attendance
- Apply for leaves
- Check salary information
- View rewards and achievements
- Access important company documents

For HR/Admin users, the platform provides:

- Employee management
- Attendance monitoring
- Leave approval workflows
- Payroll management
- Organization analytics
- AI-powered insights and reports

------------------------------------------------------------

Main Features

Authentication
- Login and Registration
- Role-based access (Employee and HR)
- JWT authentication
- Password encryption using bcrypt
- Email verification support

Employee Management
- Employee directory
- Profile management
- Department and designation details
- Contact information
- Profile pictures

Attendance Management
- Daily check-in and check-out
- Attendance history
- Attendance heatmap
- Attendance analytics
- Employee attendance reports

Leave Management
- Apply for leave
- Paid Leave
- Sick Leave
- Unpaid Leave
- Leave approval and rejection workflow
- Leave history

Payroll
- Salary information
- Payroll dashboard
- Paycheck simulator
- Compensation details

Documents
- Secure document locker
- Employee document storage

AI Features
- Aura AI Assistant
- Attendance insights
- Leave analytics
- Smart HR queries
- Employee statistics and recommendations

Analytics
- KPI dashboard
- Audit reports
- Organization insights
- Employee trends

------------------------------------------------------------

Tech Stack

Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

Backend
- Node.js
- Express.js

Database
- JSON storage (used for hackathon MVP)
- PostgreSQL-ready schema using Prisma

Authentication
- JWT
- bcrypt

AI Integration
- Google Gemini API

------------------------------------------------------------

Project Structure

src
├── components
├── context
├── server
├── prisma
└── assets

------------------------------------------------------------

Running the Project

Clone the repository

git clone https://github.com/your-team/aura-engine.git
cd aura-engine

Install dependencies

npm install

Create a .env file

PORT=3000
JWT_SECRET=your_secret
DATABASE_URL=your_database_url
GEMINI_API_KEY=your_api_key

Start the application

npm run dev

For backend

npm run server

------------------------------------------------------------

Why did we use JSON instead of PostgreSQL?

Since this project was built during a hackathon, our primary focus was rapid prototyping and delivering a complete working solution within the time limit.

The application has been designed with a PostgreSQL-ready architecture using Prisma schemas, making it easy to migrate to a production database in the future.

------------------------------------------------------------

Future Improvements

- Mobile application
- Face recognition attendance
- Email and SMS notifications
- Advanced AI analytics
- Recruitment management module
- Performance review system
- Multi-company support
- Employee burnout prediction

------------------------------------------------------------

Team

Frontend & UI :
Mousani Kundu

Backend & Database :
Sampriti Ray

AI & Integrations :
Ankan Chanda

------------------------------------------------------------

Screenshots :

<img width="640" height="290" alt="image" src="https://github.com/user-attachments/assets/a819529c-fb5d-457c-8b0e-9ffc07026e2c" />
<img width="960" height="540" alt="Screenshot 2026-07-06 151713" src="https://github.com/user-attachments/assets/bb1c204f-8fd3-43b0-9c3a-7bd1f1194cc7" />
<img width="960" height="540" alt="Screenshot 2026-07-06 151802" src="https://github.com/user-attachments/assets/8dbda2cc-0f1b-4140-8a9f-f9af90e3b2da" />
<img width="960" height="540" alt="Screenshot 2026-07-06 151822" src="https://github.com/user-attachments/assets/974092ff-4bcf-43ca-8be5-e4dda1be6e06" />
<img width="525" height="360" alt="Screenshot 2026-07-06 151908" src="https://github.com/user-attachments/assets/29f6547b-9e9e-40f6-bef8-c49a195e1d34" />
<img width="354" height="200" alt="Screenshot 2026-07-06 151953" src="https://github.com/user-attachments/assets/3d40d9d7-ba9a-4acd-8997-988927edd8d5" />
<img width="540" height="302" alt="Screenshot 2026-07-06 152037" src="https://github.com/user-attachments/assets/71d2ce85-040a-4e45-9cff-7cb994296474" />
<img width="536" height="241" alt="Screenshot 2026-07-06 152054" src="https://github.com/user-attachments/assets/a76f7575-bcc4-4c40-9f39-dbb6f94600d2" />
<img width="540" height="231" alt="Screenshot 2026-07-06 152130" src="https://github.com/user-attachments/assets/9f21cd87-a386-4587-aea2-13ccc6a7cd53" />
<img width="356" height="200" alt="Screenshot 2026-07-06 152205" src="https://github.com/user-attachments/assets/26e5872e-c816-4d57-84c2-e0b820ef0862" />
<img width="536" height="203" alt="Screenshot 2026-07-06 152306" src="https://github.com/user-attachments/assets/be882b5a-ddef-4614-8178-f751320ddeca" />
<img width="530" height="360" alt="Screenshot 2026-07-06 152343" src="https://github.com/user-attachments/assets/db19767a-cee9-41f9-a54f-f0439e50ea34" />


------------------------------------------------------------

Built for Odoo Hackathon 2026

AURA Engine was built with the idea of making HR processes simple, organized, and a little smarter with AI.

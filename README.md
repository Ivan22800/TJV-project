# Flow — Social Network for Post Sharing

**Flow** is a modern Single Page Application (SPA) social network where users can register, publish posts, like content, and follow other participants.

## 🛠 Technology Stack

### Backend
- **Java 17+** with **Spring Boot 3**
- **Spring Security + JWT**: for secure authentication
- **Spring Data JPA**: for database management
- **PostgreSQL**: main relational database
- **Lombok**: for reducing boilerplate code
- **Maven**: project build tool

### Frontend
- **React 19** + **Vite**
- **Chakra UI v3**: modern component library
- **React Router Dom**: navigation
- **React Icons**: iconography

---

## 🚀 How to Run the Project

### 1. Requirements
Ensure you have the following installed:
- JDK 17 or higher
- Node.js (v18+) and npm
- PostgreSQL

### 2. Database Setup
1. Create a PostgreSQL database named `flow_database`.
2. check connection settings in `backend/flow/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/flow_database
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

### 3. Run Backend
Navigate to the backend folder and start the project:
```bash
cd backend/flow
./mvnw spring-boot:run
```
The server will be available at: `http://localhost:8080`

### 4. Run Frontend
Navigate to the frontend folder, install dependencies, and start the dev server:
```bash
cd frontend/test
npm install
npm run dev
```
The application will open at: `http://localhost:5173`


## 📝 Authors
- [Ivan](https://github.com/Ivan22800)

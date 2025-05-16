# GOOD VIBES ONLY

## Project Structure

vibes/
├── backend/ # Spring Boot backend
└── frontend-react/ # React frontend

## Backend Setup

The backend is a Spring Boot application using:

- Java
- Spring Boot
- JPA/Hibernate
- PostgreSQL (assumed based on JPA usage)

### Running the Backend

1. Navigate to the backend directory:

```bash
cd backend
```

2. Build the project using Maven:

```bash
./mvnw clean install
```

3. Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

The backend server will start on http://localhost:8080 by default.

## Frontend Setup

The frontend is a React application created with Create React App.

### Running the Frontend

1. Navigate to the frontend directory:

```bash
cd frontend-react
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The frontend development server will start on http://localhost:3000 and will automatically open in your default browser.

## Development

### Backend Development

- The backend uses Spring Boot with RESTful endpoints
- Main entities include Project, Category, and User models
- API endpoints are available through ProjectController

### Frontend Development

- Built with React
- Uses modern React features with functional components
- Includes web vitals for performance monitoring

## Building for Production

### Backend

To build the backend for production:

```bash
cd backend

./mvnw clean package
```

### Frontend

To build the frontend for production:

```bash
cd frontend-react

npm run build
```

This will create a production build in the build folder.

## Additional Notes

- Make sure you have Java and Node.js installed on your system
- The backend requires proper database configuration (check application.properties)
- For frontend development, ensure you're using Node.js version 14 or higher

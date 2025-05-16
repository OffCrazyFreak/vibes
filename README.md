# GOOD VIBES ONLY

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

This will create a production build in the build folder.

## Additional Notes

- Make sure you have Java and Node.js installed on your system
- The backend requires proper database configuration (check application.properties)
- For frontend development, ensure you're using Node.js version 14 or higher

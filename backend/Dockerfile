# Use the official Maven image as the base image for dependency resolution
FROM maven:3.8.5-openjdk-17-slim AS dependencies

# Copy the project's pom.xml to the container
COPY pom.xml /app/pom.xml

# Set the working directory
WORKDIR /app

# Resolve and download the project dependencies
RUN mvn dependency:go-offline -B

# Use a separate stage for the actual application build
FROM dependencies AS builder

# Copy the project's source code to the container
COPY . /app

# Build the project using Maven
RUN mvn clean package -Dmaven.test.skip

# Use a lightweight container with Java JDK 17 to run the application
FROM openjdk:17-slim

# Set the working directory
WORKDIR /app

# Copy the built JAR file from the builder stage
COPY --from=builder /app/target/kolab-1.0.0.jar ./kolab-1.0.0.jar

# Expose the application's port
EXPOSE 8080

# Set the entrypoint command to run the application
ENTRYPOINT ["java", "-jar", "kolab-1.0.0.jar"]

# Stage 1: Build
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app

# Copy Gradle files
COPY gradlew .
COPY gradle gradle
COPY build.gradle settings.gradle ./

# Copy source
COPY src src

RUN chmod +x gradlew

# Build JAR
RUN ./gradlew bootJar -x test

# Stage 2: Run
FROM eclipse-temurin:17-jre
WORKDIR /app

# Copy ANY jar (more flexible)
COPY --from=builder /app/build/libs/*.jar app.jar

# Use Render port dynamically
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
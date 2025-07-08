FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/config-service-1.0.0.jar app.jar

EXPOSE 8888

ENTRYPOINT ["java", "-jar", "app.jar"] 
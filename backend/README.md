# PetPal Community Backend

## Prerequisites
- Java 17 or higher
- MySQL Server 8.0 or higher
- Maven (optional, wrapper included)

## Database Setup

### 1. Create the Database
You can let the application create the database automatically (configured in `application.properties`), or create it manually using MySQL Workbench:

1.  Open **MySQL Workbench**.
2.  Click on your **Local instance** to connect (enter your root password if prompted).
3.  Click the **Create a new schema** icon (looks like a cylinder with a `+`) in the toolbar, or run this SQL command in a query tab:
    ```sql
    CREATE DATABASE petpal_community;
    ```
4.  Click **Apply** to create the database.

### 2. Configure Application
Open `src/main/resources/application.properties` and check the database configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/petpal_community?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=password  <-- CHANGE THIS to your MySQL root password
```

## Running the Application

### Using Maven
```bash
mvn spring-boot:run
```

### Using IDE
Run the `PetPalCommunityApplication.java` class.

## API Endpoints
(To be added)

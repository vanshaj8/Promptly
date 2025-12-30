# Promptly Backend - Spring Boot

Spring Boot REST API for Instagram Brand Engagement Tool.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Database schema named "Promptly" (case-sensitive)

## Setup

### 1. Database Configuration

Ensure your MySQL database has a schema named `Promptly` (case-sensitive):

```sql
CREATE DATABASE Promptly;
USE Promptly;
```

Then run the schema SQL file:
```bash
mysql -u root -p Promptly < database/schema.sql
mysql -u root -p Promptly < database/seed.sql
```

### 2. Application Configuration

Update `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/Promptly?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password

# JWT
jwt.secret=your_super_secret_jwt_key_change_in_production
jwt.expiration=604800000

# Facebook/Instagram
facebook.app.id=your_facebook_app_id
facebook.app.secret=your_facebook_app_secret
facebook.redirect.uri=http://localhost:3001/api/auth/instagram/callback

# Webhooks
webhook.verify.token=your_webhook_verify_token
webhook.secret=your_webhook_secret

# Frontend
frontend.url=http://localhost:3000
```

### 3. Build and Run

```bash
# Build
mvn clean install

# Run
mvn spring-boot:run

# Or run with dev profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

All endpoints match the original Node.js API structure for frontend compatibility.

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Comments
- `GET /api/comments` - Get all comments
- `GET /api/comments/{id}` - Get single comment
- `POST /api/comments/{id}/reply` - Reply to comment
- `POST /api/comments/sync` - Sync comments

### Instagram
- `GET /api/instagram/connect-url` - Get OAuth URL
- `GET /api/instagram/callback` - OAuth callback
- `GET /api/instagram/account` - Get connected account
- `POST /api/instagram/disconnect` - Disconnect account

### Brands
- `GET /api/brands/me` - Get current user's brand

### Admin
- `GET /api/admin/brands` - Get all brands
- `GET /api/admin/brands/{id}` - Get brand details
- `POST /api/admin/brands` - Create brand
- `PUT /api/admin/brands/{id}` - Update brand
- `PATCH /api/admin/brands/{id}/status` - Toggle brand status
- `GET /api/admin/logs` - Get activity logs

### Webhooks
- `GET /api/webhooks` - Webhook verification
- `POST /api/webhooks` - Webhook event handler

## Project Structure

```
src/main/java/com/promptly/
├── PromptlyApplication.java       # Main application class
├── config/                        # Configuration classes
│   ├── SecurityConfig.java
│   └── WebClientConfig.java
├── controller/                    # REST controllers
│   ├── AuthController.java
│   ├── CommentController.java
│   ├── InstagramController.java
│   ├── AdminController.java
│   ├── BrandController.java
│   └── WebhookController.java
├── dto/                           # Data Transfer Objects
│   ├── LoginRequest.java
│   ├── LoginResponse.java
│   ├── UserDto.java
│   └── ...
├── entity/                        # JPA entities
│   ├── Brand.java
│   ├── User.java
│   ├── Comment.java
│   └── ...
├── repository/                    # JPA repositories
│   ├── BrandRepository.java
│   ├── UserRepository.java
│   └── ...
├── security/                      # Security components
│   └── JwtAuthenticationFilter.java
└── service/                       # Business logic
    ├── AuthService.java
    ├── CommentService.java
    ├── InstagramService.java
    └── ...
```

## Development

### Running Tests
```bash
mvn test
```

### Building for Production
```bash
mvn clean package -DskipTests
java -jar target/promptly-backend-1.0.0.jar
```

## Notes

- The database schema name is case-sensitive: `Promptly` (not `promptly`)
- JWT tokens include `user_id`, `role`, and `brand_id` claims
- All APIs are protected except `/api/auth/login` and `/api/webhooks`
- Admin endpoints require `ROLE_ADMIN`
- Brand user endpoints automatically filter by `brand_id`


# SecretService Implementation Guide

## Overview

This guide explains the implementation of a custom `ISecretService` and `SecretService` following Clean Architecture principles. The service extends NestJS's `ConfigService` to provide enhanced configuration management capabilities.

## 🏗️ Clean Architecture Structure

### **Domain Layer** (`src/domain/services/secret.service.interface.ts`)

- **Purpose**: Defines the contract for configuration access
- **Contains**: `ISecretService` interface and `SECRET_SERVICE_TOKEN`
- **Dependencies**: None (pure domain)

### **Infrastructure Layer** (`src/infrastructure/config/`)

- **Purpose**: Implements the domain interface using NestJS ConfigService
- **Contains**: `SecretService` implementation and `ConfigModule`
- **Dependencies**: NestJS ConfigService, domain interface

### **Application Layer** (`src/application/services/`)

- **Purpose**: Uses the SecretService for business logic
- **Contains**: Services that inject and use `ISecretService`
- **Dependencies**: Domain interface (not implementation)

## 📁 File Structure

```
src/
├── domain/
│   └── services/
│       └── secret.service.interface.ts          # Domain interface
├── infrastructure/
│   └── config/
│       ├── secret.service.ts                    # Implementation
│       └── config.module.ts                     # Module configuration
└── application/
    └── services/
        └── example-config.service.ts            # Usage example
```

## 🔧 Implementation Details

### **Domain Interface** (`ISecretService`)

```typescript
export interface ISecretService {
  get<T = string>(key: string, defaultValue?: T): T;
  getRequired<T = string>(key: string): T;
  getNumber(key: string, defaultValue?: number): number;
  getBoolean(key: string, defaultValue?: boolean): boolean;
  getArray(key: string, defaultValue?: string[]): string[];
  has(key: string): boolean;
  getKeys(): string[];
  getDatabaseConfig(): DatabaseConfig;
  getCorsConfig(): CorsConfig;
}
```

### **Infrastructure Implementation** (`SecretService`)

```typescript
@Injectable()
export class SecretService extends ConfigService implements ISecretService {
  // Implements all interface methods
  // Extends NestJS ConfigService for base functionality
  // Adds custom methods for specific configuration needs
}
```

### **Configuration Module** (`ConfigModule`)

```typescript
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      cache: true,
      expandVariables: true,
    }),
  ],
  providers: [
    SecretService,
    {
      provide: SECRET_SERVICE_TOKEN,
      useExisting: SecretService,
    },
  ],
  exports: [SECRET_SERVICE_TOKEN],
})
export class ConfigModule {}
```

## 🚀 Usage Examples

### **Basic Usage in Application Service**

```typescript
@Injectable()
export class MyService {
  constructor(
    @Inject(SECRET_SERVICE_TOKEN)
    private readonly secretService: ISecretService,
  ) {}

  async someMethod() {
    // Get simple values
    const port = this.secretService.getNumber('PORT', 3001);
    const isDev = this.secretService.getBoolean('NODE_ENV', false);

    // Get required values (throws if missing)
    const jwtSecret = this.secretService.getRequired('JWT_SECRET');

    // Get arrays
    const origins = this.secretService.getArray('ALLOWED_ORIGINS');

    // Get structured configs
    const dbConfig = this.secretService.getDatabaseConfig();
    const corsConfig = this.secretService.getCorsConfig();
  }
}
```

### **Configuration Validation**

```typescript
validateConfiguration(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredKeys = ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD'];

  for (const key of requiredKeys) {
    if (!this.secretService.has(key)) {
      errors.push(`Missing required configuration: ${key}`);
    }
  }

  return { isValid: errors.length === 0, errors };
}
```

## 🔒 Security Features

### **Environment File Priority**

1. `.env.local` (highest priority, for local overrides)
2. `.env` (default environment file)
3. System environment variables

### **Sensitive Data Handling**

- **Never expose sensitive data** in logs or responses
- **Use `getRequired()`** for critical configuration
- **Validate configuration** on application startup
- **Use typed methods** to prevent type errors

### **Best Practices**

```typescript
// ✅ Good: Use typed methods
const port = this.secretService.getNumber('PORT', 3001);

// ❌ Bad: Manual parsing
const port = parseInt(process.env.PORT || '3001', 10);

// ✅ Good: Validate required values
const jwtSecret = this.secretService.getRequired('JWT_SECRET');

// ❌ Bad: Assume value exists
const jwtSecret = process.env.JWT_SECRET;
```

## 🌍 Environment Variables

### **Required Variables**

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=finaneasy

# Application
PORT=3001
NODE_ENV=development

# Security (required)
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-super-secret-session-key
```

### **Optional Variables**

```env
# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
CORS_CREDENTIALS=true
CORS_METHODS=GET,POST,PUT,DELETE,PATCH,OPTIONS
CORS_ALLOWED_HEADERS=Origin,X-Requested-With,Content-Type,Accept,Authorization
CORS_MAX_AGE=86400

# Feature Flags
ENABLE_GRAPHQL_PLAYGROUND=true
ENABLE_GRAPHQL_INTROSPECTION=true
ENABLE_CACHING=false
ENABLE_RATE_LIMITING=true
ENABLE_COMPRESSION=true

# File Upload
MAX_FILE_SIZE_MB=10
ALLOWED_FILE_TYPES=jpg,png,pdf

# Security
JWT_EXPIRES_IN=1d
BCRYPT_ROUNDS=12
ENABLE_HTTPS=false
```

## 🔄 Dependency Injection

### **Module Registration**

```typescript
// In AppModule
@Module({
  imports: [
    ConfigModule, // Import first for global availability
    // ... other modules
  ],
})
export class AppModule {}
```

### **Service Injection**

```typescript
// In any service
@Injectable()
export class MyService {
  constructor(
    @Inject(SECRET_SERVICE_TOKEN)
    private readonly secretService: ISecretService,
  ) {}
}
```

## 🧪 Testing

### **Unit Testing**

```typescript
describe('MyService', () => {
  let service: MyService;
  let mockSecretService: jest.Mocked<ISecretService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        MyService,
        {
          provide: SECRET_SERVICE_TOKEN,
          useValue: {
            get: jest.fn(),
            getRequired: jest.fn(),
            getNumber: jest.fn(),
            getBoolean: jest.fn(),
            getArray: jest.fn(),
            has: jest.fn(),
            getKeys: jest.fn(),
            getDatabaseConfig: jest.fn(),
            getCorsConfig: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MyService>(MyService);
    mockSecretService = module.get(SECRET_SERVICE_TOKEN);
  });

  it('should use configuration values', () => {
    mockSecretService.getNumber.mockReturnValue(3001);
    // ... test implementation
  });
});
```

## 🎯 Benefits of This Approach

### **Clean Architecture Compliance**

- ✅ **Domain Layer**: Pure interface, no dependencies
- ✅ **Infrastructure Layer**: Implements domain interface
- ✅ **Application Layer**: Depends on domain, not infrastructure
- ✅ **Dependency Inversion**: High-level modules don't depend on low-level modules

### **Type Safety**

- ✅ **Typed Methods**: `getNumber()`, `getBoolean()`, `getArray()`
- ✅ **Generic Support**: `get<T>()` for custom types
- ✅ **Required Validation**: `getRequired()` throws on missing values

### **Flexibility**

- ✅ **Multiple Environment Files**: `.env.local`, `.env`
- ✅ **Variable Expansion**: Support for `${VAR}` syntax
- ✅ **Caching**: Performance optimization
- ✅ **Structured Configs**: `getDatabaseConfig()`, `getCorsConfig()`

### **Maintainability**

- ✅ **Single Responsibility**: Each method has a clear purpose
- ✅ **Open/Closed Principle**: Easy to extend without modification
- ✅ **Interface Segregation**: Only expose what's needed
- ✅ **Dependency Inversion**: Depend on abstractions, not concretions

## 🔧 Migration from Direct Environment Access

### **Before (❌ Not Clean Architecture)**

```typescript
// Direct environment access
const port = process.env.PORT || '3001';
const dbHost = process.env.DB_HOST;
const isDev = process.env.NODE_ENV === 'development';
```

### **After (✅ Clean Architecture)**

```typescript
// Through SecretService
const port = this.secretService.getNumber('PORT', 3001);
const dbHost = this.secretService.getRequired('DB_HOST');
const isDev = this.secretService.get('NODE_ENV') === 'development';
```

This approach provides better type safety, validation, and follows Clean Architecture principles while maintaining the flexibility of NestJS's ConfigService.

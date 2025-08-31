# GraphQL API Interaction Guide

This guide will help you interact with the FinanEasy GraphQL API step by step.

## 🚀 Quick Start

### 1. Start the Application

```bash
# Start the development server
pnpm start:dev

# The API will be available at: http://localhost:3000/graphql
```

### 2. Access GraphQL Playground

Open your browser and navigate to: **http://localhost:3000/graphql**

You'll see the Apollo GraphQL Playground interface where you can:

- Write and execute queries
- View the schema documentation
- Test mutations
- See real-time results

---

## 📚 Available Operations

### Queries (Read Operations)

#### 1. Get User by ID

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    firstName
    lastName
    createdAt
    updatedAt
    transactions {
      id
      amount
      description
      transactionType
      category
      createdAt
    }
  }
}
```

**Variables:**

```json
{
  "id": "user-uuid-here"
}
```

#### 2. Get Transaction by ID

```graphql
query GetTransaction($id: ID!) {
  transaction(id: $id) {
    id
    amount
    description
    transactionType
    category
    createdAt
    updatedAt
    user {
      id
      email
      firstName
      lastName
    }
  }
}
```

**Variables:**

```json
{
  "id": "transaction-uuid-here"
}
```

### Mutations (Write Operations)

#### 1. Create User

```graphql
mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    email
    firstName
    lastName
    createdAt
  }
}
```

**Variables:**

```json
{
  "input": {
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "password": "securepassword123"
  }
}
```

#### 2. Create Transaction

```graphql
mutation CreateTransaction($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    id
    amount
    description
    transactionType
    category
    createdAt
    user {
      id
      email
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "amount": 150.5,
    "description": "Grocery shopping",
    "transactionType": "EXPENSE",
    "category": "Food",
    "userId": "user-uuid-here"
  }
}
```

---

## 🛠️ Using Different Tools

### 1. GraphQL Playground (Browser)

1. Open **http://localhost:3000/graphql**
2. Write your query/mutation in the left panel
3. Add variables in the bottom panel
4. Click the "Play" button to execute
5. View results in the right panel

### 2. cURL (Command Line)

```bash
# Simple query
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "apollo-require-preflight: true" \
  -d '{
    "query": "{ __typename }"
  }'

# Query with variables
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "apollo-require-preflight: true" \
  -d '{
    "query": "query GetUser($id: ID!) { user(id: $id) { id email firstName } }",
    "variables": { "id": "user-uuid-here" }
  }'

# Mutation
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "apollo-require-preflight: true" \
  -d '{
    "query": "mutation CreateUser($input: CreateUserInput!) { createUser(input: $input) { id email } }",
    "variables": {
      "input": {
        "email": "test@example.com",
        "firstName": "Test",
        "lastName": "User",
        "password": "password123"
      }
    }
  }'
```

### 3. JavaScript/Node.js

```javascript
// Using fetch
const response = await fetch('http://localhost:3000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apollo-require-preflight': 'true',
  },
  body: JSON.stringify({
    query: `
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          email
          firstName
          lastName
        }
      }
    `,
    variables: { id: 'user-uuid-here' },
  }),
});

const data = await response.json();
console.log(data);
```

### 4. Python

```python
import requests
import json

url = "http://localhost:3000/graphql"
headers = {
    "Content-Type": "application/json",
    "apollo-require-preflight": "true"
}

query = """
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    firstName
    lastName
  }
}
"""

variables = {"id": "user-uuid-here"}

response = requests.post(url, json={
    "query": query,
    "variables": variables
}, headers=headers)

print(response.json())
```

---

## 📋 Step-by-Step Examples

### Example 1: Create a User and Add Transactions

#### Step 1: Create User

```graphql
mutation CreateUser {
  createUser(
    input: {
      email: "alice@example.com"
      firstName: "Alice"
      lastName: "Johnson"
      password: "securepass123"
    }
  ) {
    id
    email
    firstName
    lastName
  }
}
```

#### Step 2: Create Income Transaction

```graphql
mutation CreateIncome {
  createTransaction(
    input: {
      amount: 2500.00
      description: "Salary payment"
      transactionType: INCOME
      category: "Salary"
      userId: "USER_ID_FROM_STEP_1"
    }
  ) {
    id
    amount
    description
    transactionType
    category
  }
}
```

#### Step 3: Create Expense Transaction

```graphql
mutation CreateExpense {
  createTransaction(
    input: {
      amount: 150.75
      description: "Restaurant dinner"
      transactionType: EXPENSE
      category: "Dining"
      userId: "USER_ID_FROM_STEP_1"
    }
  ) {
    id
    amount
    description
    transactionType
    category
  }
}
```

#### Step 4: Query User with All Transactions

```graphql
query GetUserWithTransactions {
  user(id: "USER_ID_FROM_STEP_1") {
    id
    email
    firstName
    lastName
    transactions {
      id
      amount
      description
      transactionType
      category
      createdAt
    }
  }
}
```

---

## 🔍 Schema Exploration

### View Available Types

In GraphQL Playground, click on **"Schema"** in the right sidebar to see:

- All available queries
- All available mutations
- Type definitions
- Field descriptions

### Introspection Query

```graphql
query IntrospectionQuery {
  __schema {
    types {
      name
      description
      fields {
        name
        description
        type {
          name
        }
      }
    }
  }
}
```

---

## ⚠️ Common Issues & Solutions

### 1. CSRF Error

**Error**: "This operation has been blocked as a potential Cross-Site Request Forgery (CSRF)"

**Solution**: Add the `apollo-require-preflight: true` header to your requests.

### 2. User Not Found

**Error**: "User not found"

**Solution**: Make sure you're using a valid UUID for the user ID.

### 3. Invalid Transaction Type

**Error**: "Invalid transaction type"

**Solution**: Use only `INCOME` or `EXPENSE` for transactionType.

### 4. Database Connection Issues

**Error**: "Unable to connect to the database"

**Solution**:

1. Make sure PostgreSQL is running: `docker-compose up -d`
2. Check your `.env` file configuration
3. Verify database credentials

### 5. Validation Errors

**Error**: "Validation failed"

**Solution**: The API uses Zod for input validation. Common validation rules:

- **Email**: Must be a valid email format
- **First Name**: Must not be empty
- **Last Name**: Must not be empty  
- **Password**: Must be at least 6 characters
- **Amount**: Must be a positive number
- **Transaction Type**: Must be `INCOME` or `EXPENSE`
- **User ID**: Must be a valid UUID

---

## 🧪 Testing Your API

### 1. Health Check

```graphql
query HealthCheck {
  __typename
}
```

### 2. Test User Creation

```graphql
mutation TestUserCreation {
  createUser(
    input: {
      email: "test@example.com"
      firstName: "Test"
      lastName: "User"
      password: "testpass123"
    }
  ) {
    id
    email
    firstName
    lastName
    createdAt
  }
}
```

### 3. Test Transaction Creation

```graphql
mutation TestTransactionCreation {
  createTransaction(
    input: {
      amount: 100.00
      description: "Test transaction"
      transactionType: EXPENSE
      category: "Test"
      userId: "USER_ID_FROM_PREVIOUS_STEP"
    }
  ) {
    id
    amount
    description
    transactionType
    category
    createdAt
  }
}
```

---

## 🔧 Validation with Zod

The API uses **Zod** for input validation, providing:

- **Type Safety**: Runtime type checking
- **Error Messages**: Clear validation error messages
- **Schema Definition**: Declarative schema validation

### Validation Rules

#### User Input Validation
```typescript
{
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
}
```

#### Transaction Input Validation
```typescript
{
  amount: z.number().positive('Amount must be positive'),
  description: z.string().min(1, 'Description is required'),
  transactionType: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().optional(),
  userId: z.string().uuid('User ID must be a valid UUID')
}
```

---

## 📖 Next Steps

1. **Explore the Schema**: Use GraphQL Playground to understand all available operations
2. **Create Test Data**: Use the examples above to populate your database
3. **Build Your Frontend**: Use the queries and mutations in your client application
4. **Add Authentication**: Implement JWT or session-based authentication
5. **Add Validation**: Implement input validation and error handling

---

## 🔗 Useful Resources

- [GraphQL Official Documentation](https://graphql.org/learn/)
- [Apollo Server Documentation](https://www.apollographql.com/docs/apollo-server/)
- [NestJS GraphQL Documentation](https://docs.nestjs.com/graphql/quick-start)
- [Zod Documentation](https://zod.dev/)

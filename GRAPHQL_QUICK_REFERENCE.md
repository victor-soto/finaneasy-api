# GraphQL Quick Reference

## 🚀 Quick Start

```bash
# Start the server
pnpm start:dev

# Access GraphQL Playground
open http://localhost:3000/graphql
```

## 📝 Common Operations

### Health Check

```graphql
query {
  __typename
}
```

### Create User

```graphql
mutation {
  createUser(
    input: {
      email: "user@example.com"
      firstName: "John"
      lastName: "Doe"
      password: "password123"
    }
  ) {
    id
    email
    firstName
    lastName
  }
}
```

### Create Transaction

```graphql
mutation {
  createTransaction(
    input: {
      amount: 100.50
      description: "Grocery shopping"
      transactionType: "EXPENSE"
      category: "Food"
      userId: "USER_ID_HERE"
    }
  ) {
    id
    amount
    description
    transactionType
  }
}
```

### Get User with Transactions

```graphql
query {
  user(id: "USER_ID_HERE") {
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
    }
  }
}
```

### Get Transaction with User

```graphql
query {
  transaction(id: "TRANSACTION_ID_HERE") {
    id
    amount
    description
    transactionType
    category
    user {
      id
      email
      firstName
      lastName
    }
  }
}
```

## 🔧 cURL Examples

### Simple Query

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "apollo-require-preflight: true" \
  -d '{"query": "{ __typename }"}'
```

### Create User

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "apollo-require-preflight: true" \
  -d '{
    "query": "mutation { createUser(input: { email: \"test@example.com\", firstName: \"Test\", lastName: \"User\", password: \"pass123\" }) { id email } }"
  }'
```

### Create Transaction

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "apollo-require-preflight: true" \
  -d '{
    "query": "mutation { createTransaction(input: { amount: 150.50, description: \"Grocery shopping\", transactionType: \"EXPENSE\", category: \"Food\", userId: \"USER_ID_HERE\" }) { id amount description } }"
  }'
```

## 📊 Data Types

### Transaction Types

- `"INCOME"` - Money received
- `"EXPENSE"` - Money spent

### User Fields

- `id` (UUID)
- `email` (String, unique)
- `firstName` (String)
- `lastName` (String)
- `password` (String, not exposed in GraphQL)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `transactions` (Array of Transaction)

### Transaction Fields

- `id` (UUID)
- `amount` (Decimal)
- `description` (String)
- `transactionType` (INCOME | EXPENSE)
- `category` (String, optional)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)
- `user` (User)

## ⚠️ Important Notes

1. **CSRF Protection**: Always include `apollo-require-preflight: true` header
2. **UUIDs**: Use valid UUIDs for IDs
3. **Transaction Types**: Use `"INCOME"` or `"EXPENSE"` (with quotes)
4. **Required Fields**: All fields except `category` are required for transactions
5. **Zod Validation**: Input validation is handled by Zod schemas

## 🧪 Working Examples

### Complete Workflow

1. **Create a user:**

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "apollo-require-preflight: true" \
  -d '{
    "query": "mutation { createUser(input: { email: \"demo@example.com\", firstName: \"Demo\", lastName: \"User\", password: \"password123\" }) { id email firstName lastName } }"
  }'
```

2. **Create a transaction (replace USER_ID with the ID from step 1):**

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "apollo-require-preflight: true" \
  -d '{
    "query": "mutation { createTransaction(input: { amount: 150.50, description: \"Grocery shopping\", transactionType: \"EXPENSE\", category: \"Food\", userId: \"7f59e784-5be4-45ff-905f-48bf1ef3c812\" }) { id amount description transactionType category } }"
  }'
```

3. **Query the user:**

```bash
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -H "apollo-require-preflight: true" \
  -d '{
    "query": "query { user(id: \"7f59e784-5be4-45ff-905f-48bf1ef3c812\") { id email firstName lastName } }"
  }'
```

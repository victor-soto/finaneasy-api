<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# FinanEasy API

A NestJS GraphQL API for financial transaction management.

## Import Aliases

This project uses TypeScript path aliases for cleaner imports:

- `@/*` - Points to `src/*`
- `@/infrastructure/*` - Points to `src/infrastructure/*`
- `@/application/*` - Points to `src/application/*`
- `@/domain/*` - Points to `src/domain/*`

### Example Usage

```typescript
// Instead of relative imports like:
import { UserEntity } from '../../../infrastructure/persistence/entities/user.entity';

// You can use aliases:
import { UserEntity } from '@/infrastructure/persistence/entities/user.entity';
```

## Database Setup

### Using Docker Compose (Recommended)

1. Start the PostgreSQL database:

```bash
docker-compose up -d
```

2. The database will be available at:
   - Host: `localhost`
   - Port: `5432`
   - Database: `finaneasy`
   - Username: `postgres`
   - Password: `postgres`

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=finaneasy

# Application Configuration
PORT=3000
```

## Running the Application

1. Install dependencies:

```bash
pnpm install
```

2. Start the development server:

```bash
pnpm start:dev
```

The API will be available at `http://localhost:3000/graphql`

## Database Management

- **Start database**: `docker-compose up -d`
- **Stop database**: `docker-compose down`
- **View logs**: `docker-compose logs postgres`
- **Reset database**: `docker-compose down -v && docker-compose up -d`

## Database Migrations

TypeORM migrations are used to manage database schema changes following best practices:

- **Generate migration**: `pnpm migration:generate src/infrastructure/persistence/migrations/MigrationName`
- **Run migrations**: `pnpm migration:run`
- **Revert last migration**: `pnpm migration:revert`
- **Show migration status**: `pnpm migration:show`

### Migration Best Practices

1. **Always generate migrations from entity changes** - Don't write migrations manually
2. **Review generated migrations** - Check for proper constraints, indexes, and data types
3. **Use descriptive migration names** - Include the purpose of the change
4. **Test migrations** - Always test both up and down migrations
5. **Version control** - Commit migration files to track schema changes
6. **Backup before production** - Always backup before running migrations in production

### Migration Workflow

1. Make changes to your domain entities in `src/domain/entities/`
2. Generate a migration: `pnpm migration:generate src/infrastructure/persistence/migrations/AddNewField`
3. Review and adjust the generated migration file if needed
4. Test the migration: `pnpm migration:run` then `pnpm migration:revert`
5. Run the migration: `pnpm migration:run`
6. Commit the migration file to version control

### Architecture

- **Domain Entities**: `src/domain/entities/` - Business logic and data models
- **Infrastructure**: `src/infrastructure/persistence/` - Database concerns
- **Migrations**: `src/infrastructure/persistence/migrations/` - Schema versioning

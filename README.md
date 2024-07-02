## Getting Started

> This project uses pnpm as the package manager.

Clone the repository:

```bash
  git clone https://github.com/mdayat/sea-salon.git
```

Install and run:

```bash
  pnpm install && pnpm dev
```

> Before starting the project, copy the env variables in the `.zip` file into your local .env file. Alternatively, you can provide your own database connection string if you want.

To check if the code complies with best practices:

```bash
  pnpm check-lint && pnpm check-format
```

## Tech Stack

1. TypeScript: to provide autocompletion.
2. Next JS: just use the almighty meta-framework.
3. Chakra UI: this is my first time using it.
4. Prisma with Postgresql: i don't care about query performance, so yeah, i use prisma. But i love postgresql.
5. Neon DB (postgresql): supabase's friend.
6. Zod: never trust user input, always validate and sanitize the data that you received.
7. Argon: because it's recommended by [OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).
8. Jose: i need to work with cryptography in [edge runtime](https://vercel.com/docs/functions/runtimes/edge-runtime).
9. Prettier: mandatory.
10. ESLint: mandatory.
11. Husky: mandatory.

## Code Base Architecture

> All business logic lives inside a "src" directory.

- src

  - pages: contains page-related components.
  - components: self-explanatory.
  - utils: contains a set of function utilities related to a page or a component.
  - hooks: self-explanatory.
  - context: contains state (data) that is shared "globally". Globally means it's shared across its children without passing the state through props one by one.
  - types: self-explanatory with additional validation schema using zod.
  - libs: contains a set of configuration for libraries that's intalled in the project.

- prisma: check it if you want to know the relational model of the database.

> You can ignore the rest of the files in the root directory.

## Completed Requirements:

1. Level 1: SEA Salon Home Page
2. Level 2: Interactivity
3. Level 3: Reservation System
4. Level 4: Authentication System

> The web app is already responsive

## Further Improvements

### Level 1

A section on a home page to display the reviews. It could be 3 to 5 reviews.

### Level 2 and Level 3

This can be improved by creating a list of services and stylists so the customers can book a reservation for a particular service with their favorite stylist.

After that, customers can provide reviews for reservations they have made. Reviews are attached to the stylist, not the service. Like Gojek, the stylist is the driver, and the customer can give a rating for each reservation or ride if the context is Gojek.

### Level 4

This can be improved by following the authorization protocol by OAuth 2.0 framework.

### Others

- Implement a retry strategy for request timeout or request that returns 5xx, indicating server error.

# Project Alita

## Setup (run everything in Docker)

- Duplicate the `.env.example` file and rename it to `.env`. If you want Login with Google to work, reach out to Jordan to get credentials.

- Start Docker Compose services

```
docker-compose up -d --build api
```

> Anytime new commits are pulled down, the command above will need to be re-run to update the built docker image.

- Visit http://localhost:4000/playground to view the GraphQL Playground.
- GraphQL endpoint: http://localhost:4000/graphql

## Setup (run API locally/not in Docker)

- Duplicate the `.env.example` file and rename it to `.env`. If you want Login with Google to work, reach out to Jordan to get credentials.

- Install Dependencies

```
npm install
```

- Start MySQL Database in Docker

```
docker-compose up -d mysql
```

- Start Typescript compiler/GraphQL File copier

```
npm run watch
```

> This needs to stay running to build any changes you make to the code.

- Start API

```
npm start
```

> Re-run this command anytime you make changes to restart with the latest changes.

## Helpful Commands

### Run migrations (without clearing data)

```
docker-compose up -d db_migrate
```

### Remove database and re-initialize

```
docker-compose stop mysql && rm -rf ./.data/mysql && docker-compose up -d mysql
```

## Emails in Local Environment

In order to receive emails in a local environment, make sure to verify your email address in SES in the AWS Management Console. An AWS_PROFILE environment variable needs to be set to a profile configured in your [AWS Credentials File](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html)

## Permissions/Role Matrix

|                           | Fulfillment Worker | Partner User | Admin | Super Admin |
| ------------------------- | ------------------ | ------------ | ----- | ----------- |
| Customer - Create         | ❌                 | ✅           | ✅    | ✅          |
| Customer - Details        | ✅                 | ✅           | ✅    | ✅          |
| Customer - Edit           | ❌                 | ✅           | ✅    | ✅          |
| Customer - List           | ❌                 | ✅           | ✅    | ✅          |
| Order - Create            | ❌                 | ✅           | ✅    | ✅          |
| Order - Details           | ❌                 | ✅           | ✅    | ✅          |
| Order - List              | ❌                 | ✅           | ✅    | ✅          |
| Partner - Create          | ❌                 | ❌           | ✅    | ✅          |
| Partner - Details         | ❌                 | ✅           | ✅    | ✅          |
| Partner - Edit            | ❌                 | ❌           | ✅    | ✅          |
| Partner - List            | ❌                 | ❌           | ✅    | ✅          |
| Partner Product - Create  | ❌                 | ✅           | ✅    | ✅          |
| Partner Product - Details | ❌                 | ✅           | ✅    | ✅          |
| Partner Product - Edit    | ❌                 | ✅           | ✅    | ✅          |
| Partner Product - List    | ❌                 | ✅           | ✅    | ✅          |
| Partner User - Create     | ❌                 | ✅           | ✅    | ✅          |
| Partner User - List       | ❌                 | ✅           | ✅    | ✅          |
| Partner User - Remove     | ❌                 | ✅           | ✅    | ✅          |
| Product - Create          | ❌                 | ❌           | ❌    | ✅          |
| Product - Details         | ❌                 | ✅           | ✅    | ✅          |
| Product - Edit            | ❌                 | ❌           | ❌    | ✅          |
| Product - List            | ❌                 | ✅           | ✅    | ✅          |
| Task - Details            | ✅                 | ❌           | ✅    | ✅          |
| Task - Edit/Complete      | ✅                 | ❌           | ✅    | ✅          |
| Task - List               | ❌                 | ❌           | ✅    | ✅          |
| User - Create             | ❌                 | ❌           | ✅    | ✅          |
| User - Details            | ❌                 | ❌           | ✅    | ✅          |
| User - Edit               | ❌                 | ❌           | ✅    | ✅          |
| User - List               | ❌                 | ❌           | ✅    | ✅          |
| User Role - Create        | ❌                 | ❌           | ✅    | ✅          |
| User Role - Details       | ❌                 | ❌           | ✅    | ✅          |
| User Role - List          | ❌                 | ❌           | ✅    | ✅          |
| User Role - Remove        | ❌                 | ❌           | ✅    | ✅          |
| Vendor - Create           | ❌                 | ❌           | ✅    | ✅          |
| Vendor - Details          | ❌                 | ❌           | ✅    | ✅          |
| Vendor - Edit             | ❌                 | ❌           | ✅    | ✅          |
| Vendor - List             | ❌                 | ❌           | ✅    | ✅          |
| Vendor User - Create      | ❌                 | ❌           | ✅    | ✅          |
| Vendor User - Details     | ❌                 | ❌           | ✅    | ✅          |
| Vendor User - List        | ❌                 | ❌           | ✅    | ✅          |
| Vendor User - Remove      | ❌                 | ❌           | ✅    | ✅          |

## System Overview

- [Checklist Definition Item](###Checklist-Definition-Item)
- [Checklist Definition](###Checklist-Definition)
- [Checklist Item](###Checklist-Item)
- [Checklist](###Checklist)
- [Customer](###Customer)
- [Order Item Keyword](###Order-Item-Keyword)
- [Order Item](###Order-Item)
- [Order](###Order)
- [Partner Product](###Partner-Product)
- [Partner User](###Partner-User)
- [Partner](###Partner)
- [Product](###Product)
- [Role](###Role)
- [Task Type](###Task-Type)
- [Task](###Task)
- [User Temporary Login Code](###User-Temporary-Login-Code)
- [User](###User)
- [User Role](###User-Role)
- [Vendor User](###Vendor-User)
- [Vendor](###Vendor)
- [Workflow](###Workflow)

### Checklist Definition Item

Checklist Definition Item belongs to a Checklist Definition and defines an item that should be shown on a Checklist.

### Checklist Definition

Checklist Definition is the template to be used when Vendors fulfill orders of the associated Partner Product. A Checklist Defintion will consist of a collection of Checklist Definition Items.

### Checklist Item

Checklist Item represents a "sub-task" for a given checklist.

### Checklist

Checklist is an instance of a Checklist Definition and is used in the fulfillment workflow for a "Custom Product."

### Customer

A Customer represents an end-user/company for whom orders are placed and work is completed.

### Order Item Keyword

Soon to renamed to Order Keyword. Represents additional data supplied when creating an order and is used in the fulfillment process.

### Order Item

Soon to be deprecated.

### Order

Order represents a "purchase" or "sale" and signals the system to produce work based on the details provided when creating the order. Orders can only be placed for customers.

### Partner Product

Partner Product represents an offering from a partner to their customers. Partner Products have a base Product, which is an offering from RCM. A Partner may have more than one Partner Product tied to the same base Product.

### Partner User

Partner User represents a user that has been delegated access to manage a Partner and its customers.

### Partner

A Partner is an organization that is using the system. A Partner may have customers associated to it.

### Product

Product represents a core offering from RCM.

### Role

### Task Type

### Task

### User Temporary Login Code

### User

### User Role

### Vendor User

### Vendor

### Workflow

# Video Course Starter Kit

This is a Next.js app for building a video course with Mux

## Getting Started

### Database Setup

Install the [Planetscale CLI](https://github.com/planetscale/cli) (on Mac `brew install planetscale/tap/pscale`)

Authorize the Planetscale CLI:

```
pscale auth
```

Run the Planetscale database `video-course-starter-kit` on port 3309:

```
pscale connect video-course-starter-kit main --port 3309
```

(Make sure you're authorized with the `muxhq` Planetscale team).

### A note on production db connections

When working with Prisma and Planetscale in production, you'll need to modify your database connection string within the environment variables.

The string that is provided to you by Planetscale looks something like this:

`DATABASE_URL='mysql://dbusername:************@us-east.connect.psdb.cloud/video-course-starter-kit?ssl={"rejectUnauthorized":true}'`

You should modify the query parameter at the end of the string to change the `sslaccept` setting to `strict`

`DATABASE_URL='mysql://dbusername:************@us-east.connect.psdb.cloud/video-course-starter-kit?sslaccept=strict'`

### Run the Dev Server

```
yarn dev
```

### Github Oauth setup

Go to [github.com/settings/developers](https://github.com/settings/developers)

Click "OAuth Apps" and create an Oauth application to use in Development:

![Github Oauth Application Setup](./screenshots/github-oauth.png)

Set the callback URL to 

```
http://localhost:3000/
```

## Recommended VS code extensions
### Prisma
Adds syntax highlighting, formatting, auto-completion, jump-to-definition and linting for .prisma files.

https://marketplace.visualstudio.com/items?itemName=Prisma.prisma
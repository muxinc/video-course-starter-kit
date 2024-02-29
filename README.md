# Video Course Starter Kit

This project demonstrates how you can use Next.js and Mux to build your own video course platform. You might use this repo as a starting point for building your own membership-gated video course platform. 

Feel free to browse the source code to see how you can use Mux's video APIs to upload, encode, and playback videos in your Next.js app.

Try out our hosted version of the application at [https://video-course-starter-kit.mux.dev](https://video-course-starter-kit.mux.dev)

## Stack details

We used modern tooling to build this example project, including:

- Written in [TypeScript](https://www.typescriptlang.org/)
- [Tailwind](https://tailwindcss.com/) for CSS styling
- [Planetscale](https://planetscale.com/) for data persistence
- [Prisma](https://www.prisma.io/) for ORM
- [NextAuth](https://next-auth.js.org/) for authentication via GitHub
- [Mux](https://mux.com) for video streaming and thumbnail generation
- [Mux Player](https://docs.mux.com/guides/video/mux-player) for video playback
- [Mux Uploader](https://github.com/muxinc/elements/tree/main/packages/mux-uploader-react) for video uploading

## Deploy your own
### Register for a Mux account

Mux will encode and serve all of the videos within the video course. To get started with a complimentary $20 in credits, [sign up for a Mux account](https://dashboard.mux.com/signup)

### Register for a Planetscale account
Planetscale is a MySQL-compatible serverless database platform. Signing up for Planetscale is free – you can [register your account here](https://auth.planetscale.com/sign-up) if you don't already have one.

### Install this repo
Run the follow three commands to clone this repo and install its dependencies:
```
git clone https://github.com/muxinc/video-course-starter-kit.git
cd video-course-starter-kit
yarn
```

### Create a `.env.local` file

This project uses several secrets to access the different accounts used throughout the codebase. You can configure these values locally by copying the `.env.local.example` file to a new file called `.env.local` and filling out the values as you receive them in the steps below.

Also, don't forget to add the values to the project's environment variables in production on Vercel.

### Mux account setup

To authenticate this application with your Mux account, [create a new access token](https://dashboard.mux.com/settings/access-tokens) within the Mux dashboard and copy the access token ID and secret into your `.env.local` file and into your Vercel environment variables.

### Database Setup

First, make sure you have `mysql-client` installed locally so you can take full advantage of the `pscale` CLI tool down the road. On MacOS with Homebrew installed, you can run the following command in your terminal:

```
brew install mysql-client
```

Next, install the [Planetscale CLI](https://github.com/planetscale/cli). Again, on MacOS, this command will do the trick:

```
brew install planetscale/tap/pscale
```

Next, authorize the Planetscale CLI with your newly created account by running:

```
pscale auth login
```

Create a new database in your Planetscale account called `video-course-starter-kit`
```
pscale database create video-course-starter-kit
```
Follow the link provided to you as a result of running this command to get the connection string for your database.

![Click to get your connection string](public/images/pscale-connect.png)
![Change your connection method to Prisma](public/images/pscale-prisma.png)
![Copy the value and paste into your .env.local file](public/images/pscale-string.png)

Copy the resulting authenticated database url value into your `.env.local` file and into your Vercel environment variables.

We'll connect to this database locally by opening a connection to it on a local port. Here's how you can connect to the Planetscale database `video-course-starter-kit` on port 3309:

```
pscale connect video-course-starter-kit main --port 3309
```

## Modifying the database schema

If you'd like to make any changes to the database schema, you can do so by following these steps:

```
pscale branch create video-course-starter-kit my-new-branch

# after a few moments, close and reopen db proxy to the new branch
pscale connect video-course-starter-kit my-new-branch --port 3309

# change your schema in the prisma/schema.prisma file... then,
npx prisma generate
npx prisma db push

# when ready, make a deploy request
pscale deploy-request create video-course-starter-kit my-new-branch

# shipit
pscale deploy-request deploy video-course-starter-kit 1
```

## Inspecting the database
Prisma provides a nice interface to be able to load up your database contents and see the data that is powering your application. When you've connected to your Planetscale database, you can load up the Prisma GUI with the following command:

```
npx prisma studio
```

## Handling webhooks

Mux uses webhooks to communicate the status of your uploaded video assets back to your application. To handle these webhooks locally, you'll first need to install [ngrok](https://ngrok.com/download).

```shell
brew install ngrok/ngrok/ngrok
ngrok config add-authtoken <YOUR_NGROK_TOKEN>
ngrok http 3000
```

Now, we need to make Mux aware of your ngrok URL. Visit [https://dashboard.mux.com/settings/webhooks](https://dashboard.mux.com/settings/webhooks) and add the tunnel URL listed in your terminal as a URL that Mux should notify with new events.

> Make sure to append `/api/webhooks/mux` to the end of your tunnel URL.

Then, copy the Webhook signing secret value and paste it into your `.env.local` file under `MUX_WEBHOOK_SECRET`

### Run the development server

Starting up the dev server is a simple one line command:

```
yarn dev
```

### GitHub OAuth setup

End users of this video course application can authenticate with their GitHub account. As a prerequisite, you'll need to create an OAuth App on GitHub that associates a user's access to your application with your GitHub account.

To create your OAuth app, follow these steps:

1. Go to [https://github.com/settings/developers](https://github.com/settings/developers)

2. Click "OAuth Apps" and create an Oauth application to use in Development:

![Github Oauth Application Setup](./screenshots/github-oauth.png)

| Application name               | Homepage URL                                       | Authorization callback URL |
|--------------------------------|----------------------------------------------------|----------------------------|
| Video Course Starter Kit (dev) | https://github.com/muxinc/video-course-starter-kit | http://localhost:3000/     |

3. Copy the `GITHUB_ID` and `GITHUB_SECRET` and paste them into your environment variables on Vercel and in your `.env.local` file.

> Note: when you deploy a production copy of this application, you'll need to create another GitHub OAuth app which uses your production URL as the "Authorization callback URL" value.
## Recommended VS code extensions
### Prisma
The [Prisma extension](https://marketplace.visualstudio.com/items?itemName=Prisma.prisma) adds syntax highlighting, formatting, auto-completion, jump-to-definition and linting for .prisma files.

## Questions? Comments?

Tweet us [@MuxHQ](https://twitter.com/muxhq) or email help@mux.com with anything you need help with.
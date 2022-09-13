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

### Run the Dev Server

```
yarn dev
```

### Github Oauth setup

Go to [github.com/settings/developers](https://github.com/settings/developers)

Click "OAuth Apps" and create an Oauth application to use in Development:

![Github Oauth Application Setup]('./screenshots/github-oauth.png')

Set the callback URL to 

```
http://localhost:3000/
```

# AI Coding Hackathon — Project Discovery App

A React + TypeScript web app for hackathon participants to browse, join, and propose coding projects.

## Prerequisites

- [Node.js v24 LTS](https://nodejs.org/) (see `.nvmrc`)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). The home route (`/`) shows a Hello World page.

## Build

```bash
npm run build
```

Production assets are written to `dist/`.

Preview the production build locally:

```bash
npm run preview
```

## Deploy

Build the app, then deploy the `dist/` folder to a static host (e.g. [Netlify](https://www.netlify.com/)).

```bash
npm run build
```

For Netlify, set the build command to `npm run build` and the publish directory to `dist`.

## Scripts

| Script                 | Description                            |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Start the Vite dev server              |
| `npm run build`        | Type-check and build for production    |
| `npm run preview`      | Serve the production build locally     |
| `npm run lint`         | Run ESLint                             |
| `npm run lint:fix`     | Run ESLint with auto-fix               |
| `npm run format`       | Format code with Prettier              |
| `npm run format:check` | Check formatting without writing files |

## Project docs

- [Requirements](docs/requirements.md)
- [Implementation TODO](docs/TODO.md)

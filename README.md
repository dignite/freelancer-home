# Freelancer Home

A home page to visualize work and maybe add triggers for starting and stopping Harvest, setting Slack status, and other things.

## Pre-requisites

- A Harvest API key
- A PE Accounting API key

## Development

1. `cp .env.example .env`
2. `code .env` and set values
3. `npm test` && `npm run dev`

## Deployment

This application can be deployed many ways, but the quickest is to use Vercel

1. Connect the repository
2. Add environment variables required (see .env.example) in the Vercel UI

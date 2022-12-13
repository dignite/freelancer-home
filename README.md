# Freelancer Home

A home page to visualize work and maybe add triggers for starting and stopping Harvest, setting Slack status, and other things.

## Pre-requisites

This application has a dependency on [harvest-report-lambda](https://github.com/dignite/harvest-report-lambda), or a REST API of the same shape.

## Development

1. `cp .env.example .env`
2. `code .env` and set values
3. `npm test` && `npm run dev`

## Deployment

This application can be deployed many ways, but the quickest is to use Vercel

1. Connect the repository
2. Add environment variables required (see .env.example) in the Vercel UI

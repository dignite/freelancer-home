# Freelancer Home

A home page to visualize work and maybe add triggers for starting and stopping Harvest, setting Slack status, and other things.

# Deployment

1. Edit domain in serverless.yml to a domain you own controlled in AWS Route 53
2. `npm run deploy`

# Troubleshooting

## In case of "Error: Your newly validated AWS ACM Certificate is taking a while to register as valid. Please try running this component again in a few minutes."

1. Go to AWS Certificate Manager for us-east-1 and "List certificates"
2. Click certificate that has pending validation
3. "Create records in Route 53", wait for validation to complete. You might need to wait a while.
4. Re-run `npm run deploy`

# Clean up

1. `npm run remove-deploy`
2. Wait a few minutes
3. Go to AWS CloudFront and delete distribution

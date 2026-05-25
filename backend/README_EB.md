# AWS Elastic Beanstalk Deployment - Backend

This backend is deployed on AWS Elastic Beanstalk behind an Application Load Balancer and is exposed through the custom API domain [https://amp-api.vedaangsharma.dev/api/v1](https://amp-api.vedaangsharma.dev/api/v1).

Implementation details:

- The Express app is mounted under `/api/v1` in `src/app.ts`.
- `package.json` provides `build` and `start` scripts so the compiled server runs from `dist/server.js`.
- `Procfile` tells Elastic Beanstalk to launch the API with `npm start`.
- The ALB terminates HTTPS traffic, and AWS Certificate Manager manages the SSL certificate.
- Cloudflare manages DNS for the backend custom domain.
- MongoDB Atlas stores the application data.

## Deployment Steps

1. Build the backend locally with `npm run build` so `dist/server.js` exists in the deployment package.
2. Package the `backend` folder, including the compiled `dist/` output, `Procfile`, `package.json`, and source files.
3. Create an Elastic Beanstalk Node.js environment and attach the Application Load Balancer.
4. Configure the environment variables listed below, especially `CLIENT_URL=https://amp-demo.vedaangsharma.dev`.
5. Attach the ACM certificate to the ALB listener and redirect HTTP traffic to HTTPS.
6. Route the custom API domain through Cloudflare so the public endpoint resolves to the live backend URL.

## Configuration Details

- `Procfile`: Tells Elastic Beanstalk to run `npm start`.
- `build` script: Compiles TypeScript into `dist/server.js` before packaging.
- `start` script: Starts the production server from the compiled output.
- `ALB + ACM`: Provides secure HTTPS termination and managed certificate renewal.
- `Cloudflare DNS`: Routes the public custom domain to the load balancer.

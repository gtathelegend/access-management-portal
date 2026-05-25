# Access Management Portal Backend

Production-ready Express + TypeScript API for the Access Management Portal.

## Scripts

- `npm run dev` - local development with nodemon
- `npm run build` - compile TypeScript to `dist/`
- `npm run start` - run the compiled production server from `dist/server.js`

## Environment Variables

Copy `.env.example` to `.env` for local development and set the following values in AWS Elastic Beanstalk:

- `NODE_ENV` - `development` locally, `production` on AWS
- `PORT` - optional locally, provided by Elastic Beanstalk in production
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - strong signing secret
- `JWT_EXPIRES_IN` - example: `7d`
- `CLIENT_URL` - Angular frontend URL from Amplify
- `BCRYPT_SALT_ROUNDS` - optional, defaults to `12`

## AWS Elastic Beanstalk Deployment

1. Create an Elastic Beanstalk Node.js environment.
2. Set the environment variables above in the EB console.
3. Deploy the backend folder with `Procfile`, `.ebextensions`, `package.json`, and `src/` included.
4. EB runs the build step from `.ebextensions/nodecommand.config`, then starts the app with `npm run start`.

## Health Check

- `GET /health` - unauthenticated health check for AWS and uptime monitoring.
- Response:

```json
{
  "status": "ok",
  "message": "Access Management Portal API running"
}
```

## Notes

- API routes remain under `/api/v1`.
- JWT auth, role checks, records, users, stats, analytics, and delay middleware are preserved.
- CORS is restricted to the configured `CLIENT_URL` and supports credentialed requests.
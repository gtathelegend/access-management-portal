# Access Management Portal Backend

## Deployment Steps

This backend is configured for deployment to AWS Elastic Beanstalk.

### Prerequisites

1.  **AWS CLI** installed and configured.
2.  **EB CLI** installed (optional but recommended).

### Deployment Steps

1.  **Zip the backend folder**:
    Make sure you are inside the `backend` directory and zip all files (including `.ebextensions`, `Procfile`, `package.json`, `src`, etc.).
    *Note: `.ebignore` will ensure `node_modules` and other unnecessary files are not included if you use the EB CLI.*

2.  **Create an Elastic Beanstalk Environment**:
    - Platform: **Node.js 20** (on AL2023 or AL2).
    - Upload your zip file.

3.  **Configure Environment Variables**:
    In the Elastic Beanstalk console, go to **Configuration -> Updates, monitoring, and logging -> Platform software** and add the following environment properties:
    - `NODE_ENV`: `production`
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
    - `JWT_SECRET`: A secure random string.
    - `JWT_EXPIRES_IN`: e.g., `7d`.
    - `CLIENT_URL`: The URL of your deployed frontend (e.g., your Amplify URL).
    - `PORT`: `8080` (EB default).
    - `BCRYPT_SALT_ROUNDS`: `12` (optional).

## Configuration Details

- **Procfile**: Tells Beanstalk to run `npm start`.
- **.ebextensions/00_options.config**: Sets Node.js version and ensures devDependencies are installed for building.
- **.ebextensions/01_build.config**: Automatically runs `npm run build` during deployment.
- **.ebignore**: Prevents large/unnecessary files from being uploaded.

# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.17.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## AWS Amplify Deployment

This frontend is deployed on AWS Amplify at [https://amp-demo.vedaangsharma.dev](https://amp-demo.vedaangsharma.dev) and builds against the production API at [https://amp-api.vedaangsharma.dev/api/v1](https://amp-api.vedaangsharma.dev/api/v1).

Implementation details:

- Production builds use `src/environments/environment.production.ts`.
- `amplify.yml` installs dependencies and runs the Angular build during Amplify deployments.
- `API_BASE_URL` is injected at build time so the frontend points at the live Elastic Beanstalk API instead of a hardcoded host.
- The compiled frontend is published from `frontend/dist/frontend/browser`.
- The app uses Angular's environment replacement system, so local development still points to `http://localhost:3000/api/v1`.

Typical production build command:

```bash
npm run build
```

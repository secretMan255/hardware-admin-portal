# Introduce

This is a react nextjs portal that use Axios to fetch data from the [backend](https://github.com/secretMan255/Hardware-portal.git)

# Setup Instructions

Set enviroment variable

-    NEXT_PUBLIC_API_BASE_URL -> API endpoint
-    NEXT_PUBLIC_BEREAR_TOKEN -> Token

Install Dependencies

```
npm i
```

Start the Project

```
npm run dev
```

# Deployment

Create a Dockerfile in root path (already provided)

```
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=build /app/.next .next
COPY --from=build /app/public public
COPY --from=build /app/package.json package.json
COPY --from=build /app/node_modules node_modules

# Set production environment
ENV NODE_ENV=production

# Expose Next.js default port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "run", "start"]

```

Build image

```
docker build -t image-name .
```

Push the Image to Docker Hub (Optional)

```
docker push tagname/image-name
```

Create script (googleDeploy.sh) at root path if u want to deploy on google cloud run
Start Deploy

```
./googleDeploy.sh
```

Script

```
#!/bin/bash

# Define environment variables
GOOGLE_PROJECT_ID=""
CLOUD_RUN_SERVICE=""
NEXT_PUBLIC_API_BASE_URL=''
NEXT_PUBLIC_BEREAR_TOKEN=''

# Step 1: Deploy to Google Cloud Run using your Docker Hub image
gcloud run deploy $CLOUD_RUN_SERVICE \
     --image= \
     --add-cloudsql-instances=$INSTANCE_CONNECTION_NAME \
     --update-env-vars=NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL,NEXT_PUBLIC_BEREAR_TOKEN=$NEXT_PUBLIC_BEREAR_TOKEN \
     --platform=managed \
     --region=asia-southeast1 \
     --allow-unauthenticated \
     --project=$GOOGLE_PROJECT_ID \
     # --set-secrets GOOGLE_APPLICATION_CREDENTIALS=google-service-account:latest \
```

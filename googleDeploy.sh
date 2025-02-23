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
    

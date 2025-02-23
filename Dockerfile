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

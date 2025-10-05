# Step 1: Build Next.js app
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

# Pass MongoDB URI during build
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

RUN npm run build

# Step 2: Production image
FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app ./
ENV MONGODB_URI=$MONGODB_URI
EXPOSE 3000
CMD ["npm", "start"]

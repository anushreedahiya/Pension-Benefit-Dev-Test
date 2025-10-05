# Step 1: Build the Next.js app
FROM node:18-alpine AS builder

# Accept MongoDB URI as build argument
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Build the app
RUN npm run build

# Step 2: Run production server
FROM node:18-alpine

WORKDIR /app

# Accept MongoDB URI as environment variable
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

# Copy built app from builder stage
COPY --from=builder /app ./

# Expose port
EXPOSE 3001

# Start app
CMD ["npm", "start"]

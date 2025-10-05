# Step 1: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Accept the MongoDB URI as a build argument and set it as an environment variable
ARG MONGODB_URI
ENV MONGODB_URI=${MONGODB_URI}

# Build the Next.js app
RUN npm run build

# Step 2: Run production server
FROM node:18-alpine

WORKDIR /app

# Copy build from the builder stage
COPY --from=builder /app ./

# Expose the port
EXPOSE 3000

# Start the server
CMD ["npm", "start"]

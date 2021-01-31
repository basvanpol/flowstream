# Create image based on the official Node 6 image from the dockerhub
FROM node:14.14.0-alpine

# Create a directory where our app will be placed
RUN mkdir -p /app/api

# Change directory so that our commands run inside this new directory
WORKDIR "/app/api"

# Copy dependency definitions
COPY package*.json /app/api/

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . .

# Expose the port the app runs in
EXPOSE 8090

# Serve the app
CMD ["npm", "run", "start"]
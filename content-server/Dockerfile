# Create image based on the official Node 6 image from the dockerhub
FROM node:8

# Create a directory where our app will be placed
RUN mkdir -p /app/content-server

# Change directory so that our commands run inside this new directory
WORKDIR /app/content-server

# Copy dependency definitions
COPY package.json /app/content-server/

# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . .

# Serve the app
CMD ["npm", "start"]
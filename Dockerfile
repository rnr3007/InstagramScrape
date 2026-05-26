# Use node:20.11.0
FROM node:20.11.0-alpine3.19

# Setup working directory
WORKDIR /usr/src/app

# Copy package file and install dependencies
COPY ./instagram-scrape/package*.json ./
RUN npm install

# Copy the rest of the code
COPY ./instagram-scrape/* .

# Expose port
EXPOSE 3000

# Command to start app
CMD ["npm", "run", "start"]
# Use a Node.js base image
FROM node:18-alpine

# Create and set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json .

# Install app dependencies
RUN npm install -f

# Copy the rest of the application files to the working directory
COPY . .

RUN npm run build

# Expose the port on which your Express app runs (replace 3000 with your app's port if different)
EXPOSE 4080

# Command to start your Express app
CMD ["node", "build/src/app.js"]

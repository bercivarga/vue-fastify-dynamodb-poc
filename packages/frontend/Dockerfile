# Use Node.js LTS version
FROM node:lts

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 5173

# Command to run the app
CMD ["npm", "run", "preview"]
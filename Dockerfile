FROM node:18-slim

# Install dependencies and Chromium
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  libgbm1 \
  libnss3 \
  xdg-utils \
  wget \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Tell Puppeteer where to find Chrome
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Start app
CMD ["npm", "start"]

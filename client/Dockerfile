### Stage 1: build bundle angular
FROM node:16 as builder

RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json /app/

# Install app dependencies.
RUN npm install

COPY . /app

# Default build configuration (production by default)
ARG configuration=production

# Build app
RUN npm run build -- --output-path=./dist/out --configuration $configuration

### Stage 2: delivery ###
FROM nginx:alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy output directory from builder to nginx image.
COPY --from=builder /app/dist/out /usr/share/nginx/html

# Copy nginx configuration file.
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

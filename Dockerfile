# Use node:20.11.0
FROM node:20.11.0-alpine3.19

# Setup working directory
WORKDIR /usr/src/app

# Install Appium requirement
# Define version and install dependencies
RUN apk add --no-cache ca-certificates wget tar
RUN wget https://download.java.net/java/GA/jdk18/43f95e8614114aeaa8e8a5fcf20a682d/36/GPL/openjdk-18_linux-x64_bin.tar.gz && \
    tar -xvf openjdk-18_linux-x64_bin.tar.gz && \
    mv jdk-18 /opt/

ENV JAVA_HOME=/opt/jdk-18
ENV PATH="${PATH}:${JAVA_HOME}/bin"

RUN npm i appium@2.0.1
RUN npm i appium driver appium-uiautomator2-driver@2.12.2

# Copy package file and install dependencies
ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
COPY ./instagram-scrape/* .
RUN npm install

# Expose port
EXPOSE 3000

# Command to start app
CMD ["npm", "run", "start"]
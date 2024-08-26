# Price Tracker
## Overview
  Price Tracker is a web application built with Node.js, React, and MongoDB (using Mongoose). It allows users to track prices of products across different websites, choose price selectors interactively, and check prices at regular intervals.
## Technologies
  - Backend: Node.js, Express
  - Frontend: React
  - Database: MongoDB with Mongoose
  - Web Scraping: Custom script for scraping product prices, puppeteer
  - Mailing: nodemailer
## Prerequisities
  - Node.js (v14 or higher)
  - MongoDB (installed locally or use a cloud service like MongoDB Atlas)
  - npm or yarn
## Environment variables:
  - MONGODB_URI: Your MongoDB connection string. Adjust it if using a different database or authentication method.
  - PORT: Port number on which the backend server will run (default is 3003).
  - SECRET: A secret key used for signing JWT tokens. Change this to a secure random string.
  - INTERVAL: The interval in minutes at which to check product prices.
  - MAIL_APP_PASSWORD: Password for your email service*
  - MAIL_APP_USERNAME: Login for your email service*
## Usage
1. Add a New Product
   - Navigate to the "Add Product" page.
   - Enter the product details and URL.
   - The application will fetch the product page and display its DOM for interactive selector choosing.

2. Choose Price Selector
   - Use the interactive tool to select the price element from the product’s webpage.
   - Save the selector and the application will start tracking the price.

3. Monitor Prices
   - View the price history and current price on the "Product List" page, use color guide to know if price is new or an error has ocurred
## Screenshots
<img width="1906" alt="Screenshot 1" src="https://github.com/user-attachments/assets/14f1ee84-bacc-4244-867f-245ae5f9200a">
<img width="1906" alt="Screenshot 2" src="https://github.com/user-attachments/assets/14e8d542-ea21-4be8-9230-70934fe7ff6b">

*App works only with Gmail App Passwords for now

# Shopping Cart Application

## Overview
This is a shopping cart application built with React. The app allows users to browse products, add them to their cart, apply discount codes, and place an order. It communicates with a backend API to fetch product details, manage the cart, and submit orders.

## Features
- Fetch and display products from an API.
- Add products to a shopping cart.
- Update product quantities in the cart.
- Apply discount codes.
- Live update of the total cost.
- Checkout and place an order.

## Setup Instructions

### Prerequisites
Make sure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (version 16 or later recommended)
- [Yarn](https://yarnpkg.com/) or npm
- [Docker](https://www.docker.com/) (for running the API backend)

### Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/VassileiosXristopoulos/simpler-assignment
   cd simpler-assignment
   ```

2. Install dependencies:
   ```sh
   yarn install
   # or
   npm install
   ```

3. The expected backend URL is `localhost:8080`, but if you use something else, configure the application's environment variables in the following way:
   ```sh
   cp .env.template .env
   ```
   Update `.env` with the required API URL.

### Running the API Backend
1. Start the backend API using Docker:
   ```sh
   yarn start-backend
   # or
   npm run start-backend
   ```
   This will start the API on `http://localhost:8080`.

2. To stop the backend API:
   ```sh
   yarn stop-backend
   # or
   npm run stop-backend
   ```

### Running the Application
1. Start the development server:
   ```sh
   yarn dev
   # or
   npm run dev
   ```

2. Open your browser and go to `http://localhost:5173` (or the port specified in your terminal).

### Running Tests
Run the available tests with:
   ```sh
   yarn test
   # or
   npm run test
   ```

To check test coverage:
   ```sh
   yarn coverage
   # or
   npm run coverage
   ```

### Linting
Ensure your code follows best practices by running:
   ```sh
   yarn lint
   # or
   npm run lint
   ```

### Building for Production
To build the project:
   ```sh
   yarn build
   # or
   npm run build
   ```

### Preview Production Build
To preview the built project:
   ```sh
   yarn preview
   # or
   npm run preview
   ```

## Project Structure
```
├── src/
│   ├── adapters/        # Adapters for API data conversions
│   ├── api/             # API service functions
│   ├── assets/          # Application assets
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React context providers
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Custom layouts
│   ├── pages/           # Page components
│   ├── utilities/       # Utility functions
├── public/              # Static assets
├── .env.template        # Environment variables template
├── package.json         # Project dependencies
├── tailwind.config.js   # Tailwind CSS configuration
```

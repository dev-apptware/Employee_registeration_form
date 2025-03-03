# Employee Registration Form

A React-based employee registration form application that allows organizations to collect and store employee data. The application supports data persistence through a JSON Server and can also integrate with an external API.

## Features

- Complete employee registration form with validation
- Data persistence using JSON Server
- Integration with external API
- Reporting manager selection from existing employees
- Skills and department selection
- Date pickers for DOB and joining date
- Modern UI with Shadcn/UI components

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Shadcn/UI
- **Form Handling:** React Hook Form
- **Data Storage:** JSON Server
- **API Integration:** Axios
- **Styling:** Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/devwithsmile/Employee_registeration_form.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables by creating or editing a `.env` file in the root directory:
   ```
   VITE_API_URL=https://hrms-au5y.onrender.com/employee/add
   VITE_JSON_SERVER_URL=http://localhost:3001
   ```

### Running the Application

1. Start both the frontend and JSON Server simultaneously:
   ```bash
   npm run dev
   ```

   This will start:
   - The React frontend at http://localhost:5000
   - The JSON Server at http://localhost:3001

2. Alternatively, you can run them separately:
   ```bash
   # Start just the frontend
   npm run dev:frontend

   # Start just the JSON Server
   npm run server
   ```

## Data Flow

1. When an employee submits the registration form, data is sent to:
   - The JSON Server (for local persistence)
   - The external API (if configured)

2. When viewing/selecting managers, data is fetched from the JSON Server

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set the following config in Vercel:
   - Root Directory: (leave blank)
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Environment Variables: Add `VITE_API_URL` and `VITE_JSON_SERVER_URL`

### JSON Server Deployment

To make the JSON Server accessible to all users, you'll need to deploy it to a server like Heroku, Railway, or DigitalOcean.

For example, to deploy to Heroku:

1. Create a separate repository for the JSON Server
2. Create a `server.js` file:
   ```javascript
   const jsonServer = require('json-server');
   const server = jsonServer.create();
   const router = jsonServer.router('data/employees.json');
   const middlewares = jsonServer.defaults();
   const port = process.env.PORT || 3001;

   server.use(middlewares);
   server.use(router);

   server.listen(port, () => {
     console.log(`JSON Server is running on port ${port}`);
   });
   ```

3. Deploy to Heroku and update the `VITE_JSON_SERVER_URL` in your frontend to point to the deployed server

## License

MIT

[README.md](https://github.com/user-attachments/files/22024794/README.md)
# **Hotel Booking Application**

This is a full-stack hotel room booking website built with a React frontend, a Node.js/Express backend, and Google Sheets as the database. It features dynamic pricing, real-time availability checking, and a responsive design.

# **Documentation**
https://docs.google.com/document/d/1OO__AEcxSP6D6JEyfcmSSnr1SqVQPYtqcZLigBTGiCg/edit?usp=sharing

## **Live Demo**

You can view the live deployed application here:  
https://vijaykcse.github.io/hotel-booking-app/

## **Features**

* **Dynamic Pricing:** Real-time price calculation based on dates, occupancy, and rate plans.  
* **Live Availability:** Checks the Google Sheet inventory in real-time.  
* **Room Filtering:** Users can filter rooms by categories (Single, Double, Suite).  
* **Booking Functionality:** A complete booking system that updates the inventory and logs the booking in the Google Sheet.  
* **Responsive Design:** A modern UI that works on all devices.

## **Tech Stack**

* **Frontend:** React, Vite, Tailwind CSS  
* **Backend:** Node.js, Express  
* **Database:** Google Sheets

## **Setup & Installation**

### **Prerequisites**

* Node.js (v18 or later)  
* npm  
* A Google Cloud Platform project with a configured Service Account.

### **Backend Setup**

1. Navigate to the backend directory:  
   cd backend

2. Install dependencies:  
   npm install

3. Create a .env file and populate it with your Google credentials.  
4. Start the server:  
   npm run dev

### **Frontend Setup**

1. Navigate to the frontend directory:  
   cd frontend

2. Install dependencies:  
   npm install

3. Start the development server:  
   npm run dev

## **Deployment**

### **Backend (Render)**

1. Create a new **Web Service** on Render and connect your GitHub repository.  
2. Set the **Root Directory** to backend.  
3. Set the **Build Command** to npm install.  
4. Set the **Start Command** to node server.js.  
5. Add your Google credentials as **Environment Variables**.

### **Frontend (GitHub Pages)**

1. In frontend/vite.config.js, set the base property to your repository name (e.g., /hotel-booking-app/).  
2. In frontend/package.json, add a deploy script: "deploy": "gh-pages \-d dist".  
3. Run the build and deploy commands:  
   npm run build  
   npm run deploy  

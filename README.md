# DoorHinge

## Description

DoorHinge is a web application designed to connect users with their ideal properties. It allows
users to browse and filter through various property listings, enabling them to pass on or 
favorite the ones that catch their interest. The platform also facilitates communication between
users, making it a comprehensive tool for property seekers and listers alike.

## Status

🚧 **Work in Progress**: This project is currently under development. Features and documentation may be incomplete or subject to change.

## Libraries
- Flask
- React
- SQLAlchemy

## Installation
1. Git clone the repository
2. Create a new MySQL database called "project" and an administrator account.
3. Navigate to the backend/app folder and create a .env file, add the lines
```
SECRET_KEY=YOUR_SECRET_KEY_HERE
DATABASE_URI=mysql+pymysql://YOUR_ADMINISTRATOR_ACCOUNT_HERE:YOUR_PASSWORD_HERE@localhost/project
CLIENT_APPLICATION_TARGET=http://localhost:5173
```
3. Navigate to the frontend folder and create a .env file, add the lines
```
VITE_API_TARGET=http://127.0.0.1:5001/
VITE_SOCKET_API_TARGET=http://localhost:5001
```
4. Open a new terminal and navigate to the backend folder, run the commands
   ```
   python3 -m venv .venv
   source .venv/bin/activate
   pip install -r requirements.txt
   mkdir -p app/static/images
   python3 app.py
   ```
5. Open another terminal and navigate to the frontend folder, run the commands
   ```
   npm install
   npm run dev
   ```
The application should now be running.

## Features

- **User Accounts**: Users can create and log into their personal accounts.
- **Home Page**: Users can browse properties one by one, pass or favorite listings, and apply filters to tailor their search.
- **User Profiles**: Users can visit their profile to view and manage their basic information.
- **Listing Creation**: Users can create property listings for others to view.
- **Favorites**: Users can view all their favorited listings in one place, making it easy to return to properties they are interested in.
- **Messaging**: Users can chat with other users who favorite their listings or whose listings they have favorite, allowing the two users to negotiate a price for the property.
- **Moderator**: Moderators have access to a secure route where they can view all listings and have the option to delete any listing, ensuring the quality and reliability of the property listings on the platform

## Separation of Work
- **David Silva**:  Created welcome page, navbar, and image carousel display. Implemented create and read for listings and users. Created logic for displaying, passing and favoriting listings. Implemented property filters for home page. Created logout, protected the client-side and server-side routes. Implemented RBAC for the entire application. Handled code integrations into main branch, set up database schema and database migrations, added logic for uploading images.
- **Stephanie La Rosa**: Implemented client-side display for users’ favorite listings and added deletion functionality. Developed Moderator functionality that can view all user listings and delete any listing.
- **Aidan Collins**: Contributed to the client-side design of messaging, database schema, and implemented real-time chat functionality using Flask sockets.
- **Madeline Whitton**: Developed client-side for login, signup, and a goodbye page upon logout. Implemented server-side routes and update/delete for user profiles.
- **Omer Tuzun**: Started client-side design of messaging.

# DoorHinge

### Installation Instructions
- Download the project via GitHub's website or by typing `gh repo clone Daverhan/door-hinge-web-app` in a terminal at the desired directory.
- Install Python from [here](https://www.python.org/downloads/).
- Follow the instructions from [here](https://flask.palletsprojects.com/en/3.0.x/installation/) to install Flask.
  
#### Backend Installation
- To install all the requirements, run `pip install -r requirements.txt` whilst within the backend directory.
#### Frontend Installation
- Install necessary npm packages via `npm install` whilst within the frontend directory.

### To Launch:

- Launching the backend can be done with either running `python3 app.py`.
  - If you are experiencing issues with launching the backend, this may be due to how mySQL has been configured on your device, please update your mySQL's password policy to help resolve this issue or disable it entirely.
    - **WARNING: Disabling your mySQL's password policy is a security risk and should only be done within the scope of development.**
- Launching the frontend is done by running `npm run dev` whilst in the frontend directory.


### Upgrading Database

The database is upgraded with `flask db upgrade`.

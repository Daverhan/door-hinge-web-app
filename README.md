# DoorHinge

### To Launch:

- Launching the backend can be done with either running `python3 app.py` (preferred as it is more stable) or with `flask run` whilst in the backend directory.
  - If you are experiencing issues with launching the backend, this may be due to how mySQL has been configured on your device, please update your mySQL's password policy to help resolve this issue or disable it entirely.
    - **WARNING: Disabling your mySQL's password policy is a security risk and should only be done within the scope of development.**
- Launching the frontend is done by running `npm run dev` whilst in the frontend directory.


### Upgrading Database

The database is upgraded with `flask db upgrade`.

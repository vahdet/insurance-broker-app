# insurance-broker-app

A simple web application for managing and listing brokers of trustworthy agencies.

## Prerequisites

On the workstation the following should be installed:

- [SQLite 3](https://www.sqlite.org/download.html)

- [Python 3.7+](https://www.python.org/downloads/)

- [Node 6+](https://nodejs.org/en/)

- And, clone this repository: `git clone https://github.com/vahdet/insurance-broker-app.git` 🍾

## Create Database Tables and Load Initial Data

1. Open a command line/terminal in the **root folder of the repository** so that the SQLite is created right there:

   - Windows:

     ```ps1
     $ echo %cd%
     <path/to/this/repo/>
     ```

   - Linux/macOS

     ```sh
     $ pwd
     <path/to/this/repo/>
     ```

2. Run the following command to create a new SQLiteDB with its initial tables defined in [`data/ddl.sql`](data/ddl.sql):

   - Windows (assuming `sqlite3.exe` is located right after `C:\`), and beware of the forward slashes in quotation marks:

     ```ps1
     C:\sqlite3.exe COALITION.db ".read data/ddl.sql"
     ```

     - Linux/macOS:

     ```sh
     sqlite3 COALITION.db ".read data/ddl.sql"
     ```

     It will create a `COALITION.db` file (which is the database itself) in the root directory of the repo.

3. After that command is run, enter `sqlite3` shell:

   - Windows (again, assuming `sqlite3.exe` is located right after `C:\`)

     ```ps1
     $ C:\sqlite3.exe COALITION.db
     SQLite version 3.31.1 2020-01-27 19:55:54
     Enter ".help" for usage hints.
     $ sqlite>
     ```

   - Linux/macOS:

     ```sh
     $ sqlite3 COALITION.db
     SQLite version 3.31.1 2020-01-27 19:55:54
     Enter ".help" for usage hints.
     $ sqlite>
     ```

4. Load the data from the [`data/agency_domain_whitelist.csv`](data/agency_domain_whitelist.csv) and [`data/agency.csv`](data/agency.csv) files. They are nothing but the headerless versions of the original csv files:

   ```sh
   sqlite> PRAGMA foreign_keys = ON;
   sqlite> .mode csv
   sqlite> .import "data/agency_domain_whitelist.csv" agency_domain_whitelist
   sqlite> .import "data/agency.csv" agency
   ```

5. Quit the SQLite shell by the command:

   ```sh
   sqlite> .quit
   ```

## Running the Application

Again **ensuring current working directory is the root folder of the repository**, running the scripts below should run:

- Auth backend service

- App backend service

- Frontend

and then you can start using from your browser on default React endpoint: `http://localhost:3000`

### Windows

Running the `run.bat` file should launch three subshells and run all the apps launching them in new prompts:

```ps1
.\run.bat
```

> Even you use this script to run application resources, you still need to [Create Database Tables and Load Initial Data](#Create-Database-Tables-and-Load-Initial-Data) if you have not done up to this point.

However, in case there occurs problems with it; manual scripts can be run as follows:

- Terminal #1:

  ```bat
  cd .\api\auth
  py -3 -m venv venv
  .\venv\Scripts\activate
  (venv) pip install -r requirements.txt
  (venv) python app.py
  ```

- Terminal #2:

  ```bat
  cd .\api\app
  py -3 -m venv venv
  .\venv\Scripts\activate
  (venv) pip install -r requirements.txt
  (venv) python app.py
  ```

- Terminal #3:

  ```bat
  cd .\ui
  npm install
  npm start
  ```

### Linux/macOS

Running the `run.sh` script should launch three subshells and run all the apps in parallel:

```sh
. run.sh
```

> Even you use this script to run application resources, you still need to [Create Database Tables and Load Initial Data](#Create-Database-Tables-and-Load-Initial-Data) if you have not done up to this point.

However, in case there occurs problems with it; manual scripts can be run as follows:

- Terminal #1:

  ```sh
  cd api/auth
  python3 -m venv venv
  source venv/bin/activate
  (venv) pip install -r requirements.txt
  (venv) python app.py
  ```

- Terminal #2:

  ```sh
  cd api/app
  python3 -m venv venv
  source venv/bin/activate
  (venv) pip install -r requirements.txt
  (venv) python app.py
  ```

- Terminal #3:

  ```sh
  cd ui
  npm install && npm start
  ```

## Discussion

### Monorepo vs Polyrepo

Both approaches has [pros and cons](https://dl.acm.org/doi/pdf/10.1145/3328433.3328435) and, technically, neither displays a solid outhmatch. Here, I preferred conveying all frontend and backend components in a single repository as it is a basic application. Yet, I kept `.gitignore` files in subdirectories in order to make possible future separations smoother.

### Authentication Methodology (Postponed)

I had three options when planning my authentication flow:

1. **A simple domain-check function**: It could be a nice and precise approach. Especially if the function resides in the same project as the application. However, I did not want Authentication and Application logic on the same project as it would hinder modularity at very first level.

2. **JWT Tokens**: It is one of the most considerable methods for a real-world application, however it can be considered as overengineering since:

   - There is no password we would avoid sending over and over again.

   - The `refresh_token` implementation would bring extra overhead for the work. And without it, implementing a typical `access_token` expiration time (i.e. 10-15 mins) would impede the user experience for no apparent good.

3. **A less sophisticated token**: Wanting the separate concerns lie on different projects and thinking, at this level, JWT is too much; I decided using a dumber token logic as shown _Token Based Authentication_ section of Miguel Grinberg's blogpost [here](https://blog.miguelgrinberg.com/post/restful-authentication-with-flask).

## Code Base Privacy (Visibilty made public, no more valid)

Even if this repository is a private one and not available for distribution. In order to further guarantee the confidentiality, the owner states that no license is included intentionally so that it has [no public permission](https://choosealicense.com/no-permission/).

## References

- [The Issue of Monorepo and Polyrepo In Large Enterprises](https://dl.acm.org/doi/pdf/10.1145/3328433.3328435)

- [RESTful Authentication with Flask](https://blog.miguelgrinberg.com/post/restful-authentication-with-flask)

- [Import a CSV File Into an SQLite Table](https://www.sqlitetutorial.net/sqlite-import-csv/)

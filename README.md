# insurance-broker-app

A simple web application for managing and listing brokers of trustworthy agencies.

## Prerequisites

On the workstation the following should be installed:

- [SQLite 3](https://www.sqlite.org/download.html)

- [Python 3.7 +](https://www.python.org/downloads/)

- [Node 10 +](https://nodejs.org/en/)

## Running the application

### Install the dependencies

- Create a virtual environment named *venv* in the authenticaation project (backend) and install the dependencies:

  - Windows:

      ```ps1
      cd api\auth
      py -3 -m venv venv
      venv\Scripts\activate
      (venv) $ pip install -r requirements.txt
      (venv) $ deactivate
      cd ..\..
      ```

  - Linux/macOS:

      ```sh
      cd api/auth
      python3 -m venv venv
      source venv/bin/activate
      (venv) $ pip install -r requirements.txt
      (venv) $ deactivate
      cd ../..
      ```

- Create a virtual environment named *venv* in the application project (backend) and install the dependencies:

  - Windows:

      ```ps1
      cd api\app
      py -3 -m venv venv
      venv\Scripts\activate
      (venv) $ pip install -r requirements.txt
      (venv) $ deactivate
      cd ..\..
      ```

  - Linux/macOS:

      ```sh
      cd api/app
      python3 -m venv venv
      source venv/bin/activate
      (venv) $ pip install -r requirements.txt
      (venv) $ deactivate
      cd ../..
      ```

- Install `node_modules` for the frontend:

    ```sh
    cd ui
    npm i
    cd ..
    ```

### Create Database Tables and Load Initial Data

1. From the command line, run the following command to create a new SQLiteDB with its initial tables defined in [`data/ddl.sql`](data/ddl.sql):

    - Windows (assuming `sqlite3.exe` is located right after `C:\`), and beware of the forward slashes in quotation marks:

    ```ps1
    C:\sqlite3.exe VAHDET_KESKIN_COALITION.db ".read C:/<path/to/this/repo>/data/ddl.sql"
    ```

    - Linux/macOS:

    ```sh
    sqlite3 VAHDET_KESKIN_COALITION.db ".read <path/to/this/repo/>data/ddl.sql"
    ```

2. After that command is run, enter `sqlite3` shell:

    - Windows (again, assuming `sqlite3.exe` is located right after `C:\`)

    ```ps1
    $ C:\sqlite3.exe VAHDET_KESKIN_COALITION.db
    $ sqlite>
    ```

    - Linux/macOS:

    ```sh
    $ sqlite3 VAHDET_KESKIN_COALITION.db
    $ sqlite>
    ```

3. Now, we are in the `sqlite` shell. In here, convert to `csv` mode to load initial data in `agency_domain_whitelist` and `agency` tables.

    ```sh
    sqlite> .mode csv
    ```

4. Load the data from the [`data/agency_domain_whitelist.csv`](data/agency_domain_whitelist.csv) and [`data/agency.csv`](data/agency.csv) files. They are nothing but the headerless versions of the original csv files:

    ```sh
    sqlite> .import "<path/to/this/repo/>data/agency_domain_whitelist.csv" agency_domain_whitelist
    sqlite> .import "<path/to/this/repo/>data/agency.csv" agency
    ```

5. Quit the SQLite shell by the command:

    ```sh
    sqlite> .quit
    ```

### Locally running the apps

TBD

## Discussion

### Monorepo vs Polyrepo

Both approaches has [pros and cons](https://dl.acm.org/doi/pdf/10.1145/3328433.3328435) and, technically, neither displays a solid outhmatch. Here, I preferred conveying all frontend and backend components in a single repository as it is a basic application. Yet, I kept `.gitignore` files in subdirectories in order to make possible future separations smoother.

### Authentication Methodology

I had three options when planning my authentication flow:

1. **A simple domain-check function**: It could be a nice and precise approach. Especially if the function resides in the same project as the application. However, I did not want Authentication and Application logic on the same project as it would hinder modularity at very first level.

2. **JWT Tokens**: It is one of the most considerable methods for a real-world application, however it can be considered as overengineering since:

    - There is no password we would avoid sending over and over again.

    - The `refresh_token` implementation would bring extra overhead for the work. And without it, implementing a typical `access_token` expiration time (i.e. 10-15 mins) would impede the user experience for no apparent good.

3. **A less sophisticated token**: Wanting the separate concerns lie on different projects and thinking, at this level, JWT is too much; I decided using a dumber token logic as shown *Token Based Authentication* section of Miguel Grinberg's blogpost [here](https://blog.miguelgrinberg.com/post/restful-authentication-with-flask).

## Code Base Privacy

Even if this repository is a private one and not available for disttribution. In order to further guarantee the confidentiality, the owner states that no license is included intentionally so that it has [no public permission](https://choosealicense.com/no-permission/).

## References

- [The Issue of Monorepo and Polyrepo In Large Enterprises](https://dl.acm.org/doi/pdf/10.1145/3328433.3328435)

- [RESTful Authentication with Flask](https://blog.miguelgrinberg.com/post/restful-authentication-with-flask)

- [Import a CSV File Into an SQLite Table](https://www.sqlitetutorial.net/sqlite-import-csv/)

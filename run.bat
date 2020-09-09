@ECHO OFF
(
   start "Auth Service" cmd /C "cd .\api\auth & py -3 -m venv venv & .\venv\Scripts\activate & pip install -r requirements.txt & python app.py"
   start "App Service"  cmd /C "cd .\api\app & py -3 -m venv venv & .\venv\Scripts\activate & pip install -r requirements.txt & python app.py"
   start "UI"           cmd /C "cd .\ui & npm install & npm start"
) | pause
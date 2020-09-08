#!/bin/bash
(
    cd api/auth
    python3 -m venv venv
    source "venv/bin/activate"
    pip install -r requirements.txt
    python app.py
) &
(
    cd api/app
    python3 -m venv venv
    source "venv/bin/activate"
    pip install -r requirements.txt
    python app.py
) &
(
    cd ui
    npm install
    npm start
) &

#!/bin/bash
(
    cd api/auth
    python3 app.py
) &
(
    cd api/app
    python3 app.py
) &
(
    cd ui
    npm start
) &
#!/bin/bash
(
    source "api/auth/venv/bin/activate"
    python app.py
) &
(
    source "api/app/venv/bin/activate"
    python app.py
) &
(
    cd ui
    npm start
) &

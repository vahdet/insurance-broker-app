#!/bin/bash
(
    cd api/auth
    flask run
) &
(
    cd api/app
    flask run
) &
(
    cd ui
    npm start
) &
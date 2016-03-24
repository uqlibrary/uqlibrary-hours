#!/bin/bash

echo "Testing branch: ${CI_BRANCH} with pipe ${PIPE_NUM}"

if [ ${CI_BRANCH} != "GH_PAGES" ] && [ ${PIPE_NUM} == 1 ]; then
    # Run local tests
    echo "Installing global"
    npm install -g bower web-component-tester

    echo "Installing bower dependencies"
    bower install

    echo "Starting local WCT tests"
    wct
else
    echo "Pipe not used."
fi
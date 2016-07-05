#!/bin/bash

echo "Testing branch: ${CI_BRANCH} with pipe ${PIPE_NUM}"

# no testing for gh-pages - documentation branch
if [ ${CI_BRANCH} != "GH_PAGES" ]; then
    # Run local tests
    echo "Installing global"
    npm install -g bower web-component-tester@4.2.2

    echo "Installing bower dependencies"
    bower install

    echo "Starting local WCT tests"
    wct
else
    echo "Pipe not used."
fi
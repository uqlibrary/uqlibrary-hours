#!/bin/bash

echo "Deploying branch: ${CI_BRANCH}"

# REDO WHEN POLYMER 1.0 GOES LIVE

# If polymer 1.0
if [ ${CI_BRANCH} == "polymer1.0" ]; then

    if [ ${PIPE_NUM} == 1 ]; then
        # Run local tests
        echo "Installing test dependencies"
        npm install web-component-tester -g
        echo "Bower Install"
        bower install
        echo "Running tests"
        wct
    else
        echo "Pipe not used"
    fi
else
    # make sure wct-sauce plugin works with old version of wct
    npm install -g web-component-tester@v3.1.7
    npm install -g wct-sauce@1.6.0
    export NPM_ROOT=$(npm root -g)
    cp -r $NPM_ROOT/wct-sauce $NPM_ROOT/web-component-tester/node_modules
    git clone -b ${CI_BRANCH} --single-branch https://github.com/uqlibrary/uqlibrary-elements ../uqlibrary-elements
    chmod 755 ../uqlibrary-elements/bin/*.sh

    cd ../uqlibrary-elements
    ./bin/elements_local_tests.sh
    cd ../uqlibrary-hours
    ../uqlibrary-elements/bin/sauce.sh
fi
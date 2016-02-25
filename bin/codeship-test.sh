#!/bin/bash

# If polymer 1.0
if [ ${CI_BRANCH} == "polymer1.0" ]; then
    # Run local tests
    npm install web-component-tester
    wct
else
    # make sure wct-sauce plugin works with old version of wct
    npm install -g web-component-tester@v3.1.7
    npm install -g wct-sauce@1.6.0
    export NPM_ROOT=$(npm root -g)
    cp -r $NPM_ROOT/wct-sauce $NPM_ROOT/web-component-tester/node_modules
    git clone -b ${CI_BRANCH} --single-branch https://github.com/uqlibrary/uqlibrary-elements ../uqlibrary-elements
    chmod 755 ../uqlibrary-elements/bin/*.sh
fi
#!/bin/bash

echo "Deploying branch: ${CI_BRANCH}"

# REDO WHEN POLYMER 1.0 GOES LIVE
npm install -g web-component-tester
echo "NPM Installed"
bower install
echo "Running tests"
wct --verbose
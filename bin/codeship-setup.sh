#!/bin/bash

# start debugging/tracing commands, -e - exit if command returns error (non-zero status)
set -e

echo "Check Java version is set to Java8"
# can't run jdk_switcher in script
# jdk_switcher use oraclejdk8

version=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}')
echo version "$version"
if [[ "$version" < "1.8" ]]; then
  echo "Java version is too old, min Java8 is required"
  return 1
fi

printf "Node "; node -v;
printf "(Before npm i -g) npm v"; npm -v

echo "Install dependencies"
npm install -g bower web-component-tester polymer-cli npm@6
npm install
bower install

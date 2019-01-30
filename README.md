# uqlibrary-hours

[![Codeship Status for uqlibrary/uqlibrary-hours](https://app.codeship.com/projects/68f81e60-8502-0132-ea60-52ba9424c583/status?branch=polymer1.0)](https://codeship.com/projects/58586)
[![Dependency Status](https://david-dm.org/uqlibrary/uqlibrary-hours.svg)](https://david-dm.org/uqlibrary/uqlibrary-hours)
[![Dev Dependency Status](https://david-dm.org/uqlibrary/uqlibrary-hours/dev-status.svg)](https://david-dm.org/uqlibrary/uqlibrary-hours?type=dev)

uqlibrary-hours displays academic hours to the end user

Full documentation and demo can be found in [GitHub Pages](https://uqlibrary.github.io/uqlibrary-hours/uqlibrary-hours/).

## Getting Started

```sh
npm install -g bower web-component-tester polymer-cli
npm install
bower install
```

## Developing

- Please adhere to the Polymer code style guide provided at [Style Guide](http://polymerelements.github.io/style-guide/).
- Colors and common styles are imported (bower install) from [uqlibrary-styles](http://github.com/uqlibrary/uqlibrary-styles).
- A preview of the component can be viewed locally by running `npm start`. Use the second URL from the command output.
- GitHub pages should be updated after every commit to `polymer1.0` branch by running `bin/generate-gh-pages.sh`

## Testing

Tests are run using the Web Component Tester.

```sh
npm test
```

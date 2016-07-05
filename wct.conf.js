var path = require('path');

var ret = {
  'suites': ['test'],
  'webserver': {
    'pathMappings': []
  },
  plugins: {
    local: {
      browsers: [
        'firefox',
        'chrome'
      ]
    }
  }
};

module.exports = ret;

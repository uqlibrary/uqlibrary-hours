(function () {
  Polymer({
    is: 'uqlibrary-hours',
    properties: {
      /** Opening hours of all libraries in JSON format */
      hours: {
        type: Array,
        observer: "_hoursChanged"
      },
      /**
       * Autoloads the library opening hours from the API
       * @type {Boolean}
       */
      autoLoad: {
        type: Object,
        value: true
      },
      /**
       * Renders the element in compact view
       * @type {Boolean}
       */
      compactView: {
        type: Object,
        value: false
      },
      /**
       * Prefix for the google analytics category name. For example: "Home page"
       */
      gaCategoryPrefix: {
        type: String,
        value: '',
        observer: '_gaCategoryPrefixChanged'
      },
      /**
       * Holds the Google Analytics app name of this component
       */
      _gaAppName: {
        type: String,
        value: ''
      },
      /**
       * Required. Whether the app should start in standalone mode or not.
       * @type Boolean
       */
      standAlone: {
        type: Object,
        value: true
      }
    },
    ready: function () {
      var self = this;

      // Setup event listener for Hours
      this.$.hoursApi.addEventListener('uqlibrary-api-library-hours', function (e) {
        self.setHours(e.detail);
      });

      // Fetch hours
      if (this.autoLoad) {
        this.$.hoursApi.get();
      }
    },
    /**
     * Sorts and sets the "hours" variable
     * @param hours
     */
    setHours: function (hours) {
      this.hours = _.sortBy(hours, (this.compactView ? "abbr" : "name"));
    },
    /** Redirects the user to the selected Library page */
    _itemTapHandler: function (e) {
      this.$.ga.addEvent('Click', e.model.item.name);
      window.location = e.model.item.url;
    },
    /** Adds GA event */
    _viewHoursClicked: function (e) {
      this.$.ga.addEvent('Click', 'View all hours');
    },
    /** Parses and formats the JSON array when hours has updated */
    _hoursChanged: function () {
      var self = this;

      var dayString = moment().format("YYYY-MM-DD");
      var _open, _close, _diff;
      _.forEach(self.hours, function (item) {
        _open = moment(dayString + ' ' + item.open);
        _close = moment(dayString + ' ' + item.close);
        _diff = _close.diff(_open, 'hours');

        item.allDay = false;

        // Fix formatting of the library name
        item.name = item.name.replace(/&amp;/g, '&').replace(/&ndash;/g, '-');

        // Format the opening text
        if (_diff == 24) {
          item.times = "open 24 hours";
          item.class = "all-day";
          item.allDay = true;
        } else if (_diff == 0) {
          item.times = "Closed";
          item.class = "closed";
        } else {
          item.times = _open.format("h:mm a") + ' - ' + _close.format("h:mm a");
          item.class = ((_open.isBefore(moment()) && _close.isAfter(moment())) ? 'open' : 'closed');
        }

        // Fix formatting of notes
        if (item.notes) {
          item.notes = item.notes.replace(/&amp;/g, '&').replace(/&ndash;/g, '-');
        }
      });

      this.fire('uqlibrary-hours-loaded');
    },
    /**
     * Sets the Google Analytics app name
     * @private
     */
    _gaCategoryPrefixChanged: function () {
      this._gaAppName = (this.gaCategoryPrefix ? this.gaCategoryPrefix + ' Hours' : 'Hours');
    },
    /**
     * Toggles the drawer panel of the main UQL app
     * @private
     */
    _toggleDrawerPanel: function () {
      this.fire('uqlibrary-toggle-drawer');
    }
  });
})();
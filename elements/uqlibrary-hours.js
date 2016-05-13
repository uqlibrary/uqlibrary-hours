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
      },
      /**
       * Header title - application name
       */
      headerTitle: {
        type: String,
        value: "Hours"
      }
    },
    ready: function () {
      // Fetch hours
      if (this.autoLoad) {
        this.$.hoursApi.get();
      }
    },
    // Setup event listener for Hours
    hoursLoaded: function (e) {
      this.setHours(e.detail);
    },
    /**
     * Sorts and sets the "hours" variable
     * @param hours
     */
    setHours: function (hours) {
      this.hours = _.sortBy(hours, (this.compactView ? "abbr" : "name"));
    },
    /**
     * Checks the string for 24 x 7
     *
     * @param {String} notes
     */
    _has24x7: function (notes) {
      var regex = /24\s*[xX]\s*7/;
      return regex.test(notes);
    },
    /**
     * Checks the notes string for "Info:"
     * @param notes
     * @returns {boolean}
     * @private
     */
    _hasInfo: function (notes) {
      var regex = /Info:/;
      return regex.test(notes);
    },
    /** Redirects the user to the selected Library page */
    _itemTapHandler: function (e) {
      this.$.ga.addEvent('Click', e.model.item.name);
      window.open(e.model.item.url, '_blank');
    },
    /** Adds GA event */
    _viewHoursClicked: function (e) {
      this.$.ga.addEvent('Click', 'View all hours');
      window.open('https://www.library.uq.edu.au/hours/', '_blank');
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

        item.hasInfo = self._hasInfo(item.notes);

        // Format the opening text
        if (_diff == 24) {
          item.times = "open 24 hours";
          item.class = "all-day";
          item.allDay = false;
        }
        else if (_diff == 0) {
          item.times = "Closed";
          item.class = "closed";
        }
        else {
          item.times = _open.format("h:mm a") + ' - ' + _close.format("h:mm a");
          item.class = ((_open.isBefore(moment()) && _close.isAfter(moment())) ? 'open' : 'closed');

          if (self._has24x7(item.notes)) {
            item.allDay = true;
            item.class = "part-all-day";
          }
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
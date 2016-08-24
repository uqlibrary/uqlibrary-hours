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
        value: 'Hours'
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
     * Filter out libraries with no departments, sorts by name/abbr and sets the "hours" variable
     * @param hours
     */
    setHours: function (hours) {
      hours.locations.forEach( function(lib, index, obj) {
        if (!lib.departments) {
          obj.splice(index, 1);
          return;
        }
        if (!lib.abbr) {
          lib.abbr = lib.name.substring(0,15); //15 chars
        }
      });

     // this.hours = hours.locations.filter(function(lib){return lib.departments});
      this.hours = _.sortBy(hours.locations, (this.compactView ? 'abbr' : 'name'));
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
      window.location.href = e.model.item.url;
    },
    /** Adds GA event */
    _viewHoursClicked: function (e) {
      this.$.ga.addEvent('Click', 'View all hours');
      window.location.href = 'https://www.library.uq.edu.au/hours/';
    },
    /** Parses and formats the JSON array when hours has updated */
    _hoursChanged: function () {
      var self = this;

      this.hours.forEach(function (item) {
        var department = item.departments[0],
            status = department.times.status,
            dayString = moment().format("YYYY-MM-DD"),
            _open, _close;

        item.allDay = false;

        // Fix formatting of the library name and foot notes
        item.name = item.name.replace(/&amp;/g, '&').replace(/&ndash;/g, '-');
        item.fn = item.fn.replace(/&amp;/g, '&').replace(/&ndash;/g, '-');

        item.hasInfo = self._hasInfo(item.fn);

        if (status === 'closed') {

          item.times = "Closed";
          item.class = "closed";

        } else if(status === '24hours') {

          item.times  = "open 24 hours";
          item.class  = "all-day";

        } else {

          _open  = moment(dayString + ' ' + department.open);
          _close = moment(dayString + ' ' + department.close);
          // Format the opening text
          item.times = _open.format('h:mm a') + ' - ' + _close.format('h:mm a');
          item.class = department.times.currently_open ? 'open' : 'closed';

          if (self._has24x7(item.fn)) {
            item.allDay = true;
            item.class  = "part-all-day";
          }
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
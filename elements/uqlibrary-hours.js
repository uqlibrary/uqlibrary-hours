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
     * Check for other departments open 24 hours
     *
     * @param {array} departments
     */
    _has24x7: function (departments) {
      if (departments.length === 1) {
        return false;
      }

      //check for 24 hours study area
      for(var i = 1; i < departments.length; i++){
        if (departments[i].times.status === '24hours') {
          return true;
        }
      }
      return false;
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

        // Strip special characters from library name and foot notes
          item.name = self._stripStr(item.name);
          item.fn = self._stripStr(item.fn);

        // If the footnote does not contain "Info:", then hide the footnote info icon
        if (item.fn.indexOf('Info:')) {
          item.fn = false;
        }

        if (status === 'closed') {

          item.times = "Closed";
          item.class = "closed";

        } else if(status === '24hours') {

          item.times  = "Open 24 hours";
          item.class  = "all-day";

        } else {

          _open  = moment(dayString + ' ' + department.open);
          _close = moment(dayString + ' ' + department.close);
          // Format the opening text
          item.times = department.rendered; //_open.format('h:mm a') + ' - ' + _close.format('h:mm a');
          item.class = department.times.currently_open ? 'open' : 'closed';

          if (self._has24x7(item.departments)) {
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
    },
    /**
     * Strip special characters from the string
     * @private
     * @param str
     */
    _stripStr: function(str) {
      str = str.replace(/<\/?[^>]+(>|$)/g, '').replace(/\\r?\\n|\\r|\\t|\r?\n|\r|\t/g,' '); //html tags, breaklines and tabs
      var elem = document.createElement('textarea'); //decode &amps;, &#39;,&ndash; etc.
      elem.innerHTML = str;
      return elem.value.replace(/[`~!@#$%^*|+=?;'"\{\}\[\]\\\/]/g, ''); //special characters
    }
  });
})();
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
            }
        },
        ready: function() {
            var self = this;

            // Setup event listener for accounts
            this.$.account.addEventListener('uqlibrary-api-account-loaded', function(e) {
                if (e.detail.hasSession) {
                    if(e.detail.classes) {
                        self.user = e.detail;
                    }
                }
            });

            // Setup event listener for Hours
            this.$.hoursApi.addEventListener('uqlibrary-api-library-hours', function(e) {
                self.hours = e.detail;
            });

            // Fetch hours
            if (this.autoLoad) {
                this.$.hoursApi.get();
            }
        },
        /** Redirects the user to the selected Library page */
        _itemTapHandler: function(e) {
            this.$.ga.addEvent('Library details click', e.model.item.name);
            window.location = e.model.item.url;
        },
        /** Adds GA event */
        _viewHoursClicked: function() {
            this.$.ga.addEvent('Week hours button clicked');
        },
        /** Parses and formats the JSON array when hours has updated */
        _hoursChanged: function() {
            var self = this;

            var dayString = moment().format("YYYY-MM-DD");
            var _open, _close, _diff;
            _.forEach(self.hours, function (item) {
                _open = moment(dayString + ' ' + item.open);
                _close = moment(dayString + ' ' + item.close);
                _diff = _close.diff(_open, 'hours');

                item.allDay = false;

                // Format the opening text
                if (_diff == 24) {
                    item.times = "Open 24 hours";
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

            // Force iron-list to resize
            this.$.list.fire("iron-resize");

            this.fire('uqlibrary-hours-loaded');
        }
    });
})();
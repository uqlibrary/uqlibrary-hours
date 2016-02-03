(function () {
    Polymer({
        is: 'uqlibrary-hours',
        properties: {
            hours: {
                type: Array,
                observer: "hoursChanged"
            },
            autoload: {
                type: Object, // Needs to be object so the string 'false' can be serialized
                value: true
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
            if (this.autoload) {
                this.$.hoursApi.get();
            }
        },
        itemTapHandler: function(e) {
            this.$.ga.addEvent('Library details click', e.model.item.name);
            window.location = e.model.item.url;
        },
        // Determines whether a library is open and formats the notes
        hoursChanged: function() {
            var self = this;

            var dayString = moment().format("YYYY-MM-DD");
            var _open, _close, _diff;
            _.forEach(self.hours, function (item) {
                _open = moment(dayString + ' ' + item.open);
                _close = moment(dayString + ' ' + item.close);
                _diff = _close.diff(_open, 'hours');

                // Format the opening text
                if (_diff == 24) {
                    item.times = "Open 24 hours";
                    item.class = "open";
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
        }
    });
})();
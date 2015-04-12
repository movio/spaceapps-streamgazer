"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*jshint esnext: true */

var StreamGazer = (function () {
    function StreamGazer() {
        _classCallCheck(this, StreamGazer);

        this.createMap();
        this.createTimeline();
    }

    _createClass(StreamGazer, {
        createTimeline: {
            value: function createTimeline() {
                var _this = this;

                this.timeline = {};

                this.timeline.minYear = 2009;
                this.timeline.minDate = new Date(this.timeline.minYear, 1);
                this.timeline.maxYear = 2015;
                this.timeline.yearWidth = 62;
                this.timeline.monthWidth = 92;
                this.timeline.dayWidth = 36;

                this.timeline.years = (function () {
                    var _timeline$years = [];
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = Array(_this.timeline.maxYear - _this.timeline.minYear).fill(0).map(function (v, i) {
                            return new Date(_this.timeline.minYear + i, 1);
                        })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var j = _step.value;

                            _timeline$years.push(j);
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator["return"]) {
                                _iterator["return"]();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    return _timeline$years;
                })();

                this.timeline.months = _.reduce(this.timeline.years, function (memo, year) {
                    return memo.concat((function () {
                        var _memo$concat = [];
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = Array(12).fill(0).map(function (v, i) {
                                return new Date(year.getFullYear(), i + 1);
                            })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var j = _step.value;

                                _memo$concat.push(j);
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator["return"]) {
                                    _iterator["return"]();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        return _memo$concat;
                    })());
                }, []);

                this.timeline.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                this.timeline.days = _.reduce(this.timeline.months, function (memo, month) {
                    return memo.concat((function () {
                        var _memo$concat = [];
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = Array(new Date(month.getFullYear(), month.getMonth(), 0).getDate()).fill(0).map(function (v, i) {
                                return new Date(month.getFullYear(), month.getMonth() + 1, i + 1);
                            })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var j = _step.value;

                                _memo$concat.push(j);
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator["return"]) {
                                    _iterator["return"]();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }

                        return _memo$concat;
                    })());
                }, []);

                // this.timeline.yearsScale = d3.time.scale()
                //     .domain([new Date(this.timeline.minYear, 1), new Date(this.timeline.maxYear, 12), 1])
                //     .range(0, 62 * this.timeline.years.length);

                // this.timeline.monthsScale = d3.time.scale()
                //     .domain([new Date(this.timeline.minYear, 1), new Date(this.timeline.maxYear, 12), 1])
                //     .range(0, 92 * this.timeline.months.length);

                // this.timeline.daysScale = d3.time.scale()
                //     .domain([new Date(this.timeline.minYear, 1), new Date(this.timeline.maxYear, 12), 1])
                //     .range(0, 36 * this.timeline.days.length);

                this.timeline.scrubbers = d3.select("body").append("div").classed("scrubbers", true);

                this.timeline.scrubbers.append("div").classed("scrubSpacer", true);

                this.timeline.yearScrubber = this.timeline.scrubbers.append("div").classed("scrubber", true);

                this.timeline.yearScrubber.selectAll("div").data(this.timeline.years).enter().append("div").classed("year", true).text(function (year) {
                    return year.getFullYear();
                }).on("click", function (year) {
                    return _this.setTimelineDate(year);
                });

                this.timeline.scrubbers.append("div").classed("scrubSpacer", true);

                this.timeline.monthScrubber = this.timeline.scrubbers.append("div").classed("scrubber", true);

                this.timeline.monthScrubber.selectAll("div").data(this.timeline.months).enter().append("div").classed("month", true).text(function (month) {
                    return _this.timeline.monthNames[month.getMonth()];
                }).on("click", function (month) {
                    return _this.setTimelineDate(month);
                });

                this.timeline.scrubbers.append("div").classed("scrubSpacer", true);

                this.timeline.dayScrubber = this.timeline.scrubbers.append("div").classed("scrubber", true).style("width", "" + this.timeline.days.length * this.timeline.dayWidth + "px");

                this.timeline.dayScrubber.selectAll("div").data(this.timeline.days).enter().append("div").classed("day", true).text(function (day) {
                    return day.getDate() + 1;
                }).on("click", function (day) {
                    return _this.setTimelineDate(day);
                });

                this.timeline.scrubbers.append("div").classed("scrubSpacer", true);

                this.setTimelineDate(new Date(2011, 4, 12));

                d3.select(".playButton").on("click", function () {
                    setInterval(function () {
                        var currentDate = _this.timeline.currentDate;
                        _this.setTimelineDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));
                    }, 1000);
                });
            }
        },
        getDayDiff: {
            value: function getDayDiff(date1, date2) {
                return Math.floor((date2 - date1) / 86400000);
            }
        },
        getMonthDiff: {
            value: function getMonthDiff(fromDate, toDate) {
                return toDate.getMonth() - fromDate.getMonth() + 12 * (toDate.getFullYear() - fromDate.getFullYear());
            }
        },
        setTimelineDate: {
            value: function setTimelineDate(date) {
                console.log(date);
                this.timeline.currentDate = date;
                this.setTimelineDay(date);
                this.setTimelineMonth(date);
                this.setTimelineYear(date);
            }
        },
        setTimelineDay: {
            value: function setTimelineDay(date) {
                var offset = document.body.clientWidth / 2 - this.getDayDiff(this.timeline.minDate, date) * this.timeline.dayWidth + this.timeline.dayWidth / 2;
                this.timeline.dayScrubber.style("left", "" + offset + "px");
            }
        },
        setTimelineMonth: {
            value: function setTimelineMonth(date) {
                var offset = document.body.clientWidth / 2 - this.getMonthDiff(this.timeline.minDate, date) * this.timeline.monthWidth + this.timeline.monthWidth / 2;
                this.timeline.monthScrubber.style("left", "" + offset + "px");
            }
        },
        setTimelineYear: {
            value: function setTimelineYear(date) {
                var offset = document.body.clientWidth / 2 - this.getDayDiff(this.timeline.minDate, date) / 365 * this.timeline.yearWidth;
                this.timeline.yearScrubber.style("left", "" + offset + "px");
            }
        },
        createMap: {
            value: function createMap() {
                var map = L.map("map").setView([37.09024, -95.712891], 5);

                // Disable drag and zoom handlers.
                map.dragging.disable();
                map.touchZoom.disable();
                map.doubleClickZoom.disable();
                map.scrollWheelZoom.disable();

                // Disable tap handler, if present.
                if (map.tap) map.tap.disable();

                L.tileLayer("http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
                    attribution: "Map data &copy; [...]",
                    zoomControl: false
                }).addTo(map);

                var svg = d3.select(map.getPanes().overlayPane).append("svg"),
                    g = svg.append("g").attr("class", "leaflet-zoom-hide");

                var latLngBounds = map.getBounds();

                d3.json("/api/search?name=Velocity&year=2015&w=" + latLngBounds.getWest() + "&s=" + latLngBounds.getSouth() + "&e=" + latLngBounds.getEast() + "&n=" + latLngBounds.getNorth(), function (collection) {
                    var transform = d3.geo.transform({ point: projectPoint }),
                        path = d3.geo.path().projection(transform);

                    var feature = g.selectAll("path").data(collection.features).enter().append("path");

                    map.on("viewreset", reset);
                    reset();

                    // Reposition the SVG to cover the features.
                    function reset() {
                        var bounds = path.bounds(collection),
                            topLeft = bounds[0],
                            bottomRight = bounds[1];

                        svg.attr("width", bottomRight[0] - topLeft[0]).attr("height", bottomRight[1] - topLeft[1]).style("left", topLeft[0] + "px").style("top", topLeft[1] + "px");

                        g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

                        feature.attr("d", path);
                    }

                    // Use Leaflet to implement a D3 geometric transformation.
                    function projectPoint(x, y) {
                        var point = map.latLngToLayerPoint(new L.LatLng(y, x));
                        this.stream.point(point.x, point.y);
                    }
                });
            }
        }
    });

    return StreamGazer;
})();

new StreamGazer();

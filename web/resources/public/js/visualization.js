/*jshint esnext: true */

"use strict";

var years = (function () {
    var _years = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Array(7).fill(0).map(function (v, i) {
            return new Date(2009 + i, 1);
        })[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var j = _step.value;

            _years.push(j);
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

    return _years;
})();

var months = _.reduce(years, function (memo, year) {
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

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var days = _.reduce(months, function (memo, month) {
    return memo.concat((function () {
        var _memo$concat = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = Array(new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()).fill(0).map(function (v, i) {
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

var scale = d3.time.scale().domain([new Date(2009, 1), new Date(2016, 12)]);

var scrubbers = d3.select("body").append("div").classed("scrubbers", true);

scrubbers.append("div").classed("scrubSpacer", true);

var yearScrubber = scrubbers.append("div").classed("scrubber", true);

yearScrubber.selectAll("div").data(years).enter().append("div").classed("year", true).text(function (year) {
    return year.getFullYear();
});

scrubbers.append("div").classed("scrubSpacer", true);

var monthScrubber = scrubbers.append("div").classed("scrubber", true);

monthScrubber.selectAll("div").data(months).enter().append("div").classed("month", true).text(function (month) {
    return monthNames[month.getMonth()];
});

scrubbers.append("div").classed("scrubSpacer", true);

var dayScrubber = scrubbers.append("div").classed("scrubber", true);

dayScrubber.selectAll("div").data(days).enter().append("div").classed("day", true).text(function (day) {
    return day.getDate() + 1;
});

scrubbers.append("div").classed("scrubSpacer", true);

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
    maxZoom: 13
}).addTo(map);

var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

var latLngBounds = map.getBounds();

console.log("West: ", latLngBounds.getWest());
console.log("South: ", latLngBounds.getSouth());
console.log("East: ", latLngBounds.getEast());
console.log("North: ", latLngBounds.getNorth());

d3.json("/api/search?name=Depth&year=2015&w=" + latLngBounds.getWest() + "&s=" + latLngBounds.getSouth() + "&e=" + latLngBounds.getEast() + "&n=" + latLngBounds.getNorth(), function (collection) {
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

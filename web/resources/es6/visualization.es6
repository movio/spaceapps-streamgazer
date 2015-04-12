/*jshint esnext: true */

class StreamGazer {
    constructor() {
        this.createMap();
        this.createTimeline();
    }

    createTimeline() {
        this.timeline = {};

        this.timeline.minYear = 2009;
        this.timeline.minDate = new Date(this.timeline.minYear, 1);
        this.timeline.maxYear = 2015;
        this.timeline.yearWidth = 62;
        this.timeline.monthWidth = 92;
        this.timeline.dayWidth = 36;

        this.timeline.years = [for (j of Array(this.timeline.maxYear - this.timeline.minYear).fill(0).map((v,i) => new Date(this.timeline.minYear + i, 1) )) j];

        this.timeline.months = _.reduce(this.timeline.years, (memo, year) => {
            return memo.concat([for (j of Array(12).fill(0).map((v,i) => new Date(year.getFullYear(), i + 1 ) )) j]);
        }, []);

        this.timeline.monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        this.timeline.days = _.reduce(this.timeline.months, (memo, month) => {
            return memo.concat([for (j of Array(new Date(month.getFullYear(), month.getMonth(), 0).getDate()).fill(0).map((v,i) => new Date(month.getFullYear(), month.getMonth() + 1, i + 1) )) j]);
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

        this.timeline.scrubbers = d3
            .select('body')
            .append('div')
            .classed('scrubbers', true);

        this.timeline.scrubbers
            .append('div')
            .classed('scrubSpacer', true);

        this.timeline.yearScrubber = this.timeline.scrubbers
            .append('div')
            .classed('scrubber', true);

        this.timeline.yearScrubber
            .selectAll('div')
            .data(this.timeline.years)
            .enter()
            .append('div')
            .classed('year', true)
            .text(year => year.getFullYear())
            .on('click', year => this.setTimelineDate(year));

        this.timeline.scrubbers
            .append('div')
            .classed('scrubSpacer', true);

        this.timeline.monthScrubber = this.timeline.scrubbers
            .append('div')
            .classed('scrubber', true);    

        this.timeline.monthScrubber
            .selectAll('div')
            .data(this.timeline.months)
            .enter()
            .append('div')
            .classed('month', true)
            .text(month => this.timeline.monthNames[month.getMonth()])
            .on('click', month => this.setTimelineDate(month));

        this.timeline.scrubbers
            .append('div')
            .classed('scrubSpacer', true);

        this.timeline.dayScrubber = this.timeline.scrubbers
            .append('div')
            .classed('scrubber', true)
            .style('width', `${this.timeline.days.length * this.timeline.dayWidth}px`);

        this.timeline.dayScrubber
            .selectAll('div')
            .data(this.timeline.days)
            .enter()
            .append('div')
            .classed('day', true)
            .text(day => day.getDate() + 1)
            .on('click', day => this.setTimelineDate(day));

        this.timeline.scrubbers
            .append('div')
            .classed('scrubSpacer', true);

        this.setTimelineDate(new Date(2011, 4, 12));            

        d3.select('.playButton')
            .on('click', () => {
                setInterval(() => {
                    var currentDate = this.timeline.currentDate;
                    this.setTimelineDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1));
                }, 1000);
            });

    }

    getDayDiff(date1, date2) {
        return Math.floor((date2 - date1) / 86400000);
    }

    getMonthDiff(fromDate, toDate) {
        return toDate.getMonth() - 
            fromDate.getMonth() + 
            (12 * (toDate.getFullYear() - fromDate.getFullYear()));        
    }

    setTimelineDate(date) {
        console.log(date);
        this.timeline.currentDate = date;
        this.setTimelineDay(date);
        this.setTimelineMonth(date);
        this.setTimelineYear(date);
    }

    setTimelineDay(date) {
        var offset = (document.body.clientWidth / 2) - (this.getDayDiff(this.timeline.minDate, date) * this.timeline.dayWidth) + (this.timeline.dayWidth / 2);
        this.timeline.dayScrubber.style('left', `${offset}px`);
    }

    setTimelineMonth(date) {
        var offset = (document.body.clientWidth / 2) - (this.getMonthDiff(this.timeline.minDate, date) * this.timeline.monthWidth) + (this.timeline.monthWidth / 2);
        this.timeline.monthScrubber.style('left', `${offset}px`);
    }

    setTimelineYear(date) {
        var offset = (document.body.clientWidth / 2) - (this.getDayDiff(this.timeline.minDate, date) / 365 * this.timeline.yearWidth);
        this.timeline.yearScrubber.style('left', `${offset}px`);
    }

    createMap() {
         var map = L.map('map').setView([37.09024, -95.712891], 5);

        // Disable drag and zoom handlers.
        map.dragging.disable();
        map.touchZoom.disable();
        map.doubleClickZoom.disable();
        map.scrollWheelZoom.disable();

        // Disable tap handler, if present.
        if (map.tap) map.tap.disable();

        L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; [...]',
            zoomControl: false
        }).addTo(map);

        var svg = d3.select(map.getPanes().overlayPane).append("svg"),
            g = svg.append("g").attr("class", "leaflet-zoom-hide");

        var latLngBounds = map.getBounds();


        d3.json(`/api/search?name=Velocity&year=2015&w=${latLngBounds.getWest()}&s=${latLngBounds.getSouth()}&e=${latLngBounds.getEast()}&n=${latLngBounds.getNorth()}`, function(collection) {
            var transform = d3.geo.transform({point: projectPoint}),
                path = d3.geo.path().projection(transform);

            var feature = g.selectAll("path")
                .data(collection.features)
                .enter().append("path");

            map.on("viewreset", reset);
            reset();

            // Reposition the SVG to cover the features.
            function reset() {
                var bounds = path.bounds(collection),
                    topLeft = bounds[0],
                    bottomRight = bounds[1];

                svg.attr("width", bottomRight[0] - topLeft[0])
                    .attr("height", bottomRight[1] - topLeft[1])
                    .style("left", topLeft[0] + "px")
                    .style("top", topLeft[1] + "px");

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



new StreamGazer();









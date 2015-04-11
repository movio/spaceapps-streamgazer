
var map = L.map('map').setView([37.09024, -95.712891], 5);

L.tileLayer('http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; [...]',
    maxZoom: 7
}).addTo(map);
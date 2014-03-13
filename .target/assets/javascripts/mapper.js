/**
 * This file is located under app/assets, so it is compiled
 * by Google Closure Compiler
 * see https://github.com/playframework/Play20/wiki/AssetsGoogleClosureCompiler
 * 
 */

function addKMLLayer(aMap, aKMLPath, display) {
	var layer = new OpenLayers.Layer.Vector(aKMLPath, {
        strategies: [new OpenLayers.Strategy.Fixed()],
        protocol: new OpenLayers.Protocol.HTTP({
            url: "/assets/kml/" + aKMLPath,
            format: new OpenLayers.Format.KML({
                extractAttributes: true,
                extractStyles: true,
                maxDepth: 2
            })
        }),
        transitionEffect: 'resize',
        visibility: display
    });

	aMap.addLayer(layer);

	return layer;
}

function addLayers(aMap) {
	var gsat = new OpenLayers.Layer.Google(
	        "Google Satellite",
	        {type: google.maps.MapTypeId.SATELLITE}
	    );
	aMap.addLayer(gsat);
    
    var markers = new OpenLayers.Layer.Markers( "Markers" );
    markers.id = "Markers";
    aMap.addLayer(markers);
    
    //addKMLLayer(map, "trauma_grey.kml");
    addKMLLayer(aMap, "difference_int3.kml", true);
    addKMLLayer(aMap, "trauma_int5_existing.kml", false);
    addKMLLayer(aMap, "trauma_int5_potential.kml", false);

}

function getLayerName(value) {
	if (value == "difference_int3.kml") { return "Difference - 2 Min Intervals"; }
	else if (value == "trauma_int5_existing.kml") { return "Existing Map - 5 Min Intervals > 10"; }
	else if (value == "trauma_int5_potential.kml") { return "Potential Map - 5 Min Intervals > 10 "; }
	else return value;
}

function getChecked(index) {
	if (index == 0) { return "checked"; }
	else if (index == 1) { return "checked"; }
	else if (index == 2) { return "checked"; }
	else return "unchecked"
}

function getLegend(value) {
	if (value == "difference_int3.kml") { return "legend_dif_int3.gif"; }
	else if (value == "trauma_int5_existing.kml") { return "legend_gt5_min10.gif"; }
	else if (value == "trauma_int5_potential.kml") { return "legend_gt5_min10.gif"; }
	else return "";
}

function changeLegendVisibility(index) {
	
	var legendId = "legend_" + index;
	
	if ( document.getElementById(legendId).className.match(/(?:^|\s)span_unchecked(?!\S)/) ) {
		document.getElementById(legendId).className = "span_checked";
	} else 
		document.getElementById(legendId).className = "span_unchecked";
}

function createSidebar(aMap) {
	
	
    // list layers
    $.each(aMap.layers, function(index, value) { 
    	if (value.name != "Google Satellite") {
	    	$('#layersForm').append('<label class="checkbox"><input type="checkbox" value="' + index + '" ' + getChecked(index) + '> ' + getLayerName(value.name) + '</label>');
	    	$('#layersForm').append('<span id="legend_' + index + '" class="span_' + getChecked(index) + '"><img alt="" src="assets/images/' + getLegend(value.name) + '" /></span>');
    	}
    });
    
    // add a click listener on each layer checkbox
    $("#layersForm input:checkbox").change(function() {
    	  var target = $(this);
    	  aMap.layers[target.prop("value")].setVisibility(target.prop("checked"));
    	  changeLegendVisibility(target.prop("value"));
    	  //target.className = hidden + target.prop("checked");
    });
    
}

function initMap() {

	var map = new OpenLayers.Map("map", {
				numZoomLevels: 19
			});

	addLayers(map);

    // Google.v3 uses EPSG:900913 as projection, so we have to
    // transform our coordinates 41.8819, 87.6278
    map.setCenter(new OpenLayers.LonLat(-87.7278, 41.8419).transform(
        new OpenLayers.Projection("EPSG:4326"),
        map.getProjectionObject()
    ), 10);
    
    createSidebar(map)
    
    return map;

}



function createMarker(aMap, aId, aLon, aLat) {

	// Google.v3 uses EPSG:900913 as projection, so we have to
    // transform our coordinates
    var newLonLat = new OpenLayers.LonLat(aLon, aLat).transform(
            new OpenLayers.Projection("EPSG:4326"),
            aMap.getProjectionObject());

	var size = new OpenLayers.Size(32,37);
    var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    var icon = new OpenLayers.Icon('/assets/images/map-marker.png',size,offset);
    var marker = new OpenLayers.Marker(newLonLat,icon);
    marker.map = aMap;
    marker.id = aId;
    
    aMap.getLayer("Markers").addMarker(marker);
    
    return marker;

}

/*
 * Old attempt at changing legend visibility using jquery instead of js

function changeLegendVisibility(index) {
	if (target.hasClass('span_hidden')) {
		target.removeClass('span_hidden');
		target.addClass('span_visible');
	}
	else {
		target.removeClass('span_visible');
		target.addClass('span_hidden');
	}
	}
	*/

/*
 * old attempt at labelling, gave up because as far as I can tell, you have to set extractStyles to false for the styleMap to work, but since it's set to false,
 *   you can't use the KML to set the style, so there's no way to use the different styles that are listed - just going to make legends for each 
 *
function addKMLLayer(aMap, aKMLPath) {
	var styleMap = new OpenLayers.StyleMap({
		"color1": new OpenLayers.Style({ FillColor: "#ff0014", fillOpacity: 0.5, strokeColor: "#ff0014", strokeWidth: 1,  strokeDashstyle: "dash",  label: "${label}",  labelAlign: "cc", fontColor: "#000000", fontOpacity: 0.9, fontFamily: "Arial", fontSize: 14      },  { context: { label: function (feature) { return feature.attributes.name; } } } ),
		"color2": new OpenLayers.Style({ FillColor: "#ffb414", fillOpacity: 0.5, strokeColor: "#ffb414", strokeWidth: 1,  strokeDashstyle: "dash",  label: "${label}",  labelAlign: "cc", fontColor: "#000000", fontOpacity: 0.9, fontFamily: "Arial", fontSize: 14      },  { context: { label: function (feature) { return feature.attributes.name; } } } ),
		"color3": new OpenLayers.Style({ FillColor: "#ff0f14", fillOpacity: 0.5, strokeColor: "#ff0f14", strokeWidth: 1,  strokeDashstyle: "dash",  label: "${label}",  labelAlign: "cc", fontColor: "#000000", fontOpacity: 0.9, fontFamily: "Arial", fontSize: 14      },  { context: { label: function (feature) { return feature.attributes.name; } } } ),
		"color4": new OpenLayers.Style({ FillColor: "#14ff00", fillOpacity: 0.5, strokeColor: "#14ff00", strokeWidth: 1,  strokeDashstyle: "dash",  label: "${label}",  labelAlign: "cc", fontColor: "#000000", fontOpacity: 0.9, fontFamily: "Arial", fontSize: 14      },  { context: { label: function (feature) { return feature.attributes.name; } } } ),
		"color5": new OpenLayers.Style({ FillColor: "#0078ff", fillOpacity: 0.5, strokeColor: "#0078ff", strokeWidth: 1,  strokeDashstyle: "dash",  label: "${label}",  labelAlign: "cc", fontColor: "#000000", fontOpacity: 0.9, fontFamily: "Arial", fontSize: 14      },  { context: { label: function (feature) { return feature.attributes.name; } } } ),
		"color6": new OpenLayers.Style({ FillColor: "#14ff0f", fillOpacity: 0.5, strokeColor: "#14ff0f", strokeWidth: 1,  strokeDashstyle: "dash",  label: "${label}",  labelAlign: "cc", fontColor: "#000000", fontOpacity: 0.9, fontFamily: "Arial", fontSize: 14      },  { context: { label: function (feature) { return feature.attributes.name; } } } ),
		"color7": new OpenLayers.Style({ FillColor: "#ffffff", fillOpacity: 0.5, strokeColor: "#ffffff", strokeWidth: 1,  strokeDashstyle: "dash",  label: "${label}",  labelAlign: "cc", fontColor: "#000000", fontOpacity: 0.9, fontFamily: "Arial", fontSize: 14      },  { context: { label: function (feature) { return feature.attributes.name; } } } )
	});
	
	var layer = new OpenLayers.Layer.Vector(aKMLPath, {
        strategies: [new OpenLayers.Strategy.Fixed()],
        styleMap: styleMap,
        protocol: new OpenLayers.Protocol.HTTP({
            url: "/assets/kml/" + aKMLPath,
            format: new OpenLayers.Format.KML({
                extractAttributes: true,
                extractStyles: false,
                maxDepth: 2
            })
        }),
        transitionEffect: 'resize'
    });

	aMap.addLayer(layer);

	return layer;
}
*/
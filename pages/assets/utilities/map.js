import React, { useEffect, useRef } from "react";

import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM.js";
import { defaults as defaultInteractions } from "ol/interaction.js";
import Feature from "ol/Feature.js";
import Point from "ol/geom/Point.js";
import { Icon, Style } from "ol/style.js";
import VectorSource from "ol/source/Vector.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { Button } from "antd";

const MapViewer = ({ coordinates, viewOnly, styles }) => {
  const mapRef = useRef(null);
  let map = null;

  useEffect(() => {
    const iconFeature = new Feature({
      geometry: new Point(coordinates),
      name: "Null place",
      population: 4000,
      rainfall: 500,
    });

    iconFeature.setStyle(
      new Style({
        image: new Icon({
          src: "marker.png",
          width: viewOnly ? 20 : 40,
          height: viewOnly ? 20 : 40,
        }),
      })
    );

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [iconFeature],
      }),
    });

    map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer,
      ],
      controls: [],
      interactions: defaultInteractions(
        viewOnly
          ? {
              doubleClickZoom: false,
              dragAndDrop: false,
              dragPan: false,
              keyboardPan: false,
              keyboardZoom: false,
              mouseWheelZoom: false,
              pointer: false,
              select: false,
            }
          : {}
      ),
      view: new View({
        center: coordinates,
        projection: "EPSG:4326",
        zoom: 18,
        minZoom: 16,
        maxZoom: 20,
      }),
    });

    map.updateSize();
    return () => map.setTarget(null);
  }, [coordinates]);

  return (
    <div style={{ position: "relative" }}>
      <div id="map" ref={mapRef} style={{ ...styles, width: "100%" }} />
      {!viewOnly && (
        <Button
          style={{ position: "absolute", bottom: 5, right: 5 }}
          onClick={() => {
            if (map) {
              map.getView().animate({
                center: coordinates,
                zoom: 18,
                duration: 1000,
              });
            }
          }}
        >
          Go Back to Initial Coordinates
        </Button>
      )}
    </div>
  );
};

export default MapViewer;

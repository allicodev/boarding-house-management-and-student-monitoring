import React, { useEffect, useRef, useState } from "react";

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
          Re-center
        </Button>
      )}
    </div>
  );
};

const MapPicker = ({ onsubmit, defaultCoordinates, close, styles }) => {
  const mapRef = useRef(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState();
  const [address, setAddress] = useState("");
  let map = useRef(null);

  const iconText = (icon, text) => (
    <div
      style={{
        margin: "7px 12px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <span style={{ marginRight: 5, display: "flex", alignItems: "center" }}>
        {icon}
      </span>{" "}
      {text}
    </div>
  );

  useEffect(() => {
    const iconFeature = new Feature({
      geometry: new Point([defaultCoordinates.lat, defaultCoordinates.long]),
      name: "Null place",
      population: 4000,
      rainfall: 500,
    });
    iconFeature.setStyle(
      new Style({
        image: new Icon({
          src: "blue-marker.png",
          width: 40,
          height: 40,
        }),
      })
    );

    let layers = [
      new TileLayer({
        source: new OSM(),
      }),
      new VectorLayer({
        source: new VectorSource({
          features: [iconFeature],
        }),
      }),
    ];

    map.current = new Map({
      target: mapRef.current,
      layers,
      controls: [],
      view: new View({
        center: [defaultCoordinates.lat, defaultCoordinates.long],
        projection: "EPSG:4326",
        zoom: 18,
        minZoom: 16,
        maxZoom: 20,
      }),
    });

    map.current.on("click", (e) => {
      setSelectedCoordinates(e.coordinate);

      const iconFeature2 = new Feature({
        geometry: new Point(e.coordinate),
        name: "Null place",
        population: 4000,
        rainfall: 500,
      });

      iconFeature2.setStyle(
        new Style({
          image: new Icon({
            src: "red-marker.png",
            width: 40,
            height: 40,
          }),
        })
      );

      map.current.setLayers([
        ...layers,
        new VectorLayer({
          source: new VectorSource({
            features: [iconFeature2],
          }),
        }),
      ]);

      // reverse geocoding
      (async () => {
        let _address = await RGeocode({
          long: e.coordinate[0],
          lat: e.coordinate[1],
        });
        setAddress(_address);
      })();

      map.current.getView().animate({
        center: e.coordinate,
        zoom: 18,
        duration: 300,
      });
    });
    map.current.updateSize();
    return () => map.current.setTarget(null);
  }, [defaultCoordinates]);

  return (
    <div style={{ position: "relative" }}>
      <div id="map" ref={mapRef} style={{ ...styles, width: "100%" }} />
      <Button
        style={{ position: "absolute", bottom: 5, right: 5 }}
        onClick={() => {
          console.log(map.current);
          if (map.current) {
            map.current.getView().animate({
              center: [defaultCoordinates.lat, defaultCoordinates.long],
              zoom: 18,
              duration: 1000,
            });
          }
        }}
      >
        Re-center
      </Button>
      {/* <div style={{ position: "absolute", top: 5, left: 5 }}>
        {iconText(
          <IconContext.Provider
            value={{ color: "green", className: "global-class-name" }}
          >
            <MdLocationOn size={21} />
          </IconContext.Provider>,
          "Center"
        )}
      </div> */}
      {address != "" && (
        <div
          style={{
            position: "absolute",
            top: 3,
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fff",
            padding: "5px 10px",
            borderRadius: 10,
          }}
        >
          {address}
        </div>
      )}
      {address != "" && (
        <Button
          type="primary"
          style={{
            position: "absolute",
            bottom: 3,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          onClick={() => {
            onsubmit(selectedCoordinates, address);
            close();
          }}
        >
          PIN SELECTED LOCATION
        </Button>
      )}
    </div>
  );
};

const RGeocode = async ({ lat, long }) => {
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;

  return await fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data?.display_name) {
        return (
          data.display_name.split(",").slice(0, -3).join(",") ??
          "Address not Available."
        );
      } else {
        return "Address not Available.";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

export default MapViewer;
export { RGeocode, MapPicker };

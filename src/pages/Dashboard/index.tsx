import Map, { Layer, Source } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { cellToLatLng, latLngToCell, cellToBoundary, H3IndexInput } from 'h3-js';
import { Red } from '@/shared/colors/red';
import { useEffect, useState } from 'react';

export const DashboardComponent = () => {
  const SP_CENTER = {
    latitude: -22.15,
    longitude: -48.93,
    zoom: 5.5,
  };

  const [mainHexagon, setMainHexagon] = useState<H3IndexInput>('');

  const hexId = '876520d95ffffff';

  const hexindex7Id = '876520d95ffffff';

  const convertCellToLatLng = (cell: H3IndexInput) => {
    // Returns the center coordinate as a CoordPair [lat, lng] pair:
    return cellToLatLng(cell);
  };

  function converLatLngToCell(lat: number, lng: number, res: number) {
    // Returns the H3Index string of the containing hexagon.
    return latLngToCell(lat, lng, res);
  }

  // To draw the H3 cell on a map, you need the coordinates of each vertex.
  // The cellToBoundary() method (API reference) accepts a H3Index string
  // and returns and array of [lat, lng] pairs corresponding to the cell's vertices.

  function convertCellToBoundary(cell: H3IndexInput) {
    // Returns the vertices of the H3 cell as an Array.<CoordPair> i.e. an array of [lat, lng] pairs.
    return cellToBoundary(cell);
  }

  useEffect(() => {
    const { latitude, longitude, zoom } = SP_CENTER;

    const cell = latLngToCell(latitude, longitude, zoom);

    setMainHexagon(cell);
  }, []);

  return (
    <div>
      <Map
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        initialViewState={SP_CENTER}
        style={{
          width: '100%',
          height: '80vh',
          margin: '20px 0',
        }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        <Source
          type="geojson"
          data={{
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [cellToBoundary(mainHexagon, true)],
            },
            properties: {},
            id: 'abc123',
          }}
        >
          <Layer
            {...{
              type: 'fill',
              paint: {
                'fill-outline-color': 'white',
                'fill-color': Red.BASE,
                'fill-opacity': 0.7,
              },
            }}
          />
        </Source>
      </Map>
    </div>
  );
};

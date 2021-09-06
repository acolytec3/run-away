import * as React from "react";
import { fromLonLat } from "ol/proj";
import { RFeature, RLayer, RLayerVector, RMap, ROSM } from "rlayers";
import { RStyle, RIcon } from "rlayers/style";
import Point from "ol/geom/Point";

const MapComponent: React.FC<any> = (props) => {
  const { tracks } = props;
  console.log(tracks);
  return (
    <RMap
      initial={{
        center: fromLonLat([
          tracks[0].coords.longitude,
          tracks[0].coords.latitude,
        ]),
        zoom: 11,
      }}
    >
      <ROSM />
      <RLayerVector>
        <RLayer>
          {tracks.map((track: GeolocationPosition) => {
            console.log(track);
            return (
              <RFeature
                geometry={
                  new Point(
                    fromLonLat([track.coords.longitude, track.coords.latitude])
                  )
                }
              ></RFeature>
            );
          })}
        </RLayer>
      </RLayerVector>
    </RMap>
  );
};

export default MapComponent;

import * as React from "react";
import { fromLonLat } from "ol/proj";
import { RFeature, RLayerVector, RMap, ROSM } from "rlayers";
import { RStyle, RIcon } from "rlayers/style";
import Point from "ol/geom/Point";
import locationIcon from "../location.svg";
import "ol/ol.css";
import globalContext, { Step } from "../context/globalContext";

const MapComponent: React.FC<any> = () => {
  const { state } = React.useContext(globalContext);
  return (
    <RMap
      initial={{
        center: fromLonLat([state.tracks[0].lon, state.tracks[0].lat]),
        zoom: 11,
      }}
      width="90vw"
      height="90vh"
    >
      <ROSM />
      <RLayerVector zIndex={10}>
        <RStyle>
          <RIcon src={locationIcon} anchor={[0.5, 0.8]} />
        </RStyle>
        {state.tracks.map((track: Step) => {
          return (
            <RFeature
              key={Math.random()}
              geometry={new Point(fromLonLat([track.lon, track.lat]))}
            ></RFeature>
          );
        })}
      </RLayerVector>
    </RMap>
  );
};

export default MapComponent;

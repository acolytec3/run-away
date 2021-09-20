import * as React from "react";
import { fromLonLat } from "ol/proj";
import { RFeature, RLayerVector, RMap, ROSM } from "rlayers";
import { RStyle, RIcon } from "rlayers/style";
import Point from "ol/geom/Point";
import locationIcon from "../location.svg";
import { Step } from "./Timer";
import "ol/ol.css";
const MapComponent: React.FC<any> = (props) => {
  const { tracks } = props;
  console.log(tracks);
  return (
    <RMap
      initial={{
        center: fromLonLat([tracks[0].lon, tracks[0].lat]),
        zoom: 11,
      }}
      width={"100%"}
      height={"100%"}
    >
      <ROSM />
      <RLayerVector zIndex={10}>
        <RStyle>
          <RIcon src={locationIcon} anchor={[0.5, 0.8]} />
        </RStyle>
        {tracks.map((track: Step) => {
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

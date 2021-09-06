import React from "react";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { getDistanceFromLatLonInMi } from "../util/helpers";

const Timer = () => {
  const [time, setTime] = React.useState(0);
  const [timer, setTimer] = React.useState<number>();
  const [tracks, setTracks] = React.useState<GeolocationPosition[]>([]);
  const [distance, setDistance] = React.useState(0);

  const start = () => {
    navigator.geolocation.getCurrentPosition(
      (loc) => setTracks([loc]),
      undefined,
      { enableHighAccuracy: true }
    );
    const id = window.setInterval(
      () =>
        navigator.geolocation.getCurrentPosition(
          (loc) => tick(loc),
          undefined,
          { enableHighAccuracy: true }
        ),
      1000
    );
    setTimer(id);
  };

  const stop = () => {
    window.clearInterval(timer);
  };

  const reset = () => {
    setTime(0);
    setDistance(0);
    setTracks([]);
  };

  const tick = (loc: GeolocationPosition) => {
    setTime((time) => time + 1000);
    const journey = tracks;
    journey.push(loc);
    setTracks(journey);
    const totalDistance =
      distance +
      getDistanceFromLatLonInMi(
        tracks[tracks.length - 1].coords.latitude,
        tracks[tracks.length - 1].coords.longitude,
        loc.coords.latitude,
        loc.coords.longitude
      );
    setDistance(totalDistance);
  };

  return (
    <>
      <HStack>
        <Button onClick={start}>Start</Button>
        <Button onClick={stop}>Stop</Button>
        <Button onClick={reset}>Reset</Button>
        <Text>Elapsed Time: {time / 1000} seconds</Text>
        <Text>Total Distance: {distance} mi</Text>
      </HStack>
      <VStack>
        {tracks.slice(tracks.length - 10).map((track) => (
          <Text key={(Math.random() + track.coords.longitude).toString()}>
            Step: {track.coords.latitude} {track.coords.longitude}
            {getDistanceFromLatLonInMi(
              tracks[tracks.length - 1].coords.latitude,
              tracks[tracks.length - 1].coords.longitude,
              track.coords.latitude,
              track.coords.longitude
            )}
          </Text>
        ))}
      </VStack>
    </>
  );
};

export default Timer;

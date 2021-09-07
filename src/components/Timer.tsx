import React from "react";
import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { getDistanceFromLatLonInMi } from "../util/helpers";

const Timer = () => {
  const [time, setTime] = React.useState(0);
  const [tracker, setTracker] = React.useState(0);
  const [timer, setTimer] = React.useState<number>();
  const [tracks, setTracks] = React.useState<GeolocationPosition[]>([]);
  const [distance, setDistance] = React.useState(0);

  const start = () => {
    const trackerId = navigator.geolocation.watchPosition(
      (loc) => addStep(loc),
      undefined,
      { enableHighAccuracy: true, maximumAge: 30000, timeout: 5000 }
    );
    const timerId = window.setInterval(
      () => setTime((time) => time + 1000),
      1000
    );
    setTimer(timerId);
    setTracker(trackerId);
  };
  const stop = () => {
    window.clearInterval(timer);
    navigator.geolocation.clearWatch(tracker);
  };

  const reset = () => {
    setTime(0);
    setDistance(0);
    setTracks([]);
    setTracker(0);
  };

  const addStep = (loc: GeolocationPosition) => {
    if (tracks[tracks.length - 1] === loc) return;
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

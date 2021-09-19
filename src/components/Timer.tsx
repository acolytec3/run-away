import React from "react";
import { Button, HStack, Text } from "@chakra-ui/react";
import CheapRuler from "cheap-ruler";

let ruler: CheapRuler;

const Timer = () => {
  const [time, setTime] = React.useState(0);
  const [tracker, setTracker] = React.useState(0);
  const [timer, setTimer] = React.useState<number>();
  const [tracks, setTracks] = React.useState<GeolocationPosition[]>([]);
  const [distance, setDistance] = React.useState(0);

  const start = () => {
    navigator.geolocation.getCurrentPosition((loc) => {
      setTracks([loc]);
      ruler = new CheapRuler(loc.coords.latitude, "miles");
    });
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
    setTracks([]);
    setTracker(0);
    setDistance(0);
  };

  const addStep = (loc: GeolocationPosition) => {
    if (tracks[tracks.length - 1] === loc) return;
    const journey = tracks;
    journey.push(loc);
    const step = journey.length - 1;
    if (step > 0) {
      const localDistance = ruler.distance(
        [journey[step - 1].coords.latitude, journey[step - 1].coords.longitude],
        [journey[step].coords.latitude, journey[step].coords.longitude]
      );
      setDistance(distance + localDistance);
    }
  };

  const saveRoute = async () => {
    const tracksObject = tracks.map((step) =>
      Object.assign({
        lat: step.coords.latitude,
        lon: step.coords.longitude,
        timestamp: step.timestamp,
      })
    );
    const route = new Blob([JSON.stringify(tracksObject, null, 2)], {
      type: "application/json",
    });
    const href = await URL.createObjectURL(route);
    const link = document.createElement("a");
    link.href = href;
    link.download = `route.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <HStack>
        <Button onClick={start}>Start</Button>
        <Button onClick={stop}>Stop</Button>
        <Button isDisabled={time === 0} onClick={reset}>
          Reset
        </Button>
      </HStack>
      <Text>Elapsed Time: {time / 1000} seconds</Text>
      <Text>Total Distance: {distance} miles</Text>
      <HStack>
        <Button isDisabled={tracks.length === 0} onClick={saveRoute}>
          Save Route
        </Button>
      </HStack>
    </>
  );
};

export default Timer;

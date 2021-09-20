import React from "react";
import { Button, HStack, Text } from "@chakra-ui/react";
import CheapRuler from "cheap-ruler";
import GlobalContext, { Step } from "../context/globalContext";

let ruler: CheapRuler;

const Timer = () => {
  const [time, setTime] = React.useState(0);
  const [tracker, setTracker] = React.useState(0);
  const [timer, setTimer] = React.useState<number>();
  const [tracks, setTracks] = React.useState<Step[]>([]);
  const [distance, setDistance] = React.useState(0);

  const { dispatch } = React.useContext(GlobalContext);
  const start = () => {
    navigator.geolocation.getCurrentPosition((loc) => {
      setTracks([
        {
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
          timestamp: loc.timestamp,
        },
      ]);
      ruler = new CheapRuler(loc.coords.latitude, "miles");
    });
    const trackerId = navigator.geolocation.watchPosition(
      (loc) => {
        addStep({
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
          timestamp: loc.timestamp,
        });
      },
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
    dispatch({ type: "SAVE_TRACKS", payload: tracks });
  };

  const reset = () => {
    setTime(0);
    setTracks([]);
    setTracker(0);
    setDistance(0);
  };

  const addStep = (loc: Step) => {
    if (tracks[tracks.length - 1] === loc) return;
    const journey = tracks;
    journey.push(loc);
    setTracks(journey);
    const step = journey.length - 1;
    if (step > 0) {
      const localDistance = ruler.distance(
        [journey[step - 1].lat, journey[step - 1].lon],
        [journey[step].lat, journey[step].lon]
      );
      const totalDistance = distance + localDistance;
      setDistance(totalDistance);
    }
  };

  const downloadRoute = async () => {
    const route = new Blob([JSON.stringify(tracks, null, 2)], {
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
        <Button isDisabled={tracks.length === 0} onClick={downloadRoute}>
          Download Route
        </Button>
      </HStack>
    </>
  );
};

export default Timer;

import { Step } from "../context/globalContext";
import CheapRuler from "cheap-ruler"

export const calcTotalDistance = (tracks: Step[]) => {
    const ruler = new CheapRuler(tracks[0].lat, "miles");
    const totalDistance = tracks.reduce<number>((prev, curr, index, journey) => {
        if (index !== 0) {
            const localDistance = ruler.distance(
                [journey[index - 1].lat, journey[index - 1].lon],
                [curr.lat, curr.lon]);
            return prev + localDistance
        } else { return 0 }
    }, 0)
    return totalDistance
}
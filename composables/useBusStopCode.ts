import { getDocs, collection, query, where } from "firebase/firestore";
import type { RestructuredStops } from "../types/stops";

export const useBusStopCode = async (stopId: string) => {
  const db = useFirestore();

  const q = query(
    collection(db, "stopServices"),
    where("BusStopCode", ">=", stopId),
    where("BusStopCode", "<=", stopId + "\uf8ff"),
  );
  const busRoute = await getDocs(q);

  const stops: RestructuredStops[] = [];
  busRoute.forEach((v) => {
    stops.push(v.data() as RestructuredStops);
  });

  return stops;
};

import { getDocs, collection, query, where } from "firebase/firestore";
import type { RestructedStops } from "../types/stops";

export const useBusStopCode = async (stopId: string) => {
  const db = useFirestore();

  const q = query(
    collection(db, "stopServices"),
    where("BusStopCode", ">=", stopId),
    where("BusStopCode", "<=", stopId + "\uf8ff"),
  );
  const busRoute = await getDocs(q);

  const routes: RestructedStops[] = [];
  busRoute.forEach((v) => {
    routes.push(v.data() as RestructedStops);
  });

  return routes;
};

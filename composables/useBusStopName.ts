import { getDocs, collection, query, where } from "firebase/firestore";
import type { RestructuredStops } from "../types/stops";

export const useBusStopName = async (name: string) => {
  const db = useFirestore();

  const q = query(
    collection(db, "stopServices"),
    where("LowerCaseRoadName", ">=", name),
    where("LowerCaseRoadName", "<=", name + "\uf8ff"),
  );
  const busRoute = await getDocs(q);

  const stops: RestructuredStops[] = [];
  busRoute.forEach((v) => {
    stops.push(v.data() as RestructuredStops);
  });

  return stops;
};

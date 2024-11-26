import { getDocs, collection, query, where } from "firebase/firestore";
import type { ResturcturedRoutes } from "../types/routes";

export const useBusRoute = async (busId: string) => {
  const db = useFirestore();

  const q = query(
    collection(db, "routes"),
    where("ServiceNo", ">=", busId),
    where("ServiceNo", "<=", busId + "\uf8ff"),
  );
  const busRoute = await getDocs(q);

  const routes: ResturcturedRoutes[] = [];
  busRoute.forEach((v) => {
    routes.push(v.data() as ResturcturedRoutes);
  });

  return routes;
};

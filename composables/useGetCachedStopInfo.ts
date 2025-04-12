import type { Stop } from "~/types/stops";

type LocalStopInfo = {
  [key: string]: Stop;
};
export default async function useGetCachedStopInfo(
  stopCode: string,
): Promise<Stop | undefined> {
  let getFromLocal = JSON.parse(
    localStorage.getItem("stopInfo")!,
  )! as LocalStopInfo;

  if (getFromLocal && getFromLocal[stopCode]) {
    return getFromLocal[stopCode];
  }

  if (!getFromLocal) {
    localStorage.setItem("stopInfo", JSON.stringify({}));
  }

  const f = await $fetch("/api/get-stop", {
    method: "POST",
    body: { code: stopCode },
  });

  // const res: { data: Stop[]; error: any } = await f.json();

  getFromLocal = JSON.parse(
    localStorage.getItem("stopInfo")!,
  )! as LocalStopInfo;

  if (f.data) {
    localStorage.setItem(
      "stopInfo",
      JSON.stringify({
        ...getFromLocal,
        [stopCode]: f.data[0],
      }),
    );

    return f.data[0];
  }
  return undefined;
}

interface FAVS {
  id?: string;
  favs: string[];
}
export default async function useCheckTotalStops(uid: string): Promise<number> {
  const res: { data: { stops: string[] }; error: any } = await $fetch(
    "/api/get-saved-stops",
    {
      method: "POST",
      body: { id: uid },
    },
  );

  if (res?.data?.stops) {
    return res?.data?.stops.length;
  }

  return 0;
}

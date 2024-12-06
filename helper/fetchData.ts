import type { Service } from "~/types/bus";

export default async function fetchBusInfo (stopCode:string):Promise<Service[]> {
    const data = await $fetch("/api/bus-info", {
        method: "POST",
        body: JSON.stringify({ stopCode: stopCode }),
    });

    if(!data.error) {
        return data.Services!!
    }
    return []
}
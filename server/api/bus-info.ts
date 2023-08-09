const API_KEY: string | undefined = process.env.API_KEY

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    if(body['stopCode']) {
        const searchParams = new URLSearchParams({'BusStopCode': body['stopCode']}).toString()
        const res = await fetch('http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2?' + searchParams,{headers: { 'AccountKey': API_KEY as string, 'accept': 'application/json' }})
        const data = await res.json()
        return data
    }
    
   
})
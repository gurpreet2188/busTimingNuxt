import { promises as fs } from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const { readFile, writeFile } = fs
const API_KEY: string | undefined = process.env.API_KEY


const fetchBusStops = async () => {
    let skip = 0
    let data: Array<object> = []
    while (true) {
        const searchParams = new URLSearchParams({ '$skip': `${skip}` }).toString()
        const res = await fetch('http://datamall2.mytransport.sg/ltaodataservice/BusStops?' + searchParams, { headers: { 'AccountKey': API_KEY as string, 'accept': 'application/json' } })
        const resJSON = await res.json()
        if (resJSON['value']) {
            if (resJSON.value instanceof Array) {
                try {
                    data = [...data, ... await resJSON.value]

                } catch (err) {
                    console.log(err)
                    break
                }
                if (resJSON.value.length === 0) {
                    break
                }
                skip += 500
            } else {
                break
            }

        } else {
            break
        }
    }
    return data.length > 0 ? data : null
}

const writeNewFile =(filePath:string, data:Array<object>) =>{
    console.log('writing new file')
    try {
        writeFile(filePath, JSON.stringify(data), {flag:'w'})
    } catch (err) {
        console.log(err)
    }
    
}

const readNewFile = (filePath:string)=>{
   
    return readFile(filePath, 'utf-8').then(d => {
        console.log('file found')
        try {
            return JSON.parse(d)
        } catch (err) {
    
        }
    })
}

export const busStops = async () => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const filePath = path.join(__dirname, 'busStops.json')
    console.log(filePath)


    return readNewFile(filePath).catch(
        ()=>{
            return fetchBusStops().then(d => {
                if (d) {
                    writeNewFile(filePath,d)
                    return d
                }
            })
        }
    )
}
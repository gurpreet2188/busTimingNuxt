export function getCurrentLocation():  { lat: number, lon: number } {
    const coords = { lat: 0, lon: 0 }
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((pos) => {
            coords.lat = pos.coords.latitude
            coords.lon = pos.coords.longitude
        }, err => {
            if (err.code === err.PERMISSION_DENIED) {
                console.log(err.PERMISSION_DENIED)
                return
            }
        })
    }
    return coords
}
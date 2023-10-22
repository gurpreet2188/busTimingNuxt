import { defineStore } from "@pinia/nuxt/dist/runtime/composables";

export const useUserFavStopsStore = defineStore('userFavStops', {
    state:()=> ({fav:[]} as {fav:number[]}),
    actions: {
        fireStore(v:number[]) {
            this.fav = v
        }
    }
})
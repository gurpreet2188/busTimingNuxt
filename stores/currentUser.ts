import { defineStore } from "pinia";
import { useCurrentUser } from 'vuefire';
export const useCurrentUserStore = defineStore('currentUser', {
    state: ()=> {return useCurrentUser()}
})
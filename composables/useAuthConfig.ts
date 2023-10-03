import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";


export const useAuthConfig = () => {
    return {
        signInOptions: [
            GoogleAuthProvider.PROVIDER_ID,
            EmailAuthProvider.PROVIDER_ID
        ],
        signInSuccessUrl: "/",
    }
   
}





import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";

// const firebaseUISigned:Ref<boolean> = useState('firebaseUISigned',()=>false)

export const useAuthConfig = () => {
  return {
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      EmailAuthProvider.PROVIDER_ID,
    ],
    signInSuccessUrl: "/",
    callbacks: {
      signInSuccessWithAuthResult: () => {
        // firebaseUISigned.value = true
        console.log("signed In");
      },
    },
  };
};

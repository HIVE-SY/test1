import { useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
};

export default function Login() {
  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem("emailForSignIn");
      if (!email) {
        email = window.prompt("Please provide your email for confirmation");
      }

      signInWithEmailLink(auth, email, window.location.href)
        .then(() => {
          window.localStorage.removeItem("emailForSignIn");
          window.location.href = "/dashboard";
        })
        .catch((error) => {
          console.error("Sign-in error:", error);
          alert("Sign-in failed");
        });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true,
    };

    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem("emailForSignIn", email);
    alert("Magic link sent to your email.");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login with Magic Link</h1>
      <form onSubmit={handleLogin}>
        <input name="email" type="email" placeholder="Enter your email" required />
        <button type="submit">Send Magic Link</button>
      </form>
    </div>
  );
}

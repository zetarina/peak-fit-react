import { auth } from "./firebase-config"; // Import the auth object
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

class FirebaseService {
  // Login with email and password
  static async login(email, password) {
    try {
      console.log("Email:", email, "Password:", password);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(auth, email, password);
      const token = await userCredential.user.getIdToken();
      return { token, user: userCredential.user };
    } catch (error) {
      // Handle Firebase-specific errors
      switch (error.code) {
        case "auth/user-not-found":
          throw new Error("No account found with this email. Please sign up.");
        case "auth/wrong-password":
          throw new Error("Incorrect password. Please try again.");
        case "auth/invalid-email":
          throw new Error("The email address is invalid.");
        case "auth/user-disabled":
          throw new Error("This account has been disabled.");
        case "auth/too-many-requests":
          throw new Error(
            "Too many failed login attempts. Please try again later."
          );
        case "auth/network-request-failed":
          throw new Error(
            "Network error. Please check your internet connection."
          );
        default:
          throw new Error(error.message || "Failed to login.");
      }
    }
  }

  // Reset password by sending a reset link to the email
  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return "Password reset link sent.";
    } catch (error) {
      // Handle Firebase-specific errors
      switch (error.code) {
        case "auth/user-not-found":
          throw new Error("No account found with this email.");
        case "auth/invalid-email":
          throw new Error("The email address is invalid.");
        case "auth/too-many-requests":
          throw new Error(
            "Too many requests. Please wait a moment and try again."
          );
        case "auth/network-request-failed":
          throw new Error(
            "Network error. Please check your internet connection."
          );
        default:
          throw new Error(
            error.message || "Failed to send password reset link."
          );
      }
    }
  }

  // Register a new user with email, password, and username
  static async register(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: username });
      const token = await userCredential.user.getIdToken();
      return { token, user: userCredential.user };
    } catch (error) {
      // Handle Firebase-specific errors
      switch (error.code) {
        case "auth/email-already-in-use":
          throw new Error("This email is already in use. Please login.");
        case "auth/invalid-email":
          throw new Error("The email address is invalid.");
        case "auth/weak-password":
          throw new Error(
            "The password is too weak. Please choose a stronger password."
          );
        case "auth/operation-not-allowed":
          throw new Error(
            "Email/password accounts are not enabled. Please contact support."
          );
        case "auth/network-request-failed":
          throw new Error(
            "Network error. Please check your internet connection."
          );
        default:
          throw new Error(error.message || "Failed to register.");
      }
    }
  }
}

export default FirebaseService;

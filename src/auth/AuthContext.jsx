import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("user"); // "user" | "admin"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        setUser(u);
        if (u) {
          // 役割ドキュメントの読み取りに失敗しても user として継続
          try {
            const ref = doc(db, "roles", u.uid);
            const snap = await getDoc(ref);
            setRole(snap.exists() && snap.data().role === "admin" ? "admin" : "user");
          } catch (e) {
            setRole("user");
          }
        } else {
          setRole("user");
        }
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, role, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
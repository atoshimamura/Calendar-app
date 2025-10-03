import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LoginPage() {
  const { user, loginWithGoogle } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (user) nav("/select", { replace: true });
  }, [user]);

  return (
    <div className="page">
      <h1>予約カレンダー</h1>
      <p>Google アカウントでログインしてください。</p>
      <button className="primary" onClick={loginWithGoogle}>Google でログイン</button>
    </div>
  );
}
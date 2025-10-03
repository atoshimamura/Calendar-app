import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVICES, STAFFS } from "../constants";
import { useAuth } from "../auth/AuthContext";

export default function SelectPage() {
  const nav = useNavigate();
  const { logout } = useAuth();
  const [service, setService] = useState(SERVICES[0]);
  const [staff, setStaff] = useState(STAFFS[0]);

  const goCalendar = () => {
    nav(`/calendar?service=${encodeURIComponent(service)}&staff=${encodeURIComponent(staff)}`);
  };

  return (
    <div className="page">
      <h2>メニューと担当を選択</h2>
      <div className="row">
        <label>サービス</label>
        <select value={service} onChange={(e) => setService(e.target.value)}>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="row">
        <label>担当者</label>
        <select value={staff} onChange={(e) => setStaff(e.target.value)}>
          {STAFFS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="actions">
        <button className="primary" onClick={goCalendar}>カレンダーへ</button>
        <button onClick={logout}>ログアウト</button>
      </div>
    </div>
  );
}
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import WeekCalendar from "../components/WeekCalendar";
import { BUSINESS } from "../constants";
import { useAuth } from "../auth/AuthContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function CalendarPage() {
  const q = useQuery();
  const service = q.get("service");
  const staff = q.get("staff");
  const { user, role } = useAuth();
  const [baseDate, setBaseDate] = useState(new Date());

  const selected = useMemo(() => ({ service, staff }), [service, staff]);

  if (!service || !staff) return <div className="page">選択情報がありません。戻って選び直してください。</div>;

  return (
    <div className="page">
      <h2>週間カレンダー（{selected.service} / {selected.staff}）</h2>
      <WeekCalendar
        baseDate={baseDate}
        onPrevWeek={() => setBaseDate((d) => new Date(d.getTime() - 7 * 24 * 60 * 60 * 1000))}
        onNextWeek={() => setBaseDate((d) => new Date(d.getTime() + 7 * 24 * 60 * 60 * 1000))}
        business={BUSINESS}
        selected={selected}
        user={user}
        role={role}
      />
    </div>
  );
}
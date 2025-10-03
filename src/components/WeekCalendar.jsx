import { useEffect, useMemo, useState } from "react";
import { collection, doc, onSnapshot, orderBy, query, runTransaction, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase";
import { BUSINESS } from "../constants";
import { getWeekDays, generateSlots, fmtDate, fmtTime, slotId } from "../utils/time";
import SlotCell from "./SlotCell";

export default function WeekCalendar({ baseDate, onPrevWeek, onNextWeek, business = BUSINESS, selected, user, role }) {
  const days = useMemo(() => getWeekDays(baseDate), [baseDate]);
  const [bookedMap, setBookedMap] = useState(new Map()); // key=slotId -> booking doc
  const [busySid, setBusySid] = useState(null); // クリック中の枠ID

  // Firestore: 週間 + 選択中スタッフの予約を購読
 // 置き換え前：範囲+orderByで1本のクエリ → インデックス必須
// 置き換え後：各日ごとに equality だけで7本購読 → インデックス不要

useEffect(() => {
    const unsubs = [];
    const m = new Map();
  
    days.forEach((day) => {
      const d = fmtDate(day);
      const col = collection(db, "bookings");
      // equality のみ（staff/date/status）。orderByは使わない
      const qd = query(
        col,
        where("date", "==", d),
        where("staff", "==", selected.staff),
        where("status", "==", "booked")
      );
  
      const unsub = onSnapshot(
        qd,
        (snap) => {
          // 同じ日の分を都度反映（まず当該日のキーを掃除）
          for (const [k, v] of m) {
            if (v.date === d && v.staff === selected.staff) m.delete(k);
          }
          snap.forEach((doc) => {
            const data = doc.data();
            m.set(data.slotId, { id: doc.id, ...data });
          });
          setBookedMap(new Map(m)); // 新しいMapで再レンダー
        },
        (err) => console.error("bookings/day onSnapshot error", err)
      );
  
      unsubs.push(unsub);
    });
  
    return () => unsubs.forEach((u) => u());
  }, [baseDate, selected.staff]);
  

  const handleBook = async (dateObj) => {
    const sid = slotId(dateObj, selected.staff);
    const ref = doc(db, "bookings", sid);
    try {
      setBusySid(sid);
      await runTransaction(db, async (tx) => {
        const cur = await tx.get(ref);
        if (cur.exists() && cur.data().status === "booked") {
          throw new Error("すでに予約済みです");
        }
        tx.set(ref, {
          slotId: sid,
          date: fmtDate(dateObj),
          time: fmtTime(dateObj),
          startAt: dateObj.toISOString(),
          service: selected.service,
          staff: selected.staff,
          userId: user.uid,
          userName: user.displayName || "",
          status: "booked",
          createdAt: serverTimestamp(),
        });
      });
    } catch (e) {
      console.error("handleBook error", e);
      alert(e?.message || "予約に失敗しました");
    } finally {
      setBusySid(null);
    }
  };

  const handleCancel = async (booking) => {
    if (booking.userId !== user.uid && role !== "admin") return;
    const ref = doc(db, "bookings", booking.slotId);
    try {
      setBusySid(booking.slotId);
      await updateDoc(ref, { status: "canceled" });
    } catch (e) {
      console.error("handleCancel error", e);
      alert(e?.message || "キャンセルに失敗しました");
    } finally {
      setBusySid(null);
    }
  };

  return (
    <div>
      <div className="week-nav">
        <button onClick={onPrevWeek}>← 前週</button>
        <span>{fmtDate(days[0])} 〜 {fmtDate(days[6])}</span>
        <button onClick={onNextWeek}>次週 →</button>
      </div>

      <div className="grid">
        {/* ヘッダー行 */}
        <div className="cell header" />
        {days.map((d) => (
          <div key={d.toISOString()} className="cell header">{fmtDate(d)}</div>
        ))}

        {/* 時間枠行 */}
        {generateSlots(days[0], business).map((_, rowIdx) => (
          <div key={`row-${rowIdx}`} className="row-wrap">
            <div className="cell time">
              {fmtTime(generateSlots(days[0], business)[rowIdx])}
            </div>
            {days.map((day) => {
              const slotDate = generateSlots(day, business)[rowIdx];
              const sid = slotDate ? slotId(slotDate, selected.staff) : null;
              const booking = sid ? bookedMap.get(sid) : null;
              return (
                <SlotCell
                  key={`${fmtDate(day)}-${rowIdx}`}
                  dateObj={slotDate}
                  booking={booking}
                  onBook={() => handleBook(slotDate)}
                  onCancel={() => booking && handleCancel(booking)}
                  canCancel={booking && (booking.userId === user.uid || role === "admin")}
                  disabled={busySid === sid}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
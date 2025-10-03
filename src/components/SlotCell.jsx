import { fmtTime } from "../utils/time";

export default function SlotCell({ dateObj, booking, onBook, onCancel, canCancel }) {
  if (!dateObj) return <div className="cell" />;

  const isBooked = Boolean(booking);

  return (
    <div className={`cell ${isBooked ? "booked" : "free"}`}>
      <div className="slot">
        <div className="slot-time">{fmtTime(dateObj)}</div>
        {isBooked ? (
          <div className="slot-body">
            <div>予約済</div>
            <div className="muted">{booking.userName}</div>
            <div className="muted">{booking.service}</div>
            {canCancel && (
              <button className="danger" onClick={onCancel}>キャンセル</button>
            )}
          </div>
        ) : (
          <button className="primary" onClick={onBook}>予約</button>
        )}
      </div>
    </div>
  );
}
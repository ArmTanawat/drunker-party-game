// Shared confirm modal — used by EVERY game's Restart/Exit confirmation.
// Do not put game-specific text or logic in here; pass it all via props.
export default function ConfirmModal({
  title,
  text,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  confirmClass = "btn-red",
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{title}</div>
        <div className="modal-text">{text}</div>
        <div className="btn-row">
          <button className="btn-primary btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className={`btn-primary ${confirmClass}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

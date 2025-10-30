const ConfirmModal = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmTone = 'primary',
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(event) => event.stopPropagation()}>
        <h2>{title}</h2>
        <p className="modal-message">{message}</p>

        <div className="modal-buttons">
          <button className="modal-btn modal-btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className={`modal-btn modal-btn-${confirmTone}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

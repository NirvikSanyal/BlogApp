import { useEffect, useRef } from 'react';

const Modal = ({ title, eyebrow, onClose, children, size = 'default' }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog.showModal();
    return () => dialog.open && dialog.close();
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={`modal modal-${size}`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      aria-labelledby="modal-title"
    >
      <div className="modal-panel">
        <div className="modal-heading">
          <div>
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            <h2 id="modal-title">{title}</h2>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close dialog">&times;</button>
        </div>
        {children}
      </div>
    </dialog>
  );
};

export default Modal;

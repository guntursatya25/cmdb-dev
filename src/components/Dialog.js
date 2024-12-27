import React from 'react';

const Dialog = ({ open, onClose, title, children }) => {
  const dialogRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [open]);

  return (
    <dialog ref={dialogRef} className="dialog w-[80%] h-screen rounded-xl p-5" onClose={onClose}>
      <div className="dialog-content h-full">
        <header className="dialog-header flex justify-between">
          <h2>{title}</h2>
          <button onClick={onClose} className="dialog-close">
            &times;
          </button>
        </header>
        <main className="dialog-body">{children}</main>
        <footer className="dialog-footer flex justify-end items-end bottom-0">
          <button onClick={onClose}>Close</button>
        </footer>
      </div>
    </dialog>
  );
};

export default Dialog;

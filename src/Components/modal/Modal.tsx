import React, { FC } from 'react';
import { ModalProps } from 'Types/ModalProps';
import './Modal.css';
import { createPortal } from 'react-dom';

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    modalRoot
  );
};
export default Modal;

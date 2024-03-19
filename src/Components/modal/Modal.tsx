import React, { FC } from 'react';
import { ModalProps } from 'Types/ModalProps';
import './Modal.css';

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;

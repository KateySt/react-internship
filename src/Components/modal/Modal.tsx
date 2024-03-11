import React, { FC } from 'react'
import { ModalProps } from '../../Types/ModalProps'

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null
    return (
        <div onClick={onClose}>
            <div
                onClick={(e: React.MouseEvent<HTMLDivElement>) =>
                    e.stopPropagation()
                }
            >
                {children}
                <button onClick={onClose}>Close Modal</button>
            </div>
        </div>
    )
}

export default Modal

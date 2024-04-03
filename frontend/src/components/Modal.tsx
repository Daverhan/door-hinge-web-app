import { ReactNode } from "react"
import ReactDOM from "react-dom";
import '/modal.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;
    
    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-button" onClick={onClose}>x</button>
                {children}
            </div>
        </div>,
        document.getElementById("modal-root") as HTMLElement // must be in index.html
    );
};

export default Modal;
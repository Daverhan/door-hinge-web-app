import { ReactNode } from "react"
import ReactDOM from "react-dom";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    if (!isOpen) return null;
    
    return ReactDOM.createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-lg w-full m-auto" onClick={(e) => e.stopPropagation()}>
                <button className="text-xl leading-none float-right" onClick={onClose}>&times;</button>
                {children}
            </div>
        </div>,
        document.getElementById("modal-root") as HTMLElement // must be in index.html
    );
};

export default Modal;
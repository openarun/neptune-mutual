import React, { ReactNode, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

const Modal = ({ children, isOpen, onClose, title }: ModalProps) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 100);
  };

  if (!isOpen && !isClosing) {
    return null;
  }

  return (
    <div className={`fixed w-full h-full  flex items-center justify-center ${isClosing ? "fade-out" : ""}`}>
      <div className="absolute w-full z-10 h-full bg-gray-900 opacity-90" onClick={handleClose} />
      <div className="bg-white w-4/5 md:w-1/2 lg:w-1/4 rounded-lg p-5 z-20 space-y-8"
        role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
        <div className="flex justify-between">
          <h3 className="text-2xl" id="modal-title">{title}</h3>
          <AiOutlineClose size={22} onClick={handleClose} role="button" />
        </div>
        <div id="modal-description">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

import React, { ReactNode, useState } from "react";

type ModalProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

const Modal = ({ children, isOpen, onClose }: ModalProps) => {
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
      <div className="bg-white w-1/4 rounded-lg p-5 z-20">{children}</div>
    </div>
  );
};

export default Modal;

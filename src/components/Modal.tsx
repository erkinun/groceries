import { useEffect, useState } from 'react';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullWidth?: boolean;
};

const Modal = ({
  isOpen,
  onClose,
  children,
  fullWidth = false,
}: ModalProps) => {
  const [showModal, setShowModal] = useState<boolean>(isOpen);

  const closeModal = () => {
    setShowModal(false);
    onClose();
  };

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const containerStyle = `bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full ${
    fullWidth ? 'w-full' : 'w-3/4`'
  }`;

  return (
    <>
      {showModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={closeModal}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div
              className={containerStyle}
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;

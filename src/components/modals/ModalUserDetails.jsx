import React, { useState, useEffect } from 'react';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
import '../../assets/css/modal.css';

export const ModalUserDetails = ({ isOpen = false, closeModal, data }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log({ data });
    setShowModal(isOpen);
  }, [isOpen]);

  return (
    <Modal active={showModal} toggler={closeModal} size="lg">
      <ModalHeader toggler={closeModal}>User Details</ModalHeader>
      <ModalBody>
        <div className="divCenter600">
          <img src={data?.image} alt="nothing to show" className="modalAVT" />
        </div>
        <div className="modalLabel">
          User Name
          <div className="infoArea">{data?.userName}</div>
        </div>
        <div className="modalLabel">
          User ID
          <div className="infoArea">{data?._id}</div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="red"
          buttonType="link"
          onClick={closeModal}
          ripple="dark"
        >
          Close
        </Button>

        <Button
          color="green"
          onClick={(e) => setShowModalCode(false)}
          ripple="light"
        >
          Save Changes
        </Button>
      </ModalFooter>
    </Modal>
  );
};

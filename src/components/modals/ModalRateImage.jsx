import React, { useState, useEffect } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import "../../assets/css/modalRating.css";

import { useSelector, useDispatch } from "react-redux";
import { onSetModalRatingVisibility } from "../../redux/ratingSlice";

export const ModalRatingImage = ({ data }) => {
  const isOpen = useSelector((state) => state.rating.ratingVisibility);
  const dispatch = useDispatch();

  const closeModal = () => dispatch(onSetModalRatingVisibility(false));

  return (
    <Modal active={isOpen} toggler={closeModal} size="lg">
      <ModalHeader toggler={closeModal}>Rating Image</ModalHeader>
      <ModalBody>
        <div className="modal-body">
          <span className="top-message">
            To help us get better, please rate this candidate.
          </span>
          <div className="comment-box text-center">
            <div className="rating">
              <input type="radio" name="rating" value="5" id="5" />
              <label htmlFor="5">☆</label>
              <input type="radio" name="rating" value="4" id="4" />
              <label htmlFor="4">☆</label>
              <input type="radio" name="rating" value="3" id="3" />
              <label htmlFor="3">☆</label>
              <input type="radio" name="rating" value="2" id="2" />
              <label htmlFor="2">☆</label>
              <input type="radio" name="rating" value="1" id="1" />
              <label htmlFor="1">☆</label>
            </div>
          </div>

          <span className="bottom-message">
            Your ratings will be confidential so candidates won't see them.
          </span>
          <div className="modal-alert alert alert-danger hide">
            Failed to save rating
          </div>
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

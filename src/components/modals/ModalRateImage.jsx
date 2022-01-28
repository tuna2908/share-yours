import React, { useState, useEffect } from "react";
import Modal from "@material-tailwind/react/Modal";
import ModalHeader from "@material-tailwind/react/ModalHeader";
import ModalBody from "@material-tailwind/react/ModalBody";
import ModalFooter from "@material-tailwind/react/ModalFooter";
import Button from "@material-tailwind/react/Button";
import "../../assets/css/modal.css";
import "../../assets/css/modalRating.css";

import { useSelector, useDispatch } from "react-redux";
import {
  onResetPin,
  onSetModalRatingVisibility,
} from "../../redux/ratingSlice";
import { getAccountInfo } from "../../utils/near";
import { utils } from "near-api-js";
import { client } from "../../client";
import { userQuery } from "../../utils/data";

import { v4 as uuidv4 } from "uuid";
import Spinner from "../Spinner";

const STARS = [5, 4, 3, 2, 1];

export const ModalRatingImage = ({ data }) => {
  const isOpen = useSelector((state) => state.rating.ratingVisibility);
  const info = useSelector((state) => state.rating.currentPin);
  const [nearUser, setNearUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [account, setCurrentNearAccount] = useState(null);
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);

  const [tips, setTips] = useState("0");
  const dispatch = useDispatch();

  const closeModal = () => {
    dispatch(onSetModalRatingVisibility({ visibility: false }));
    setTimeout(() => dispatch(onResetPin()), 200);
  };

  const onHandleSendTips = async () => {
    setLoading(true);
    try {
      let imgUrl = info.image.asset.url;
      let pinId = info._id;

      const amountInYocto = utils.format.parseNearAmount(tips);

      // console.log({
      //   id: "tuna2.testnet",
      //   amount: amountInYocto.toString(),
      //   nearUser,
      //   contract: window.contract,
      //   currentUser,
      // });

      //save Rating Info and ammount
      //to contract
      await window.contract.addRateMessage({
        message: {
          from: account.accountId,
          to: nearUser,
          rating: rating.toString(),
          donation: amountInYocto,
          imgUrl,
        },
      });
      //to sanity
      await client
        .patch(pinId)
        .setIfMissing({ ratings: [] })
        .insert("after", "ratings[-1]", [
          {
            rating: rating.toString(),
            donation: amountInYocto,
            _key: uuidv4(),
            postedBy: { _type: "postedBy", _ref: currentUser._id },
          },
        ])
        .commit();
      await account.sendMoney(
        nearUser, // receiver account
        amountInYocto.toString() // amount in yoctoNEAR
      );
      setLoading(false);
    } catch (error) {
      console.log({ error });
      setLoading(false);
    }
  };

  useEffect(async () => {
    if (isOpen) {
      const account = getAccountInfo();
      setCurrentNearAccount(account);

      const { nearUser } = await client.getDocument(info.postedBy._id);
      setNearUser(nearUser);

      const userInfo = JSON.parse(localStorage.getItem("user"));
      const query = userQuery(userInfo?.googleId);
      const data = await client.fetch(query);
      setCurrentUser(data[0]);
    }
  }, [isOpen]);

  const getDisplayNearName = (nearUser) => {
    let displayNear = "loading";
    if (!account?.accountId) {
    }
    if (nearUser) displayNear = nearUser;
    if (!nearUser) displayNear = "Not link to NEAR Wallet";

    return displayNear;
  };

  return (
    <Modal active={isOpen} toggler={closeModal} size="lg">
      <ModalHeader toggler={closeModal}>Rating Image</ModalHeader>
      <ModalBody>
        <div className="modal-body" style={{ maxWidth: 410 }}>
          <div>
            <div className="authorContainer">
              <img
                src={info?.postedBy?.image}
                alt="user-pic"
                className="w-14 h-14 rounded-lg"
              />
              <div className="authorTextInfo">
                <strong>Author: </strong>
                {info?.postedBy?.userName} <br />
                <strong>Near Account: </strong>
                {getDisplayNearName(nearUser)}
              </div>
            </div>
          </div>
          <p style={{ margin: "10px 0" }}>
            <em>To help us get better, please rate this image here.</em>
          </p>
          <div className="comment-box text-center imgInModal">
            <img
              src={info?.image?.asset?.url}
              alt="user-pic"
              className="rounded-lg"
              style={{ width: "20%" }}
            />
          </div>
          <div className="comment-box text-center">
            <div className="rating">
              {STARS.map((star) => (
                <>
                  <input
                    type="radio"
                    name="rating"
                    value={star}
                    id={star}
                    checked={star === rating}
                  />
                  <label onClick={() => setRating(star)} htmlFor={star}>
                    ☆
                  </label>
                </>
              ))}
            </div>
          </div>

          <div
            className="modalLabel"
            style={{ width: "100%", boxSizing: "border-box" }}
          >
            Some motivations
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={tips}
              onChange={(e) => setTips(e.target.value)}
              min="0"
              className="inputTips"
            />
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

        {account?.accountId && nearUser && (
          <Button
            color={loading ? "gray" : "green"}
            onClick={loading ? () => {} : onHandleSendTips}
            ripple="light"
            className={loading ? "cursor-not-allowed" : ""}
            style={{ width: 97, height: 38 }}
          >
            {loading ? <Spinner width={80} height={20} /> : "Submit"}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

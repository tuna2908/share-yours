import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiFillStar, AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import { useDispatch } from "react-redux";

import { client, urlFor } from "../client";
import { onSetModalRatingVisibility, onSetPin } from "../redux/ratingSlice";

import NEARLogo from "../assets/nearLogo.png";
import { utils } from "near-api-js";

const Pin = ({ pin }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [avgRate, setAvgRate] = useState("N/A");
  const [totalDonation, setTotalDonation] = useState("N/A");

  const { postedBy, image, _id, destination, ratings } = pin;

  const user =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();

  const deletePin = async (id) => {
    await client.delete(id);
    window.location.reload();
  };

  let alreadySaved = pin?.save?.filter(
    (item) => item?.postedBy?._id === user?.googleId
  );

  alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  const savePin = async (id) => {
    if (alreadySaved?.length === 0) {
      setSavingPost(true);

      await client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId: user?.googleId,
            postedBy: {
              _type: "postedBy",
              _ref: user?.googleId,
            },
          },
        ])
        .commit();
      window.location.reload();
      setSavingPost(false);
    }
  };

  useEffect(() => {
    if (ratings?.length > 0) {
      let totalDonation = 0;
      let avgRate = 0;
      ratings.map((element) => {
        const ammountInNear = parseFloat(
          utils.format.formatNearAmount(element?.donation)
        );
        totalDonation += ammountInNear || 0;
        avgRate += parseFloat(element?.rating) || 0;
      });
      console.log("B4 Calculate", {
        totalDonation,
        avgRate,
        length: ratings.length,
      });

      if (avgRate != 0) avgRate = (avgRate / ratings.length).toFixed(2);

      console.log({ totalDonation, avgRate, length: ratings.length });
      setTotalDonation(totalDonation.toFixed(2));
      setAvgRate(avgRate);
    }
  }, []);

  return (
    <div className="m-2">
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
      >
        <img
          className="rounded-lg w-full "
          src={urlFor(image).width(250).url()}
          alt="user-post"
        />
        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
            style={{ height: "100%" }}
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(onSetModalRatingVisibility({ visibility: true }));
                  dispatch(onSetPin({ pin }));
                }}
              >
                Rate this
              </button>

              {alreadySaved?.length !== 0 ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {pin?.save?.length} Saved
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    savePin(_id);
                  }}
                  type="button"
                  className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none"
                >
                  {pin?.save?.length} {savingPost ? "Saving" : "Save"}
                </button>
              )}

              <div
                className=" flex justify-between items-center gap-2 w-full"
                style={{ position: "absolute", left: 5, top: 45 }}
              >
                <span
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  rel="noreferrer"
                  style={{ padding: "3px 8px" }}
                >
                  <AiFillStar />
                  {avgRate}
                </span>
              </div>

              <div
                className=" flex justify-between items-center gap-2 w-full"
                style={{ position: "absolute", left: 5, top: 85 }}
              >
                <span
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  rel="noreferrer"
                  style={{ padding: "3px 8px" }}
                >
                  <img
                    src={NEARLogo}
                    alt="no-source"
                    style={{ width: 12, height: 12 }}
                  />
                  {totalDonation}
                </span>
              </div>
            </div>

            <div className=" flex justify-between items-center gap-2 w-full">
              {destination?.slice(8).length > 0 ? (
                <a
                  href={destination}
                  target="_blank"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  rel="noreferrer"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination?.slice(8, 17)}...
                </a>
              ) : undefined}

              <div
                className="flex gap-2"
                style={{ position: "absolute", right: 7.8, bottom: 10 }}
              >
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {postedBy?._id === user?.googleId && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePin(_id);
                  }}
                  className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
                  style={{ position: "absolute", right: 10, bottom: 55 }}
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`/user-profile/${postedBy?._id}`}
        className="flex gap-2 mt-2 items-center"
      >
        <img
          className="w-8 h-8 rounded-full object-cover"
          src={postedBy?.image}
          alt="user-profile"
        />
        <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;

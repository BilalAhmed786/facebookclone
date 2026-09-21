import React, { useRef, useState } from "react";
import Coverphoto from "../../images/cover.jpg";
import Profilehoto from "../../images/profilepic.webp";
import { FaCamera, FaPen, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import { backendurl } from "../../baseurls/baseurls";

const Profilecover = ({
  coverPic,
  loginUser,
  id,
  profilePic,
  userinfo,
  friendinfo,
  username,
  setProfilePic,
  setFolloweduser,
  setUserName,
  setpagerender,
  setCoverPic,
  setRender,
}) => {
  const [userformtoggle, toggleUsername] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const profileCoverInputRef = useRef(null);
  const profilepicInputRef = useRef(null);
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB
  const triggerProfileCoverInput = () => {
    profileCoverInputRef.current?.click();
  };

  const triggerProfilepicInput = () => {
    profilepicInputRef.current?.click();
  };

  // Follow / unfollow user
  const handleFollowuser = async () => {
    setIsFollowLoading(true);

    try {
      const result = await axios.put(
        `${backendurl}/api/users/follow/${id}`,
        {
          friendinfo: friendinfo ? friendinfo : false,
        },
        {
          withCredentials: true,
        },
      );

      toast.success(result.data.msg);

      setFolloweduser(result.data.followeduserinfo);
      setpagerender(Date.now());
    } catch (error) {
      console.error("FOLLOW USER ERROR:", error);

      toast.error(error.response?.data || "Unable to update follow status");
    } finally {
      setIsFollowLoading(false);
    }
  };

  // Username change
  const handleUserName = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.put(
        `${backendurl}/api/users/usernameedit`,
        {
          username,
        },
        {
          withCredentials: true,
        },
      );

      toast.success(result.data);

      setpagerender(Date.now());
      toggleUsername(false);
    } catch (error) {
      console.error("USERNAME UPDATE ERROR:", error);

      toast.error(error.response?.data || "Unable to update username");
    }
  };

  // Upload cover picture
  const handleProfileCoverChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Check file size before uploading
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Cover photo is too large. Maximum file size is 50 MB.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploadingCover(true);

    try {
      const response = await axios.post(
        `${backendurl}/api/users/uploadcover`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      toast.success(response.data.msg);
      setCoverPic(response.data.coverpicture.url);
      setpagerender(Date.now());
    } catch (error) {
      console.error("COVER UPLOAD ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to upload cover photo",
      );
    } finally {
      setIsUploadingCover(false);
      event.target.value = "";
    }
  };

  // Upload profile picture
  const handleProfilePictureChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Check file size before uploading
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Profile picture is too large. Maximum file size is 50 MB.");
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploadingProfile(true);

    try {
      const response = await axios.post(
        `${backendurl}/api/users/uploadprofile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        },
      );

      toast.success(response.data.msg);
      setProfilePic(response.data.profilepicture.url);

      setpagerender(Date.now());
      setRender(Date.now());
    } catch (error) {
      console.error("PROFILE UPLOAD ERROR:", error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to upload profile picture",
      );
    } finally {
      setIsUploadingProfile(false);
      event.target.value = "";
    }
  };
  const isFollowing = userinfo.followers?.includes(loginUser);

  return (
    <div>
      {/* Cover photo */}
      <div className="relative group">
        <img
          className="w-full h-72 sm:h-96 object-cover bg-slate-200"
          src={coverPic?.url || Coverphoto}
          alt="Cover"
        />

        {isUploadingCover && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          </div>
        )}

        <input
          style={{ display: "none" }}
          ref={profileCoverInputRef}
          onChange={handleProfileCoverChange}
          type="file"
          accept="image/*"
        />

        {loginUser === id && (
          <button
            type="button"
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur text-slate-700 text-sm font-medium rounded-lg px-3.5 py-2 shadow-md hover:bg-white transition-colors disabled:opacity-60"
            onClick={triggerProfileCoverInput}
            disabled={isUploadingCover}
          >
            <FaCamera className="text-slate-500" />
            Edit cover photo
          </button>
        )}
      </div>

      {/* Avatar + name row */}
      <div className="relative px-4 sm:px-10 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end">
          {/* Avatar */}
          <div className="relative -mt-16 sm:-mt-20 shrink-0">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full ring-4 ring-white bg-slate-100 overflow-hidden shadow-lg">
              <img
                className="w-full h-full object-cover"
                src={profilePic?.url || Profilehoto}
                alt={userinfo.name || "User"}
              />

              {isUploadingProfile && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </div>

            <input
              style={{ display: "none" }}
              ref={profilepicInputRef}
              onChange={handleProfilePictureChange}
              type="file"
              accept="image/*"
            />

            {loginUser === id && (
              <button
                type="button"
                className="absolute bottom-1 right-1 grid place-items-center w-9 h-9 bg-indigo-600 text-white rounded-full ring-2 ring-white shadow hover:bg-indigo-700 transition-colors disabled:opacity-60"
                onClick={triggerProfilepicInput}
                disabled={isUploadingProfile}
                aria-label="Change profile photo"
              >
                <FaCamera size={14} />
              </button>
            )}
          </div>

          {/* Name / username edit / follow */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 sm:mt-0 sm:mb-2 sm:ml-5">
            <div className="relative">
              {!userformtoggle ? (
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {userinfo.name}
                  </h2>

                  {id === loginUser && (
                    <button
                      type="button"
                      className="grid place-items-center w-7 h-7 rounded-full text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors"
                      onClick={() => toggleUsername(true)}
                      aria-label="Edit name"
                    >
                      <FaPen size={12} />
                    </button>
                  )}
                </div>
              ) : (
                <form
                  className="flex items-center gap-2"
                  onSubmit={handleUserName}
                >
                  <input
                    className="text-lg font-semibold text-slate-900 border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    onChange={(e) => setUserName(e.target.value)}
                    value={username}
                    type="text"
                    autoFocus
                  />

                  <button
                    type="submit"
                    className="grid place-items-center w-8 h-8 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    aria-label="Save name"
                  >
                    <FaCheck size={12} />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleUsername(false)}
                    className="grid place-items-center w-8 h-8 rounded-full text-slate-500 hover:bg-slate-100 transition-colors"
                    aria-label="Cancel"
                  >
                    <FaTimes size={12} />
                  </button>
                </form>
              )}
            </div>

            {loginUser !== id && (
              <button
                type="button"
                onClick={handleFollowuser}
                disabled={isFollowLoading}
                className={`mt-3 sm:mt-0 self-start sm:self-auto px-5 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60 ${
                  isFollowing
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                {isFollowing ? "Unfollow" : "+ Follow"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilecover;

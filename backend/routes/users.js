const express = require("express");
const User = require("../models/User");
const Notifications = require("../models/Notification");
const upload = require("../multer/multer");
const cloudinary = require("../utils/cloudinary");
const uploadToCloudinary = require("../utils/uploadToCloudinary");

const router = express.Router();

router.delete("/:id", async (req, res) => {
  try {
    if ((req.params.id = req.body.userId || req.user.isAdmin)) {
      const deleteuser = await User.findByIdAndDelete(req.params.id);

      return res.json("user deleted successfully");
    }
  } catch (error) {
    console.log(error);
  }
});

//All fbusers accept online user
router.get("/allusers", async (req, res) => {
  try {
    const fbusers = await User.find({ _id: { $ne: req.user.userId } });

    if (!fbusers) {
      return res.status(403).json("user not found");
    }

    return res.json(fbusers);
  } catch (error) {
    console.log(error);
  }
});

router.get("/singleuser/:id", async (req, res) => {
  try {
    const finduser = await User.findOne(
      { _id: req.params.id },
      { password: 0, retypepassword: 0 },
    );

    return res.json({ finduser: finduser, loginuser: req.user.userId });
  } catch (error) {
    console.log(error);
  }
});

router.get("/onlineuser", async (req, res) => {
  try {
    const finduser = await User.findOne(
      { _id: req.user.userId },
      { password: 0, retypepassword: 0 },
    ).populate({
      path: "followers",
      select: "name profilepicture status", // Include name, profilepicture, and status fields
      options: {
        sort: { status: -1 }, // Sort followers by status, e.g., online (1) first then offline (0)
      },
    });

    return res.json({ finduser: finduser, loginuser: req.user.userId });
  } catch (error) {
    console.log(error);
  }
});

router.put("/follow/:id", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }); // User to be followed/unfollowed

    const currentUser = await User.findOne({ _id: req.user.userId }); // Logged-in user

    if (!user || !currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.followers.includes(req.user.userId)) {
      // Follow logic
      user.followers.push(req.user.userId);

      currentUser.following.push(req.params.id);

      // Create follow notification
      const notify = new Notifications({
        type: "follow",
        sender: req.user.userId,
        receiver: req.params.id, // Receiver is the user being followed
        isread: req.body?.friendinfo, // Sender is the current user
        msg: "started following you",
      });

      await user.save();
      await currentUser.save();
      await notify.save();

      const userinfo = await Notifications.findOne({
        _id: notify._id,
      }).populate("sender", "name profilepicture status");

      return res.json({
        msg: "Followed successfully",
        following: currentUser.following,
        followeduserinfo: userinfo,
      });
    } else {
      // Unfollow logic
      user.followers.pull(req.user.userId);
      currentUser.following.pull(req.params.id);

      // Create unfollow notification (optional, as many apps do not notify about unfollows)
      const notify = new Notifications({
        type: "follow",
        sender: req.user.userId, // Sender is the current user
        receiver: req.params.id, // Receiver is the user being unfollowed
        isread: req.body?.friendinfo,
        msg: "stopped following you",
      });

      await user.save();
      await currentUser.save();
      await notify.save();

      const userinfo = await Notifications.findOne({
        _id: notify._id,
      }).populate("sender", "name profilepicture status");

      return res.json({
        msg: "Unfollowed successfully",
        following: currentUser,
        followeduserinfo: userinfo,
      });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({
        error: "An error occurred while trying to follow/unfollow the user",
      });
  }
});

router.post("/uploadcover", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Delete old cover picture from Cloudinary
    if (user.coverpicture?.publicId) {
      await cloudinary.uploader.destroy(user.coverpicture.publicId);
    }

    // Upload new cover picture
    const uploadedFile = await uploadToCloudinary(
      req.file.buffer,
      "facebook/profilecover",
    );

    user.coverpicture = {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
    };

    await user.save();

    return res.json({
      msg: "Cover pic updated",
      coverpicture: user.coverpicture,
    });
  } catch (error) {
    console.error("COVER PICTURE UPLOAD ERROR:", error);

    return res.status(500).send("Error uploading cover picture");
  }
});

router.post("/uploadprofile", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Upload new profile picture
    const uploadedFile = await uploadToCloudinary(
      req.file.buffer,
      "facebook/profilepicture"
    );

    // Delete old profile picture after successful upload
    if (user.profilepicture?.publicId) {
      await cloudinary.uploader.destroy(
        user.profilepicture.publicId
      );
    }

    user.profilepicture = {
      url: uploadedFile.secure_url,
      publicId: uploadedFile.public_id,
    };

    await user.save();

    return res.json({
      msg: "Profile pic updated",
      profilepicture: user.profilepicture,
    });
  } catch (error) {
    console.error("PROFILE PICTURE UPLOAD ERROR:", error);

    return res.status(500).send("Error uploading profile picture");
  }
});

router.put("/usernameedit", async (req, res) => {
  if (!req.body.username) {
    return res.status(400).json("field is required");
  }

  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.user.userId },
      { name: req.body.username },
    );

    if (!user) {
      return res.status(404).json("something wrong happend");
    }

    return res.json("update user name succesfully");
  } catch (error) {
    console.log(error);
  }
});

router.put("/userinfoedit", async (req, res) => {
  const { city, from, relationship } = req.body;

  if (!city || !from || !relationship) {
    return res.status(400).json("All fields required");
  }

  try {
    const userinfo = await User.findByIdAndUpdate(
      { _id: req.user.userId },
      { city, from, relationship },
    );

    if (!userinfo) {
      return res.status(404).json("user is not found");
    }

    return res.json("userinfo updated");
  } catch (error) {
    console.log(error);
  }
});

router.get("/followers", async (req, res) => {
  try {
    const followers = await User.find(
      { _id: { $in: req.query.follow } },
      { name: 1, profilepicture: 1 },
    );

    if (!followers) {
      return res.status(404).json("followers not found");
    }

    return res.json(followers);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

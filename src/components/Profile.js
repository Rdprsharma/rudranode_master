import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthService from "../services/auth.service";
import { Alert } from "bootstrap";
const API_URL = "http://localhost:8080/api/auth/";
const Profile = () => {
  const currentUser = AuthService.getCurrentUser();
  const token = currentUser.accessToken;
  const [uservideos, setVideos] = useState([]);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showVideoPopup, setShowVideoPopup] = useState(false);
  const [bio, setBio] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(API_URL+`getvideos/${currentUser.id}`,config);
        setVideos(response.data);
      } catch (error) {
        setError(error.response ? error.response.data.message : "Server error");
      }
    };
    fetchVideoDetails();
  }, [currentUser.id]);

  const handleAddBioClick = () => {
    console.log("sdfsdf");
    setShowPopup(true);
  };

  const handleSaveBio = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(API_URL+'updatebio', {
        user_id: currentUser.id,
        bio: bio,
      },config);
      alert("Bio updated Successfully.");
      setShowPopup(false);
      window.location.reload();
    } catch (error) {
      console.error("Error saving bio:", error.response ? error.response.data.message : error.message);
    }
  };

  const handleAddVideoClick = () => {
    setShowVideoPopup(true);
  };

  const handleSaveVideo = async () => {
    const formData = new FormData();
    formData.append('user_id', currentUser.id);
    formData.append('title', videoTitle);
    formData.append('description', videoDescription);
    formData.append('video', videoFile);

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(API_URL+'uploadVideo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log("Video saved:", response.data);
      setShowVideoPopup(false);
      window.location.reload();
    } catch (error) {
      console.error("Error saving video:", error.response ? error.response.data.message : error.message);
    }
  };
  const handlePopupClose = () => {
    setShowPopup(false);
    setShowVideoPopup(false);
  };

  const videoItems = [];
  if (uservideos && Array.isArray(uservideos.videos) && uservideos.videos.length > 0) {
    for (let i = 0; i < uservideos.videos.length; i++) {
        videoItems.push(
            <li key={uservideos.videos[i]._id}>
                <div className="col-sm-4">
                    <h3>{uservideos.videos[i].title}</h3>
                    <p>{uservideos.videos[i].description}</p>
                    <div style={{ height: '100px', overflow: 'hidden' }}>
                        <video controls style={{ height: '100%', width: 'auto' }} src={`http://localhost:8080/${uservideos.videos[i].video}`} />
                    </div>
                </div>
            </li>
        );
    }
}

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{uservideos.firstname}</strong> Profile
        </h3>

        <div className="form-group">
          <button className="btn btn-primary btn-block" style={{ width: 'inherit' }} onClick={handleAddBioClick}>Add Bio</button>
        </div>
      </header>
      <p>
        <strong>Name:</strong> {uservideos.firstname} {uservideos.lastname}
      </p>
      <p>
        <strong>Email:</strong> {uservideos.email}
      </p>
      <p>
        <strong>Mobile:</strong> {uservideos.mobile}
      </p>
      <p>
        <strong>Bio:</strong> {uservideos.bio}
      </p>
      <div>
        <h2>Video Details</h2>
        <div className="form-group">
          <button className="btn btn-primary btn-block" style={{ width: 'inherit' }} onClick={handleAddVideoClick}>Upload video</button>
        </div>
        <div>
          {videoItems.length > 0 ? (
            <ul>
              {videoItems}
            </ul>
          ) : (
            <p>No videos found for this user.</p>
          )}
        </div>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add Bio</h2>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              cols="50"
            />
            <br />
            <button className="btn btn-success" onClick={handleSaveBio}>Save</button>
            <button className="btn btn-secondary" onClick={handlePopupClose}>Close</button>
          </div>
        </div>
      )}

      {/* Video Popup */}
      {showVideoPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add Video</h2>
            <input
              type="text"
              placeholder="Title"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
            />
            <br />
            <textarea
              placeholder="Description"
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              rows="4"
              cols="50"
            />
            <br />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
            />
            <br />
            <button className="btn btn-success" onClick={handleSaveVideo}>Save</button>
            <button className="btn btn-secondary" onClick={handlePopupClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

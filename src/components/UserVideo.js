import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthService from "../services/auth.service";
const API_URL = "http://localhost:8080/api/auth/";

const UserVideo = () => {
    const [content, setContent] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
          try {
            const token = AuthService.getCurrentUser().accessToken;
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
            const response = await axios.get(API_URL+`getAllData`,config);
            setContent(response.data);
          } catch (error) {
            setError(error.response ? error.response.data.message : "Server error");
          }
        };
        fetchAllData();
      }, []);
    console.log(content);
    
    const videoItems = content.map((user) => (
        <div key={user._id}>
            <div class="row">
                <div class="col-sm-1">
                <div style={{ height: '30px', overflow: 'hidden' }}>
                    <img src="//ssl.gstatic.com/accounts/ui/avatar_2x.png" alt="profile-img" style={{ height: '100%', width: 'auto' }} className="profile-img-card"/>
                </div>
                </div>
                <div class="col-sm-1">
                <h2>{user.firstname}</h2>
                </div>
            </div>
            <ul>
            <div class="row">
                {user.videos.map((video, index) => (
                    <div class="col-sm-2">
                    <div style={{ height: '100px', overflow: 'hidden' }}>
                    <video controls style={{ height: '100%', width: 'auto' }} src={`http://localhost:8080/${video.video}`} />
                    </div>
                    </div>
                ))}
            </div>
            </ul>
        </div>
    ));
    return (
        <div className="container">
            {error && <div className="error">{error}</div>}
            {videoItems.length > 0 ? (
                <ul>{videoItems}</ul>
            ) : (
                <p>No videos available.</p>
            )}
        </div>
    );
};

export default UserVideo;

import { authService, dbService } from "fBase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState("");
  const navigate = useNavigate();
  const onLogOutClick = () => {
    authService.signOut();
    navigate("/");
  };

  const getMyFweets = async () => {
    const fweets = await dbService
      .collection("fweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt")
      .get();
    console.log(fweets.docs().map((doc) => doc.data));
  };

  useEffect(() => {
    getMyFweets();
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display Name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

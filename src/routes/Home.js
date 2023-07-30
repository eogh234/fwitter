import Fweet from "components/Fweet";
import { dbService, storageService } from "fBase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  const [fweet, setFweet] = useState("");
  const [fweets, setFweets] = useState([]);
  const [attachment, setAttachment] = useState("");

  useEffect(() => {
    dbService.collection("fweets").onSnapshot((snapshot) => {
      const fweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFweets(fweetArray);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const fweetObj = {
      text: fweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("fweets").add(fweetObj);
    setFweet("");
    setAttachment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setFweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;

    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const onClearAttachment = () => setAttachment("");

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={fweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value={"Fweet"} />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      <div>
        {fweets.map((fweet) => (
          <Fweet
            key={fweet.id}
            fweetObj={fweet}
            isOwner={fweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;

import Fweet from "components/Fweet";
import { dbService } from "fBase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [fweet, setFweet] = useState("");
  const [fweets, setFweets] = useState([]);

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
    await dbService.collection("fweets").add({
      text: fweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setFweet("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setFweet(value);
  };

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
        <input type="submit" value={"Fweet"} />
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

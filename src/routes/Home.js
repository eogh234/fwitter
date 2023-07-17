import { dbService } from "fBase";
import React, { useState } from "react";

const Home = () => {
    const [fweet, setFweet] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("fweets").add({
            fweet: fweet,
            createdAt: Date.now(),
        });
        setFweet("");
    };
    const onChange = (event) => {
        const { target: { value } } = event;
        setFweet(value);
    }
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
                <input type="submit" value={"fweet"} />
            </form>
        </div>);
}

export default Home;
import { dbService } from "fBase";
import React, { useEffect, useState } from "react";

const Home = () => {
    const [fweet, setFweet] = useState("");
    const [fweets, setFweets] = useState([]);
    const getFweets = async () => {
        const dbFweets = await dbService.collection("fweets").get();
        dbFweets.forEach((document) => {
            const fweetObject = {
                ...document.data(),
                id: document.id,
            }
            setFweets((prev) => [fweetObject, ...prev]);
        });
    }

    useEffect(() => {
        getFweets();    
    }, []);

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
            <div>
                {fweets.map((fweet) => (
                    <div key={fweet.id}>
                        <h4>{fweet.fweet}</h4>
                    </div>
                ))}
            </div>
        </div>);
}

export default Home;
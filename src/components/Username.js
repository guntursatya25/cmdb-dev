import { useState, useEffect } from "react";

const UsernameDisplay = () => {
    const [username, setUsername] = useState("Not available");

    useEffect(() => {
        // Jalankan hanya di browser
        const storedUsername = JSON.parse(localStorage.getItem("username"));
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []); 

    return <p>{username}</p>;
};

export default UsernameDisplay;

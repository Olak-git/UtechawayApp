//Auth token we will use to generate a meeting and connect to it
// export const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJlMWY5YmI2MS1iMTViLTRiNmYtOTRhZC0wNmRiNjU2MmQ5ODUiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTY4NDQzMTAyNSwiZXhwIjoxODQyMjE5MDI1fQ.8JY1Ch5bgwSzV0DSBQpYGaCZ8zjZ8r1yz9OO4JIavo4";

// API call to create meeting
export const createMeeting = async ({ token }) => {

    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
        method: "POST",
        headers: {
            authorization: `${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });
    
    //Destructuring the roomId from the response
    const { roomId } = await res.json();
    return roomId;
};
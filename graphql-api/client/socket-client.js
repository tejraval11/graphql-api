const io = require("socket.io-client");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt the user for the JWT token
rl.question("Please enter your JWT token: ", (token) => {
  // Clean the token to remove "Bearer " if present
  const cleanToken = token.replace("Bearer ", "").trim();

  // Ensure the token is not empty before proceeding
  if (!cleanToken) {
    console.error("Error: Token is required!");
    rl.close();
    return;
  }

  // Connect to the server using the provided token
  const socket = io("http://localhost:4000", {
    auth: {
      token: cleanToken, // Pass the JWT token for authentication
    },
  });

  // Handle successful connection
  socket.on("connect", () => {
    console.log("Connected to server:", socket.id);

    // Join a room (you can change the room name if needed)
    socket.emit("joinRoom", "testRoom");
    console.log("Joined room: testRoom");

    // Listen for room messages
    socket.on("roomMessage", (data) => {
      console.log(`Message from ${data.from}: ${data.message}`);
    });

    // Ask the user for input and send messages to the room
    rl.on("line", (input) => {
      if (input.trim()) {
        socket.emit("sendMessage", {
          roomName: "testRoom",
          message: input,
        });
      } else {
        console.log("Message cannot be empty.");
      }
    });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("Disconnected from server");
    rl.close(); // Close the readline interface on disconnect
  });

  // Handle connection error
  socket.on("connect_error", (err) => {
    console.error("Connection error:", err.message);
    rl.close(); // Close the readline interface on error
  });
});

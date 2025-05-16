const gameTicksPerSecond = 20; // Adjust as needed

let socket; // WebSocket instance
let socketConnectingInterval; // Interval for reconnection attempts
let isConnectingOrConnected = false; // Connection state tracker

let generationCount = -1;
let dataList = [];
let lastFrameTime = Date.now();

// fetch data from ../gamestate.json into dataList
fetch("../gamestate.json")
  .then((response) => response.json())
  .then((data) => {
    dataList = data;
    console.log("Data loaded:", dataList);
    parseData(dataList);
  })
  .catch((error) => {
    console.error("Failed to load game state:", error);
    setConnectionStatus("connection_fail");
  });
// ========================================
// websockets
/**
 * Establishes and manages a WebSocket connection to receive real-time game updates.
 *
 * Handles connection state, automatic reconnection on failure, and updates UI elements to reflect connection status and game state. Incoming messages are parsed and appended to the game data queue.
 *
 * @remark Prevents multiple simultaneous connection attempts and automatically retries connection every 500ms if disconnected.
 */

function connectWebSocket() {
  // Prevent multiple connections
  if (isConnectingOrConnected) return;

  // Mark as connecting
  isConnectingOrConnected = true;

  // Initialize or reinitialize the WebSocket connection
  socket = new WebSocket("ws://localhost:3000?id=frontend");
  setConnectionStatus("connecting");

  socket.addEventListener("open", (event) => {
    console.log("WebSocket connection established");
    setConnectionStatus("connected");

    // reset frontend
    generationCount = -1; // Reset generation counter
    dataList = [];
    lastFrameTime = Date.now();

    updateGenerationCount(generationCount); // Update UI with the reset move counter
    toggleEndScreen(null); // Hide the winner upon reconnection

    if (socketConnectingInterval) {
      clearInterval(socketConnectingInterval);
      socketConnectingInterval = null;
    }
    // Mark as connected
    isConnectingOrConnected = true;
  });

  socket.addEventListener("message", (message) => {
    const data = JSON.parse(message.data);
    // console.log("Received from server:", data);
    dataList.push(data);
  });

  socket.addEventListener("close", (message) => {
    console.log("WebSocket connection closed:", message);
    // Reset connection state to allow reconnection attempts
    isConnectingOrConnected = false;
    // Check if a reconnection attempt isn't already scheduled before setting a new interval
    if (!socketConnectingInterval) {
      socketConnectingInterval = setInterval(connectWebSocket, 500);
    }
    setConnectionStatus("connection_fail");
  });

  socket.addEventListener("error", (error) => {
    console.error("WebSocket error:", error);
    setConnectionStatus("connection_fail");
    // Close the socket if an error occurs to trigger the 'close' event listener
    // and thereby attempt reconnection. This also implicitly handles the 'close' event.
    socket.close();
  });
}

// Initially it is not connected
setConnectionStatus("connection_fail");

// Initial connection attempt
connectWebSocket();

// ========================================
// utility
/**
 * Shows or hides the end screen displaying the game winner or a draw.
 *
 * If {@link data} is provided, displays the winner's name or "GAME DRAW" for a draw, and fades in the winner container. If {@link data} is null, fades out and hides the winner container.
 *
 * @param {Object|null} data - Game result data containing a `winner` property, or null to hide the end screen.
 */

function toggleEndScreen(data) {
  const winnerContainer = document.querySelector(".winner_container");
  const winnerNameElem = document.querySelector(".winner_container h1");
  const winnerTopTextElem = document.querySelector(".winner_container h2");

  if (data !== null) {
    if (data.winner === -1) {
      winnerTopTextElem.style.display = "none";
      winnerNameElem.textContent = "GAME DRAW";
    } else {
      winnerTopTextElem.style.display = "block";
      winnerNameElem.textContent = data.winner;
    }

    winnerContainer.style.opacity = "0";
    winnerContainer.style.display = "grid";
    setTimeout(() => {
      winnerContainer.style.opacity = "1";
      winnerContainer.style.transition = "opacity 1.5s";
    }, 0);
  } else {
    winnerContainer.style.opacity = "0";
    winnerContainer.style.transition = "opacity 0.5s";
    setTimeout(() => {
      winnerContainer.style.display = "none";
      winnerNameElem.textContent = "";
    }, 500);
  }
}

/**
 * Updates the displayed generation count in the UI.
 *
 * If {@link generationCount} is falsy, displays a placeholder instead.
 *
 * @param {number} generationCount - The current generation number to display.
 */
function updateGenerationCount(generationCount) {
  document.querySelector(".generation_number").textContent = `Generation: ${
    generationCount || "####"
  }`;
}

/**
 * Updates the UI to reflect the current WebSocket connection status.
 *
 * Adjusts the text and CSS classes of the connection status element based on the provided status value.
 *
 * @param {string} status - The current connection status ("connection_fail", "connected", or "connecting").
 */
function setConnectionStatus(status) {
  const connectionStatus = document.querySelector(".connection_status");
  if (!connectionStatus) return;
  const CONNECTION_FAIL = "connection_fail";
  const CONNECTION_SUCCESS = "connection_success";
  const CONNECTION_PING = "connection_pinging";
  connectionStatus.classList.remove(
    ...[CONNECTION_FAIL, CONNECTION_SUCCESS, CONNECTION_PING]
  );

  if (!status || status === "connection_fail") {
    connectionStatus.textContent = "Not connected to server";
    connectionStatus.classList.add(CONNECTION_FAIL);
  } else if (status === "connected") {
    connectionStatus.textContent = "Connected to server";
    connectionStatus.classList.add(CONNECTION_SUCCESS);
  } else if (status === "connecting") {
    connectionStatus.textContent = "Connecting...";
    connectionStatus.classList.add(CONNECTION_PING);
  }
}

// ========================================
// game logic
/**
 * Processes and displays the next game state update at a fixed tick rate.
 *
 * Uses `requestAnimationFrame` to schedule updates, advancing the game state by parsing the next item in {@link dataList} if enough time has elapsed since the last update.
 */

function gameLoop() {
  let now = Date.now();
  let elapsed = now - lastFrameTime;

  // Check if it's time for the next tick
  if (elapsed > 1000 / gameTicksPerSecond) {
    lastFrameTime = now - (elapsed % (1000 / gameTicksPerSecond));

    // console.log(dataList.length);
    if (dataList.length > 0) {
      parseData(dataList.shift());
      // console.log(dataList.length);
    }
  }

  requestAnimationFrame(gameLoop);
}

// Start the game loop
/**
 * Updates the UI and game state based on the provided game data.
 *
 * Updates the generation counter, team information, and game board display. If a winner is present in the data, displays the end screen.
 *
 * @param {Object} data - The current game state, including generation count, player information, and winner status.
 */

function parseData(data) {
  console.log("Processing game state:", data);

  // Update move counter
  generationCount = data.generationCount || generationCount;
  updateMoveCount(generationCount);

  // Update team info
  const teamInfoContainerElems = document.querySelectorAll(".team_info");
  if (data.players.length === 0) {
    // Reset team info if no players are present
    teamInfoContainerElems.forEach((elem) => {
      elem.querySelector(".team_name").textContent = "Team ####";
      elem.querySelector(".team_cells").textContent = "Cells: ####";
    });
  } else {
    data.players.forEach((player, index) => {
      teamInfoContainerElems[index].querySelector(".team_name").textContent =
        player.name;

      teamInfoContainerElems[index].querySelector(".team_cells").textContent =
        "Cells: " + player.body.length;
    });
  }

  // Update board
  window.boardUtils.updateGrid(data);

  // If winner is present, show the end screen
  if (data.winner) {
    toggleEndScreen(data);
    return;
  }
}

// ========================================
// particles.js background
// ========================================

particlesJS.load(
  "particles-js",
  "./assets/particlesjs-config.json",
  function () {
    console.log("callback - particles.js config loaded");
  }
);

// ========================================
// URL params (?mode=debug or ?mode=finals)
// ========================================

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("mode") === "debug") {
  console.log("Debug mode is ON");

  // show all debug-only elements
  document
    .querySelectorAll(".debug-only")
    .forEach((elem) => elem.classList.remove("debug-only"));
} else if (urlParams.get("mode") === "finals") {
  console.log("Finals mode is ON");

  // show all finals-only elements
  document
    .querySelectorAll(".finals-only")
    .forEach((elem) => elem.classList.remove("finals-only"));
}

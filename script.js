  const playerContainer = document.getElementById("#all-players-container");
  const newPlayerFormContainer = document.getElementById("#new-player-form");

  // Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
  const cohortName = "2302-acc-pt-web-pt-d";
  // Use the APIURL variable for fetch requests
  const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

  const fetchAllPlayers = async () => {
    try {
      const response = await fetch(APIURL + "players");
      const players = await response.json();
      return players;
    } catch (err) {
      console.error("Uh oh, trouble fetching players!", err);
    }
  };

  const fetchSinglePlayer = async (playerId) => {
    try {
      const response = await fetch(APIURL + "players" + playerId);
      const player = await response.json();
      return player;
    } catch (err) {
      console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
  };

  const addNewPlayer = async (playerObj) => {
    try {
      const response = await fetch(APIURL + "players", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(playerObj),
      });
      const newPlayer = await response.json();
      return newPlayer;
    } catch (err) {
      console.error("Oops, something went wrong with adding that player!", err);
    }
  };

  const removePlayer = async (playerId) => {
    try {
      const response = await fetch(APIURL + "players" + playerId, {
        method: "DELETE",
      });
      const result = await response.json();
      return result;
    } catch (err) {
      console.error(
        `Whoops, trouble removing player #${playerId} from the roster!`,
        err
      );
    }
  };

  const renderAllPlayers = (playerList) => {
    try {
      if (Array.isArray(playerList.players)) {
        console.log(playerList.players);

        let playerContainerHTML = "";
        playerList.players.forEach((player) => {
          playerContainerHTML += `
            <div class="player-card">
              <h2>${player.name}</h2>
              <p>${player.breed}</p>
              <p>${player.teamId}</p>
              <p>${player.status}</p>
              <img src="${player.imageUrl}" alt="${player.name}>
              <button class="details-button button" data-player-id="${player.id}"</button>
              <button class="details-button" data-player-id="${player.id}">See details</button>

              <button class="remove-button" data-player-id="${player.id}">Remove from roster</button>
            </div>
          `;
        });
      playerContainer.innerHTML = playerContainer;

      // Add event listeners to buttons in each player card
      const detailsButtons = document.querySelectorAll(".details-btn");
      detailsButtons.forEach((button) => {
        button.addEventListener("click", async () => {
          const playerId = button.dataset.playerId;
          const player = await fetchSinglePlayer(playerId);
          console.log(player);
        });
      });

      const removeButtons = document.querySelectorAll(".remove-button");
      removeButtons.forEach((button) => {
        button.addEventListener("click", async () => {
          const playerId = button.dataset.playerId;
          await removePlayer(playerId);
          const updatedPlayers = await fetchAllPlayers();
          renderAllPlayers(updatedPlayers);
        });
      });
    } catch (err) {
      console.log("Uh oh, trouble rendering players!", err);
    }
  };

  const renderNewPlayerForm = () => {
    try {
      const formHTML = `
        <form id="add-player-form">
          <input type="text" id="name-input" placeholder="Name" required>
          <input type="text" id="position-input" placeholder="Position" required>
          <input type="text" id="team-input" placeholder="Team" required>
          <button type="submit">Add Player</button>
        </form>
      `;
      newPlayerFormContainer.innerHTML = formHTML;

      const addPlayerForm = document.getElementById("add-player-form");
      addPlayerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const nameInput = document.getElementById("name-input");
        const positionInput = document.getElementById("position-input");
        const teamInput = document.getElementById("team-input");
        const playerObj = {
          name: nameInput.value,
          position: positionInput.value,
          team: teamInput.value,
        };
        await addNewPlayer(playerObj);
        nameInput.value = "";
        positionInput.value = "";
        teamInput.value = "";
        const updatedPlayers = await fetchAllPlayers();
        renderAllPlayers(updatedPlayers);
      });
    } catch (err) {
      console.error("Uh oh, trouble rendering the new player form!", err);
    }
  };

  const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
    renderNewPlayerForm();
  };

  init();

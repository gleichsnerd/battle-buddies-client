# Battle Bots Lesson Plan

## 0. Prologue

1. Coach introduction

2. Camper introduction

  a. Name
  b. Grade
  c. Programming experience
  d. One cool fact

2. Overview of what we're building

  a. The game
    - "Hunger Games" on a grid
    - Players can either move, attack, or defend every turn
    - Turns are time limited; every one submits a turn within a two second window
    - The faster you submit, the better
    - Last one standing wins

  b. The system
    - Game Server
      - Register player, submit turns via REST calls against an API
    - Display layer
      - Ember.js app that queries the server to observe the game
    - Client
      - What we're building today!
      - Javascript, ES6, using npm and node packages

  c. Dev environment setup
    - Node: www.nodejs.org
    - Text editor: atom.io


## 1. Hello World: Setting up the project

1. Create the project in terminal
    
    a. Initialize npm
    ```
    npm init
      * name: battle-buddies
      * version: default
      * description: default
      * entry point: default
      * test command: default
      * git repository: default
      * keywords: default
      * author: Your name or username
      * license: default
    ```
    
    b. Add start script to package.json
    ```
    "scripts": {
        "start": "node index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    ```
    
2. Install request-promise-native for later
    ```
    npm install --save request
    npm install --save request-promise-native
    ```
    
3. Create index.js
  
    * This is the entry point for our application and where we can configure and launch the rest of the code

    ```javascript
    /**
     * index.js
     */
     
    console.log("Hello world!");
    ```
    
4. Run project
    ```
    npm start
    ```
    
## 2. Setting up the Game Server and Service Layer

1. Create game-server.js

    * Our game server will handle the general routing and flow of our application. Here, we will store the data we need to play the game and call the functions necessary to calculate our next best turn and send it to the back end, but for now let's just get the class setup.

    ```javascript
    /**
     * GameServer
     */
     
    class GameServer {
        constructor(url) {
            this.url = url;
        }
        
        start() {
            console.log("Starting server!");
        }
    }
    
    module.exports = GameServer;
    ```
2. Incorporate GameServer into index.js

    * Node lets us export files and include them elsewhere via module and require. In our GameServer, we exported the class via 'module.exports', and now when we need it elsewhere, we assign a variable to the return of our require function call.

    ```javascript
    /**
     * index.js
     */

    // Imports
    let GameServer = require('./game-server');

    // Run code
    let url = "localhost:8282";
    let server = new GameServer(url);

    server.start();
    ```
    
3. Create request-service.js

    * We want to keep our code for REST requests and response parsing separate from our server logic, so we put it in what's called a service. Besides our initial configuration, the service layer has no knowledge of anything outside of it; it doesn't track game state, or make turns, etc. 

    ```javascript
    /**
     * RequestService
     */

    // Imports
    let request = require('request-promise-native');
    
    class RequestService {
        constructor(url) {
            this.url = url;
            this.timeout = 600000;
        }
    }

    module.exports = RequestService;
    ```

4. Implement GET and parsing response

    * Talk about REST GETs and POSTs
    * The messages we get back from the server are formatted as follows:

    ```
    {
      success: boolean,
      content: "Return content, which can be a string or object"
    }
    ```

    * We'll start with GET since it's the simpler of the two. We create our params using the endpoint passed in and the url we configured it with. We then use the require-promise-native package to send our parameters, and then wait for the reponse. Once it's finished, we either have a successful or unsuccessful result, which we then have to parse for the data or the error message.

    ```javascript
    sendGET(endpoint) {
        let params = {
          method: 'GET',
          uri: `${this.url}/${endpoint}`,
          timeout: this.timeout
        };

        return request(params).then(
            (response) => {
                return this.parseResponse(response);
            },
            (error) => {
                return this.parseResponse(error.response.body);
            }
        );
    }
    
    parseResponse(response) {
        let json = JSON.parse(response);
    
        if(!json.success) {
          throw json.content.message || json.content;
        }
    
        return json.content;
    }
    ```

    * Talk about promises

5. Add RequestService to GameServer

    * Since our service is stateless, we can create it once and pass it to whomever needs it    

    ```javascript
    // Imports
    let RequestService = require('./request-service');

    class GameServer {
        constructor(url) {
            this.url = url;
            this.RS = new RequestService(url);
        }

        start() {
            console.log("Starting server!");
            return this.RS.getHomepage();
        }
    }

    module.exports = GameServer;
    ```
    
6. Write home page endpoint in RequestService

    * Because we already wrote sendGET which gives us back the response, writing a request against an endpoint is as simple as this.
    * '/' returns a JSON object with a property "message". Let's extract that from the response using promises.

    ```javascript
    getHomepage() {
        return this.sendGET('/').then(response => {
          return response.message;
        });
    }
    ```
    
7. Catch any throws in index.js

    * Remember the "throw" we put into parseResponse? We should catch that somewhere so we can print the error we threw. If we put a catch on the function to start the server (which returns a promise), then any error that isn't caught anywhere else can bubble up to this catch function and be printed to the console.

    ```javascript
    server.start().catch(error => {
        console.error(error.toString());
    });
    ```

## 3. Register a Player

1. Make the player class, player.js

    * Now that we have a simple GET request setup, let's get ready to register our player.
    * To get started, let's make our player class. Players have a multitude of properties available for you to use, but to start with we'll use the following:
    
    * id: this is the unique, private identifier we use to distinguish you from the rest of the players
    * publicId: this is the unique, public identifier you can use to target one person later on
    * name: this is the display field we'll use to identify you on the display server
    * hp: your hit points
    * defense: your defense points, or the damage you can block before your shield breaks
    * position: your current position

    ```javascript
    /**
     * Player
     */

    class Player {
      constructor(params) {
        this.id = params.id;
        this.publicId = params.public_id;
        this.name = params.name;
        this.hp = params.hp;
        this.defense = params.defense;
        this.position = params.position;
      }
    }
    ```

2. Add POST to RequestService

3. Create createPlayer call

4. Save player to GameServer

## 4. Turning things around

1. Create turn-service.js

2. Add turn service to GameServer

3. Add turn to RequestService

4. Add move to TurnService

3. Implement first turn (random move)

## 5. Feedback look

1. Making the game.js

2. Parsing the turn results

3. Making turns based on the board

## 6. Broadening the horizons

1. Add attack turn to TurnService

2. Add block turn to TurnService
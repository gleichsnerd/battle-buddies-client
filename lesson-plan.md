# Battle Bots Lesson Plan

## 0. What you need to get started

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
    ```javascript
    /**
     * RequestService
     */
    
    class RequestService {
        constructor(url) {
            this.url = url;
            this.timeout = 600000;
        }
    }

    module.exports = RequestService;
    ```
4. Implement GET and parsing response
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
5. Add RequestService to GameServer
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
    ```javascript
    getHomepage() {
        return this.sendGET('/').then(response => {
          return response.message;
        });
    }
    ```
    
7. Catch any throws in index.js
    ```javascript
    server.start().catch(error => {
        console.error(error.toString());
    });
    ```

## 3. Register a Player

1. Make the player class, player.js
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
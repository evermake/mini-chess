# Mini-chess socketio server

This service is responsible for playing the actual game of chess :)

### Stack

Build with socket.io and prisma

## Building and running

### Build

Assuming you are in the directory of this README.md

```
$ cd ../../
$ pnpm i
$ cd server/
$ pnpm prisma:generate
$ pnpm build:socketio
```

### Running

Assuming you are in the directory of this README.md

```
$ cd ../
$ pnpm start:socketio
```

Make sure to set environment variables like in ../.env.template

## How to connect

Connect via socket.io and pass session token to `headers['Authentication']`

server-http service provides client with session token

# API

## Events, emitted by the server:

### exception

This is the general exception event.
Client should listen to it to receive information
on what is wrong with the request.

Args:

```
{
    message: string
}
```

### game_state

This event is emitted when a move is made
and when a player connects to the lobby.
It is also possible to request emission of game_state event
(Read request_game_state).

The status 'WHITE' indicates that white has won,
while status 'BLACK' indicates that black has won.

Args:

```
{
    fen: string,
    timeLimitW: number, // In milliseconds
    timeLimitB: number, // In milliseconds
    status: 'IN_PROGRESS' | 'DRAW' | 'WHITE' | 'BLACK',
    isPaused: boolean,
    turn: 'white' | 'black'
}
```

### pause_request

This event is emitted when an opponent requests a pause.
It includes pauseOffer token, which must be used to confirm a pause
(Read confirm_pause).

Args:

```
{
    pauseOffer: string
}
```

### game_paused

This event is emitted when a player confirms a pause request
(Read confirm_pause).

No arguments.

### game_unpaused

This event is emitted when a player unpauses a game
(Read unpause).

No arguments.

### draw_request

This event is emitted when an opponent requests a draw.
It includes drawOffer token, which must be used to confirm a draw
(Read confirm_draw).

Args:

```
{
    drawOffer: string
}
```

### player_connected

This event is emitted when a player connects to the lobby.

Args:

```
{
    playerId: number,
    side: 'white' | 'black'
}
```

### player_disconnected

This event is emitted when a player disconnects from the lobby.

Args:

```
{
    playerId: number,
    side: 'white' | 'black'
}
```

### game_over

This event is emitted when the game ends.

The status 'WHITE' indicates that white has won,
while status 'BLACK' indicates that black has won.

Args:

```
{
    status: 'DRAW' | 'WHITE' | 'BLACK'
}
```

### lobby_info

This event is emitted when a client connects to the lobby.
It is also possible to request emission of lobby_info event
(Read request_lobby_info).

Args:

```
{
    lobbyId: number,
    whiteId: number | null, // null indicates that white player has not connected yet.
    blackId: number | null, // null indicates that black player has not connected yet.
    timeIncrement: number // In milliseconds
}
```

### self_info

This event is emitted when a client connects to the lobby.
It is also possible to request emission of self_info event
(Read request_self_info).

Args:

```
{
    playerId: number,
    side: 'white' | 'black',
    lobbyId: number
}
```

## Events that server listens to:

### make_move

Args:

```
{
    from: string, 
    to: string, 
    promotion?: string 
}
```

### request_game_state

This forces server to check for player timeouts
and to emit game_state event to the client

No arguments.

### request_lobby_info

This forces server to emit lobby_info event to the client.

No arguments.

### request_self_info

This forces server to emit self_info event to the client.

No arguments.

### request_pause

This event requests to put the game on pause.

Internally it sends pause_request event to the opponent,
and if the opponent agrees to pause the game, the game gets paused.

No arguments.

### confirm_pause

This event pauses the game. It expects pauseOffer received from pause_request event.

Args:

```
{
    pauseOffer: string
}
```

### unpause

This event immediately unpauses the game.

No arguments.

### request_draw

This event requests to end the game with a draw.

Internally it sends draw_request event to the opponent,
and if the opponent agrees to a draw, the game ends.

No arguments.

### confirm_draw

This event ends the game with a draw. It expects drawOffer received from draw_request event.

Args:

```
{
    drawOffer: string
}
```

### surrender

This events ends the game immediately. The callee loses the game

No arguments.

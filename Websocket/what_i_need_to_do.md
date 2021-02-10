MVP

FRONTEND
- Timings for player turns - use setTimout to automatically fold after 10 seconds
- Graphic for FOCUS on current player
- Auto disconnect and rejoin for players


BACKEND
- Turn into a flop, turn, river game - replace showdown /
- Refactor into how many funcs? 3
  - Connect
  - Disconnect
  - Game functionality
- second table for previous games
- new table for previous games
- GID is new ascending primary key on games table


BUGS
<!-- - round winner bug ## was bug in usespring -->
<!-- - when its a draw - unhashable list
-   File "C:\Users\Edward\heads-up-poker\Websocket\App\Poker\hand.py", line 88, in calculate_winner
    winning_cards = list(set(list(best_one[2] + best_two[2])))
TypeError: unhashable type: 'list' -->
- play round button appears when player still in hand. solve with a new stage?



READING
- for game db https://serialized.net/2020/09/multiplayer/


NICE TO HAVES
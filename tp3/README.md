# SGI 2023/2024 - TP3

## Group: T05G04

| Name             | Number    | E-Mail             |
| ---------------- | --------- | ------------------ |
| Mafalda Costa    | 202006417 | up202006417@up.pt  |
| Mariana Carvalho | 202007620 | up202007620@up.pt  |


----
## Project information

- Main strong points
  - Shortcut power up
  - Creative scenario
  - Menu interaction
  - Spritesheets

- Scene description
    - Upon opening the game, the main menu reveals the game logo, author's name, and the FEUP logo. A button invites users to start the game interaction.
    <img src="screenshots/1_main_menu.png" alt="Main Menu" width="300"/>
    
    - Clicking the start button redirects users to the enter username menu.
    ![Enter Username Menu](screenshots/2_username_menu.png)
    - Users proceed to choose the desired level.
    ![Choose Level](screenshots/3_level_menu.png)
    - The next step involves selecting the car for the user to play with.
    ![Choose Player Car](screenshots/4_player_car_menu.png)
    - Similarly, users pick the opponent's car.
    ![Choose Opponent Car](screenshots/5_opponent_car_menu.png)
    - Upon completion, users are redirected to the track, and a countdown initiates the run. The moment "GO!" appears on the screen, the run starts, as demonstrated below:
    ![Start Run](screenshots/6_start_run.png)
    - Obstacles and power-ups are placed along the track. Collision with these elements modifies the run flow. For instance, colliding with the the "pick obstacle" power-up redirects users to choose an obstacle and select a location to place it on the track.
    - Pick Obstacle:
      ![Pick Obstacle](screenshots/7_pick_obstacle.png)
    - Place Obstacle:
      ![Place Obstacle](screenshots/8_place_obstacle.png)
    - During gameplay, real-time information such as elapsed time, laps completed, velocity, and applied modifiers with their remaining duration is displayed.
    ![Run Information](screenshots/9_run.png)
    - Upon finishing the run, users see the time taken, opponent's time, and the winner. The final menu provides options to return to the main menu or redo the run.
    ![Final Menu](screenshots/10_final_menu.png)

----
## Issues/Problems

- (items describing unimplemented features, bugs, problems, etc.)

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
    - Upon opening the game, the main menu reveals the game logo, authors' name, and the FEUP logo. A button invites users to start the game interaction.
    <img src="screenshots/1_main_menu.png" alt="Main Menu" width="500"/>
    
    - Clicking the start button redirects users to the enter username menu.
    <img src="screenshots/2_username_menu.png" alt="Enter Username Menu" width="500"/>

    - Users proceed to choose the desired level.
    <img src="screenshots/3_level_menu.png" alt="Choose Level" width="500"/>

    - The next step involves selecting the car for the user to play with.
    <img src="screenshots/4_player_car_menu.png" alt="Choose Player Car" width="500"/>

    - Similarly, users pick the opponent's car.
    <img src="screenshots/5_opponent_car_menu.png" alt="Choose Opponent Car" width="500"/>

    - After that, users are redirected to the track, and a countdown initiates the run. The moment "GO!" appears on the screen, the run starts, as demonstrated below:
    <img src="screenshots/6_start_run.png" alt="Start Run" width="500"/>

  - Obstacles and power-ups are strategically placed along the track. Colliding with these elements modifies the run flow. For instance, interacting with the "Pick Obstacle" power-up redirects users to choose an obstacle and select a location to place it on the track.
    - Pick Obstacle:
      <img src="screenshots/7_pick_obstacle.png" alt="Pick Obstacle" width="500"/>

    - Place Obstacle:
      <img src="screenshots/8_place_obstacle.png" alt="Place Obstacle" width="500"/>


  - During gameplay, real-time information such as elapsed time, laps completed, velocity, and applied modifiers with their remaining duration is displayed.
    <img src="screenshots/9_run.png" alt="Run Information" width="500"/>

  - Upon finishing the run, users see the time taken, opponent's time, and the winner. The final menu provides options to return to the main menu or redo the run.
    <img src="screenshots/10_final_menu.png" alt="Final Menu" width="500"/>

- **Link to the scene**: http://127.0.0.1:5593/tp3/
----
## Issues/Problems
We had difficulties on:
- Redo run and go to main menu buttons;
- Pick obstacle power up;
- Rotate the wheels of both the autonomous and player car
- Fireworks.

We have limited shadows due to a velocity optimization trade-off.

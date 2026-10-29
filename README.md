🎮 Hand Gesture Controlled Game

Play with Your Hands. Control the Game with AI. ✋🤖

A real-time hand gesture-controlled 2D platformer that allows players to control a game character using hand gestures instead of a traditional keyboard or controller.

The project combines computer vision, machine learning, and game development to create an interactive, hands-free gaming experience. A webcam captures hand movements, a YOLO-based classification model recognizes predefined ASL alphabet gestures, and the recognized commands are transmitted to a game developed using the Godot Engine through UDP communication.

⸻

🕹️ Gameplay Preview

The game features a 2D platforming environment where players navigate platforms, jump across obstacles, and collect items using hand gestures.

Gesture Recognition in Action

The Python-based gesture recognition system detects hand gestures through a webcam and translates them into game commands in real time.

Gesture-Controlled Gameplay

The recognized gestures control the player character in the Godot game, allowing movement and jumping without using a keyboard.

## 🎬 Demo Video

**Watch the project in action:**
[▶ Click here to watch the demo video](https://drive.google.com/file/d/1xIS320hndjtlL5M8Ro6wmUS9PZ7SjiOU/view)
⸻

✨ Features

*  Hands-Free Gameplay — Control the player using hand gestures instead of keyboard inputs.
*  AI-Powered Gesture Recognition — Uses a YOLO-based classification model to recognize five predefined hand gestures.
*  Real-Time Hand Detection — Uses MediaPipe and a webcam to detect the player’s hand.
*  Godot Game Integration — Connects an external AI system to a 2D platformer built using Godot Engine.
*  UDP Communication — Transfers gesture commands from Python to Godot in real time.
*  Multiple Movement Controls — Supports forward movement, backward movement, jumping, and combined movement-jump actions.
*  Interactive Gameplay — Navigate platforms and collect items while controlling the character through gestures.
*  Modular Architecture — Separates gesture recognition, communication, and game logic into independent components.

⸻

🖐️ Gesture Controls

The game uses five ASL alphabet gestures to control the player.

Gesture	Game Action	Description
 I	Move Forward	Moves the player forward.
 L	Move Backward	Moves the player backward.
 X	Jump	Makes the player jump.
 Q	Forward + Jump	Moves the player forward while jumping.
 W	Backward + Jump	Moves the player backward while jumping.

The letters represent the selected gesture classes used by the classification model.

Note: These are project-specific game controls mapped to selected ASL alphabet gestures. They are not a complete sign language recognition system.

⸻

🛠️ Tech Stack

Technology	Purpose
Python	Gesture recognition and communication logic
YOLO	Hand gesture classification
MediaPipe	Hand detection and landmark processing
OpenCV	Webcam input and image processing
Godot Engine	Development of the 2D platformer
GDScript	Player movement, jumping, and game logic
UDP Sockets	Communication between Python and Godot
Kaggle Dataset	Training images for the selected ASL alphabet gestures

⸻

⚙️ How It Works

The system consists of three main components:

1. Hand Detection and Gesture Recognition

The webcam captures live video frames. MediaPipe is used for hand detection, and the YOLO-based classification model predicts which of the five trained gesture classes is being performed.

2. Python–Godot Communication

Once a gesture is recognized, the Python program sends the corresponding gesture label to the Godot game through UDP communication.

3. Game Controller

Godot listens for incoming gesture commands and maps each recognized gesture to the appropriate player action using GDScript.

🔄 System Workflow

        Webcam Input
              |
              v
       Hand Detection
         (MediaPipe)
              |
              v
     Gesture Classification
            (YOLO)
              |
              v
       Recognized Label
        (I, L, X, Q, W)
              |
              v
      UDP Communication
           (Python)
              |
              v
       Godot Game Engine
              |
              v
         Player Action

Example: Jumping

Player performs X gesture
          |
          v
Python processes webcam frame
          |
          v
YOLO predicts gesture X
          |
          v
Python sends X through UDP
          |
          v
Godot receives the command
          |
          v
Player character jumps

⸻

🧠 Machine Learning Model

The gesture recognition system uses a YOLO-based classification model trained on a hand gesture dataset obtained from Kaggle.

Dataset

* Source: Kaggle
* Dataset type: ASL alphabet hand gesture images
* Selected classes: I, L, X, Q, W
* Approximate dataset size: 2,500 images per selected letter, as described in the project documentation.

Training Pipeline

1. Obtain the hand gesture dataset.
2. Organize images according to their gesture classes.
3. Prepare the dataset for model training and validation.
4. Train the YOLO-based classification model.
5. Evaluate the model on images not used directly during training.
6. Test predictions using a live webcam feed.
7. Integrate the trained model with the Godot game.

The trained model predicts a gesture label, which is subsequently translated into a player action.

⸻

🎮 Game Development

The 2D platformer was developed using the Godot Engine.

The game includes:

* A playable character with movement and jumping mechanics.
* Platforms and obstacles.
* Collectible items.
* A points counter.
* Gesture-based player controls.

The player character uses Godot’s CharacterBody2D node, while GDScript handles movement, jumping, and input processing.

Rather than relying exclusively on keyboard input, the game receives commands from the external Python-based gesture recognition system.

⸻

🚀 Getting Started

Follow these steps to set up the project locally.

Prerequisites

Install the following software:

* Python 3.10–3.12 (choose a version compatible with your installed ML libraries).
* Godot Engine.
* Git.
* A working webcam.

You will also need the trained gesture classification model and the Godot project files.

1. Clone the Repository

git clone https://github.com/MerinGeorgeP/Hand-Gesture-Controlled-Game.git

Navigate to the project directory:

cd Hand-Gesture-Controlled-Game

2. Create a Python Virtual Environment

python3 -m venv .venv

Activate the environment.

macOS / Linux:

source .venv/bin/activate

Windows:

.venv\Scripts\activate

3. Install Dependencies

If the repository contains a requirements.txt file, install its dependencies:

pip install -r requirements.txt

Otherwise, install the packages required by your implementation. These may include:

pip install ultralytics opencv-python mediapipe

Note: MediaPipe compatibility depends on your Python version and platform. Check the compatibility of your installed dependencies before selecting a Python version.

4. Configure the Trained Model

Ensure that the trained YOLO classification model is available at the path expected by the Python gesture recognition script.

If the model file is not included in the repository, obtain it from your training workflow and update the model path in the Python code.

5. Open the Godot Project

1. Launch Godot Engine.
2. Import or open the cloned project directory.
3. Verify that the game scenes and scripts are available.
4. Check the UDP port configured in the Godot receiver and Python sender.

6. Run the Application

1. Start the Godot game.
2. Run the Python gesture recognition script.
3. Allow webcam access when prompted.
4. Position your hand within the camera frame.
5. Perform one of the five supported gestures.
6. Observe the corresponding action in the game.

Important: The Python program and Godot game must use matching UDP communication settings. The exact startup commands depend on the filenames and directory structure in your repository.

⸻

📂 Project Architecture

The application is organized around three primary responsibilities.

Hand-Gesture-Controlled-Game/
│
├── Python Gesture Recognition
│   ├── Webcam Input
│   ├── Hand Detection
│   ├── YOLO Classification
│   └── UDP Sender
│
├── Godot Game
│   ├── Player Controller
│   ├── Movement and Jump Logic
│   ├── UDP Receiver
│   ├── Platforms and Obstacles
│   └── Collectibles and Score
│
├── Trained Model
│   └── YOLO Classification Weights
│
└── README.md

This is a conceptual representation of the system architecture, not a verified listing of the repository’s actual files.

⸻

🧪 Challenges and Learnings

Building this project provided practical experience in integrating machine learning with a real-time interactive application.

Challenges

* Gesture misclassification: Visually similar hand poses can sometimes produce incorrect predictions.
* Real-time recognition: Lighting, hand orientation, camera angle, and background conditions can affect recognition.
* Communication between applications: Python and Godot must exchange commands correctly through UDP.
* Unstable controls: Predictions may fluctuate between consecutive webcam frames.
* Combined actions: Forward movement with jumping and backward movement with jumping require appropriate game-side handling.

Key Learnings

* Preparing image datasets for machine learning.
* Training and evaluating an image classification model.
* Using MediaPipe for computer vision.
* Processing webcam frames with Python.
* Implementing 2D player movement in Godot.
* Communicating between independent applications using UDP.
* Debugging an end-to-end AI application.

⸻

🔮 Future Improvements

The project can be extended with several enhancements:

* Gesture Smoothing: Use consecutive predictions to reduce accidental movements.
* Confidence Thresholds: Execute commands only when prediction confidence is sufficiently high.
* Custom Gesture Mapping: Allow players to configure their preferred gestures.
* Expanded Gesture Vocabulary: Introduce additional gestures for more complex controls.
* Multi-Hand Interaction: Use both hands to control separate game functions.
* Voice Integration: Combine voice commands with gesture-based controls.
* Advanced Game Environments: Extend the system to 3D games, racing games, educational games, and other interactive applications.
* Performance Optimization: Improve inference speed and responsiveness for different devices.

⸻

🎯 Project Objective

The primary objective of this project is to explore how artificial intelligence and computer vision can be integrated with a game engine to create an alternative method of game interaction.

By connecting a real-time gesture recognition pipeline to Godot through UDP communication, the project demonstrates how physical hand movements can become digital game controls.

⸻

👩‍💻 Author

Merin George P.

GitHub: @MerinGeorgeP


⸻

📄 License

A license has not been specified for this project yet. Add a LICENSE file if you intend to distribute the source code under a particular open-source license.

⸻

⭐ If you find this project interesting, consider giving the repository a star!

Built by exploring the intersection of AI, computer vision, and interactive game development.

# My Wedding Invitation Website

## How to setup
1. Clone the repository and navigate to the project directory
2. Open two terminal windows and run tailwindcss in the following format. (I have uploaded tailwindcss cli for windows in this repository. You may need to install it if you are using a different OS)
    a. In the first terminal:
    ```bash
    ./tailwindcss -i ./src/input.css -o ./src/output.css --watch
    ```
    b. In the second terminal:
    Install `livereload` python library for hot reloading. Run `pip install livereload` to install it.
    ```bash
    livereload ./src
    ```

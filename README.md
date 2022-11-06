# Server-Side Calculator

## Description

*Duration: Weekend Project*

I was tasked to create a calculator that accepts input on the client side, performs operations on the server-side, and then hands the results back to the client, also displaying the history of all calculations made. As optional goals, I also built a GUI for the calculator, integrated various data validation methods, and provided a button to delete the calculation history.

### Prerequisites

- [Node.js](https://nodejs.org/en/)
- Node Package Manager & Express (instructions below)

## Installation

1. Navigate to the root directory of the program.
2. Install Node Package Manager (type `npm init --yes` on the command line)
3. Install Express (type `npm install express` on the command line)
4. Start the server with `npm start`
5. Open your browser and navigate to http://localhost:5000 to access the program

## Usage

- This calculator can handle simple arithmetic with two operands up of to seven digits, and results of up to nine digits.
- The history of all your calculations will be displayed to the right. Press 'Delete' to clear the history.
- You can chain multiple operations together one at a time by simply continuing with the next operator after clicking equals.
  - For example: to perform 5 + 4 - 1, click 5 + 4, click equals (=) to display the result, and then click minus (-) to begin the next operation.
- Note: The calculator will not accept more than one operation at a time. To change to a different operator, press AC and begin the equation from scratch.

## Built with

- jQuery and .ajax()
- Node.js
- Express

## Acknowledgement
Thanks to [Prime Digital Academy](www.primeacademy.io) who equipped and helped me to make this application a reality.

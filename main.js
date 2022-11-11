const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";
const pathCharacterCurrent = "+";
let pathArray = [[0, 0]];
let returnBool = false;
let liveCounter = 5;

class Field {
  constructor(field = [[]]) {
    this._field = field;
    this.x = 0;
    this.y = 0;
  }
  get field() {
    return this._field;
  }
  print() {
    for (let row of this._field) {
      console.log(row.join(""));
    }
  }
  containArray(array) {
    let pathJSON = JSON.stringify(pathArray);
    let arrayJSON = JSON.stringify(array);
    let index = pathJSON.indexOf(arrayJSON);
    return index !== -1;
  }
  movePrompt() {
    const move = prompt(
      "Which way do you want to go? (Class WASD board) "
    ).toLowerCase();
    switch (move) {
      case "w":
        if (this.containArray([this.x - 1, this.y])) {
          returnBool = true;
          break;
        }
        this.x -= 1;
        pathArray = [...pathArray, [this.x, this.y]];
        break;
      case "s":
        if (this.containArray([this.x + 1, this.y])) {
          returnBool = true;
          break;
        }
        this.x += 1;
        pathArray = [...pathArray, [this.x, this.y]];
        break;
      case "d":
        if (this.containArray([this.x, this.y + 1])) {
          returnBool = true;
          break;
        }
        this.y += 1;
        pathArray = [...pathArray, [this.x, this.y]];
        break;
      case "a":
        if (this.containArray([this.x, this.y - 1])) {
          returnBool = true;
          break;
        }
        this.y -= 1;
        pathArray = [...pathArray, [this.x, this.y]];
        break;
      default:
        console.log("Please choose one of a, s, d, w");
        this.movePrompt();
        break;
    }
  }
  isOutBounds() {
    return (
      this.y < 0 ||
      this.x < 0 ||
      this.y >= this.field[0].length ||
      this.x >= this.field.length
    );
  }
  isHat() {
    return this._field[this.x][this.y] === hat;
  }
  isHole() {
    return this._field[this.x][this.y] === hole;
  }
  playGame() {
    let currentPlaying = true;
    while (currentPlaying) {
      this.print();
      if (returnBool) {
        console.log("You've already been there, try again!");
        liveCounter--;
        console.log(
          liveCounter <= 1
            ? liveCounter === 1
              ? "You have one life left"
              : ``
            : `You have ${liveCounter} lives left!`
        );
        returnBool = false;
        if (liveCounter === 0) {
          console.log("Ah sorry you have no lives left");
          currentPlaying = !currentPlaying;
          break;
        }
      }
      this.movePrompt();
      if (this.isOutBounds()) {
        console.log("Ah sorry, you left the board!");
        currentPlaying = !currentPlaying;
        break;
      } else if (this.isHole()) {
        console.log("Ah sorry, you stepped in a hole!");
        currentPlaying = !currentPlaying;
        break;
      } else if (this.isHat()) {
        console.log("Congratulations! You've won");
        currentPlaying = !currentPlaying;
        break;
      }
      console.log(pathArray);
      console.log(pathArray[pathArray.length - 2]);
      this.field[pathArray[pathArray.length - 2][0]][
        pathArray[pathArray.length - 2][1]
      ] = pathCharacter;
      this._field[this.x][this.y] = pathCharacterCurrent;
    }
  }
  static generateField(height, width, percentage = 0.2) {
    const field = [];
    for (let i = 0; i < height; i++) {
      field.push([]);
      for (let j = 0; j < width; j++) {
        let ranNum = Math.random();
        if (ranNum < percentage) {
          field[i][j] = hole;
        } else field[i][j] = fieldCharacter;
      }
      field[0][0] = pathCharacterCurrent;
    }
    let hatX = Math.floor(Math.random() * height);
    let hatY = Math.floor(Math.random() * width);
    while (hatX === 0 && hatY === 0) {
      hatX = Math.floor(Math.random() * height);
      hatY = Math.floor(Math.random() * width);
    }
    field[hatX][hatY] = hat;
    return field;
  }
}

const myField = new Field(Field.generateField(10, 5, 0.1));

myField.playGame();

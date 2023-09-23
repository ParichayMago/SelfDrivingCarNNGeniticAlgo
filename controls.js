class Controls {
  constructor() {
    this.up = false;
    this.down = false;

    // switch(type){
    //   case "KEYS":
    //     this.#addkeyboardListners;
    // }
    this.#addkeyboardListners();
  }

  #addkeyboardListners() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.up = true;
          break;
        case "ArrowDown":
          this.down = true;
          break;
      }
    };
    document.onkeyup = (event) => {
      switch (event.key) {
        case "ArrowUp":
          this.up = false;
          break;
        case "ArrowDown":
          this.down = false;
          break;
      }
    };
  }
}

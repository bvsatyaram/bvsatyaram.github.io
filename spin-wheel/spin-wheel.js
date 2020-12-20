console.log('JS Loaded');

class SpinWheel {
  // constructor(options = []) {
  //   this.options = options;
  // }

  static localStorageKey = 'spin-wheel-storage';
  static defaultOptions = ['One', 'Two', 'Three', 'Four', 'Five', 'Six'];
  static wheelColors = ['#1abc9c', '#3498db', '#9b59b6', '#e67e22', '#e74c3c'];
  static wheelRadius = 150;

  //////////
  // Data //
  //////////

  _seedData() {
    if (localStorage.getItem(this.constructor.localStorageKey)) {
      this.data = JSON.parse(localStorage.getItem(this.constructor.localStorageKey));
    } else {
      this.data = {
        options: this.constructor.defaultOptions
      }
      this._syncDataToLocalStorage();
    }

  }

  _syncDataToLocalStorage() {
    localStorage.setItem(
      this.constructor.localStorageKey,
      JSON.stringify(this.data)
    );
  }

  ////////////////////////////
  // Manage Options Content //
  ////////////////////////////

  _optionsListItem(counter, option) {
    const tableRow = document.createElement('tr');
    const firstCell = document.createElement('td');
    firstCell.innerText = option;
    
    const deleteLink = document.createElement('a');
    deleteLink.classList.add('delete');
    deleteLink.dataset.optionCounter = counter;
    deleteLink.innerText = '🗑';

    const secondCell = document.createElement('td');
    secondCell.classList.add('actions');
    secondCell.appendChild(deleteLink);

    tableRow.appendChild(firstCell);
    tableRow.appendChild(secondCell);

    return tableRow;
  }

  _populateManageOptions() {
    const optionsContainer = document.querySelector('.spin-wheel--options');
    optionsContainer.innerHTML = '';
    for (let [counter, option] of this.data.options.entries()) {
      optionsContainer.appendChild(this._optionsListItem(counter, option));
    }
  }

  ////////////////////////////
  // Manage Options Actions //
  ////////////////////////////

  _handleDeleteOption() {
    document.addEventListener('click', (e) => {
      if (e.target.matches('.spin-wheel--options td.actions a.delete')) {
        e.preventDefault();

        const optionCounter = parseInt(e.target.dataset.optionCounter, 10);
        this.data.options.splice(optionCounter, 1);
        this._drawDOM();
        this._syncDataToLocalStorage();
      }
    })
  }

  _handleOptionAddition() {
    const form = document.querySelector('form.spin-wheel--add-option');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const newOption = document.querySelector('input.spin-wheel--new-option').value;
      if (newOption) {
        this.data.options.push(newOption);
        document.querySelector('input.spin-wheel--new-option').value = '';
        this._drawDOM();
        this._syncDataToLocalStorage();
      }
    })
  }

  ////////////////////////
  // Spin Wheel Content //
  ////////////////////////

  _wheelItem(counter, itemText) {
    const item = document.createElement('div');
    item.classList.add('spin-wheel--item');

    const itemContent = document.createElement('div');
    itemContent.classList.add('spin-wheel--item-content');
    itemContent.innerText = itemText;

    item.appendChild(itemContent);

    const numberOfColors = this.constructor.wheelColors.length;
    let colorIndex = counter % numberOfColors;

    // Avoid first and last items having the same color
    if ((counter === this.data.options.length - 1) && colorIndex === 0) {
      colorIndex = parseInt(numberOfColors / 2, 10);
    }

    item.style.borderRightColor = this.constructor.wheelColors[colorIndex];
    if (this.data.options.length !== 0) {
      item.style.transform = `rotate(${360 * counter / this.data.options.length}deg)`;

      const borderWidth = this.constructor.wheelRadius * Math.tan(Math.PI / this.data.options.length);
      item.style.top = `${this.constructor.wheelRadius - borderWidth}px`;
      item.style.borderTopWidth = `${borderWidth}px`;
      item.style.borderBottomWidth = `${borderWidth}px`;
      item.style.borderRightWidth = `${this.constructor.wheelRadius}px`;
    }

    return item;
  }

  // _spinTrigger() {
  //   const triggerEle = document.createElement('a');
  //   triggerEle.innerText = 'Spin';
  //   triggerEle.classList.add('spin-wheel--spin-trigger');
  //   triggerEle.style.width = `${this.constructor.wheelRadius / 2}px`;
  //   triggerEle.style.height = `${this.constructor.wheelRadius / 2}px`;

  //   return triggerEle;
  // }

  _drawWheel() {
    const spinWheel = document.querySelector('.spin-wheel--items');
    spinWheel.innerHTML = '';

    for (let [counter, option] of this.data.options.entries()) {
      spinWheel.appendChild(this._wheelItem(counter, option));
    }

    // spinWheel.appendChild(this._spinTrigger());

    spinWheel.style.width = `${2* this.constructor.wheelRadius}px`;
    spinWheel.style.height = `${2* this.constructor.wheelRadius}px`;
  }

  /////////////////
  // Handle Spin //
  /////////////////
  _handleSpin() {
    const spinTrigger = document.querySelector('a.spin-wheel--spin-trigger');
    const rotatableWheel = document.querySelector('.spin-wheel--items');

    this.rotation = this.rotation ? this.rotation : 0;

    spinTrigger.addEventListener('click', (e) => {
      e.preventDefault();

      const minRotations = 10;
      const maxRotations = 15;

      this.rotation += (minRotations + (Math.random() * (maxRotations - minRotations))) * 360;
      rotatableWheel.style.transform = `rotate(${this.rotation}deg)`;
    })
  }

  ///////////
  // Utils //
  ///////////

  _drawDOM() {
    this._populateManageOptions();
    this._drawWheel();
  }

  init() {
    this._seedData();
    this._drawDOM();
    this._handleDeleteOption();
    this._handleOptionAddition();
    this._handleSpin();
  }
}

const spinWheel = new SpinWheel();
spinWheel.init();
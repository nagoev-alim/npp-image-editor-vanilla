import feather from 'feather-icons';
import { capitalStr } from '../modules/capitalStr.js';

/**
 * @class App
 */
export default class App {
  constructor(root) {
    this.root = root;
    this.imgName = null;
    this.isDisable = true;
    this.options = {
      brightness: '100',
      saturation: '100',
      inversion: '0',
      grayscale: '0',
      rotate: 0,
      flipHorizontal: 1,
      flipVertical: 1,
    };


    this.root.innerHTML = `
     <div class='main disabled'>
        <h3 class='title'>Image Editor</h3>
        <div class='grid'>
          <div class='panel'>

            <div class='filter'>
              <p>Filters</p>

              <div class='options'>
                ${['brightness', 'saturation', 'inversion', 'grayscale'].map((el, idx) => `
                  <button data-option='${el}' class='${idx === 0 ? 'active' : ''}'>${capitalStr(el)}</button>
                `).join('')}
              </div>

              <div class='slider'>
                <p class='name' data-slider-name=''>Brighteness</p>
                <p class='value' data-slider-value=''>100%</p>
                <input type='range' value='100' min='0' max='200' data-slider-input=''>
              </div>
            </div>

            <div class='rotate'>
              <p>Rotate & Flip</p>
              <div class='options'>
                <button data-rotate='left'>${feather.icons['rotate-ccw'].toSvg()}</button>
                <button data-rotate='right'>${feather.icons['rotate-cw'].toSvg()}</button>
                <button data-rotate='horizontal'>${feather.icons['minimize-2'].toSvg()}</button>
                <button data-rotate='vertical'>${feather.icons['minimize-2'].toSvg()}</button>
              </div>
            </div>
          </div>

          <div class='preview'>
            <img src='#' alt='preview-img' draggable='false' class='hide' data-preview=''>
            <div>
              ${feather.icons.image.toSvg()}
              <p>Choose Image Or Edit</p>
            </div>
          </div>
        </div>

        <div class='controls'>
          <button data-reset=''>Reset Filters</button>
          <div><input type='file' accept='image/*' class='visually-hidden' data-input=''></div>
          <button data-choose=''>Choose Image</button>
          <button data-save=''>Save Image</button>
        </div>
      </div>`;

    this.DOM = {
      inputFile: document.querySelector('[data-input]'),
      filterOptions: document.querySelectorAll('[data-option]'),
      filterSlider: {
        name: document.querySelector('[data-slider-name]'),
        value: document.querySelector('[data-slider-value]'),
        input: document.querySelector('[data-slider-input]'),
      },
      rotateOptions: document.querySelectorAll('[data-rotate]'),
      preview: document.querySelector('[data-preview]'),
      buttons: {
        reset: document.querySelector('[data-reset]'),
        choose: document.querySelector('[data-choose]'),
        save: document.querySelector('[data-save]'),
      },
    };

    this.DOM.filterSlider.input.addEventListener('input', this.onSliderChange);
    this.DOM.filterOptions.forEach(filter => filter.addEventListener('click', this.onFilterOptionClick));
    this.DOM.rotateOptions.forEach(filter => filter.addEventListener('click', this.onRotateOptionClick));
    this.DOM.inputFile.addEventListener('change', this.onFileChange);
    this.DOM.buttons.reset.addEventListener('click', this.onReset);
    this.DOM.buttons.save.addEventListener('click', this.onSave);
    this.DOM.buttons.choose.addEventListener('click', () => this.DOM.inputFile.click());
  }


  /**
   * @function onSliderChange
   * @param value
   */
  onSliderChange = ({ target: { value } }) => {
    if (this.isDisable) {
      return;
    }
    this.DOM.filterSlider.value.innerHTML = `${value}%`;

    switch (document.querySelector('[data-option].active').dataset.option) {
      case 'brightness':
        this.options.brightness = value;
        break;
      case 'saturation':
        this.options.saturation = value;
        break;
      case 'inversion':
        this.options.inversion = value;
        break;
      default:
        this.options.grayscale = value;
        break;
    }

    this.applyFilter();
  };

  /**
   * @function applyFilter
   */
  applyFilter = () => {
    if (this.isDisable) {
      return;
    }
    this.DOM.preview.classList.remove('hide');
    this.DOM.preview.nextElementSibling.classList.add('hide');
    this.DOM.preview.style.transform = `rotate(${this.options.rotate}deg) scale(${this.options.flipHorizontal}, ${this.options.flipVertical})`;
    this.DOM.preview.style.filter = `brightness(${this.options.brightness}%) saturate(${this.options.saturation}%) invert(${this.options.inversion}%) grayscale(${this.options.grayscale}%)`;
  };

  /**
   * @function onFilterOptionClick
   * @param target
   */
  onFilterOptionClick = ({ target }) => {
    if (this.isDisable) {
      return;
    }
    this.DOM.filterOptions.forEach(el => el.classList.remove('active'));
    target.classList.add('active');

    this.DOM.filterSlider.name.innerText = target.innerText;

    switch (target.dataset.option) {
      case 'brightness':
        this.DOM.filterSlider.input.max = '200';
        this.DOM.filterSlider.input.value = this.options.brightness;
        this.DOM.filterSlider.value.innerText = `${this.options.brightness}%`;
        break;
      case 'saturation':
        this.DOM.filterSlider.input.max = '200';
        this.DOM.filterSlider.input.value = this.options.saturation;
        this.DOM.filterSlider.value.innerText = `${this.options.saturation}%`;
        break;
      case 'inversion':
        this.DOM.filterSlider.input.max = '100';
        this.DOM.filterSlider.input.value = this.options.inversion;
        this.DOM.filterSlider.value.innerText = `${this.options.inversion}%`;
        break;
      default:
        this.DOM.filterSlider.input.max = '100';
        this.DOM.filterSlider.input.value = this.options.grayscale;
        this.DOM.filterSlider.value.innerText = `${this.options.grayscale}%`;
        break;
    }
  };

  /**
   * @function onRotateOptionClick
   * @param target
   */
  onRotateOptionClick = ({ target }) => {
    if (this.isDisable) {
      return;
    }

    switch (target.dataset.rotate) {
      case 'left':
        this.options.rotate -= 90;
        break;
      case 'right':
        this.options.rotate += 90;
        break;
      case 'horizontal':
        this.options.flipHorizontal = this.options.flipHorizontal === 1 ? -1 : 1;
        break;
      default:
        this.options.flipVertical = this.options.flipVertical === 1 ? -1 : 1;
        break;
    }

    this.applyFilter();
  };

  /**
   * @function onFileChange
   * @param files
   */
  onFileChange = ({ target: { files } }) => {
    let file = files[0];
    if (!file) {
      return;
    }
    this.DOM.preview.src = URL.createObjectURL(file);
    this.DOM.preview.addEventListener('load', () => {
      this.isDisable = false;
      this.DOM.buttons.reset.click();
      this.imageName = file.name.replace(/^.*[\\\/]/, '');
      document.querySelector('.main').classList.remove('disabled');
    });
  };

  /**
   * @function onReset
   */
  onReset = () => {
    if (this.isDisable) {
      return;
    }
    this.options.brightness = '100';
    this.options.saturation = '100';
    this.options.inversion = '0';
    this.options.grayscale = '0';
    this.options.rotate = 0;
    this.options.flipHorizontal = 1;
    this.options.flipVertical = 1;
    this.DOM.filterOptions[0].click();
    this.applyFilter();
  };

  /**
   * @function
   * @param target
   */
  onSave = ({ target }) => {
    if (this.isDisable) {
      return;
    }

    target.innerText = 'Saving image...';
    target.classList.add('disabled');

    setTimeout(() => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = this.DOM.preview.naturalWidth;
      canvas.height = this.DOM.preview.naturalHeight;

      ctx.filter = `brightness(${this.options.brightness}%) saturate(${this.options.saturation}%) invert(${this.options.inversion}%) grayscale(${this.options.grayscale}%)`;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      if (this.options.rotate !== 0) {
        ctx.rotate(this.options.rotate * Math.PI / 180);
      }
      ctx.scale(this.options.flipHorizontal, this.options.flipVertical);
      ctx.drawImage(this.DOM.preview, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

      const link = document.createElement('a');
      link.download = this.imageName;
      link.href = canvas.toDataURL();
      link.click();

      target.innerText = 'Save Image';
      target.classList.remove('disabled');
    });
  };
}

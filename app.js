import $ from 'jquery';
import Marionette from 'backbone.marionette';
import BasicProduct from './tests/fixtures/json/product.json';
import ColorOnly from './tests/fixtures/json/product-many-swatches.json';
import SizeOnly from './tests/fixtures/json/product-has-size-no-color.json';
import OneSizeOneColor
  from './tests/fixtures/json/product-one-size-one-color.json';
import NoSizeOneColor
  from './tests/fixtures/json/product-no-size-one-color.json';
import NoSizeNoColor from './tests/fixtures/json/product-no-size-no-color.json';
import AddToWishlist from './src/add-to-wishlist';

const app = new Marionette.Application ();

/*
 * These are the test product drawers that can be opened in isolation
 * Please add to the array to add a new product
 * Can provide id (makes ajax call to env) or product.json file
 * If given id and product, it uses id and ignores mock product data
 */
const testProducts = [
  {
    name: 'Open Size and Color Drawer with selected color swatch from thumbnail',
    product: BasicProduct,
    activeColorSwatchName: 'Black',
  },
  {
    name: 'Open Size and Color Drawer for PDP',
    killswitches: {isShopTheLookDrawerEnabled: true},
    id: 3215498,
  },
  {
    name: 'Open Color Only Drawer',
    product: ColorOnly,
  },
  {
    name: 'Open Size Only Drawer',
    product: SizeOnly,
  },
  {
    name: 'Open 1 Size 1 Color Drawer',
    product: OneSizeOneColor,
  },
  {
    name: 'Open No Size 1 Color Drawer',
    product: NoSizeOneColor,
  },
  {
    name: 'Open No Size No Color Drawer',
    product: NoSizeNoColor,
  },
];

class TestProduct {
  // wishlist instance -> options -> TestProduct
  constructor({
    name = 'Open Wishlist!',
    id,
    product,
    assetsHost = 'https://assets.bloomingdales.com',
    killswitches = {},
    activeColorSwatchName,
  }) {
    this.name = name;
    this.id = id;
    this.product = product;
    this.assetsHost = assetsHost;
    this.killswitches = killswitches;
    this.activeColorSwatchName = activeColorSwatchName;
  }

  // () -> jQuery selector
  toHtml () {
    const $button = $ (`<button>${this.name}</button>`);
    return this._decorateOpenEvent ($button);
  }

  _decorateOpenEvent ($button) {
    return $button.on ('click', () => {
      const wishlist = new AddToWishlist ();
      wishlist.open (this._getWishlistOptions ());
    });
  }

  _getWishlistOptions () {
    const self = this;
    let data;
    if (this.id) {
      data = {id: this.id, activeColorSwatchName: this.activeColorSwatchName};
    } else {
      data = {
        product: this.product,
        activeColorSwatchName: this.activeColorSwatchName,
      };
    }

    return {
      data,
      killswitches: self.killswitches,
      assetsHost: self.assetsHost,
      cmData: {pageType: ''},
    };
  }
}

function toButton (data) {
  return new TestProduct (data).toHtml ();
}

app.on ('start', () => {
  const $buttons = testProducts.map (toButton);

  $ ('body').append ($buttons);
  $ ('button').first ().trigger ('click');
});

export default app;

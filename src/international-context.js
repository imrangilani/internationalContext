import $ from 'jquery';
import Radio from 'backbone.radio';
import Cookie from '@component/common/src/util/Cookie';
import Coremetrics from '@component/common/src/util/Coremetrics';
import cmAttributes from '@component/common/src/util/CoremetricsAttributes';
import ObjectUtil from '@component/common/src/util/ObjectUtil';
import internationalContextView from './views/internationalContextView';
import internationalContextModel from './model/internationalContextModel';
//import wishlistMiddleware from './http';

class internationalContext {
  open(options) {
    if (this.view) { // destroy existing drawer and events
      this.close({ hide: false });
    }

    if (options.model) {
      this.model = options.model;
    } else {
      this.model = new internationalContextModel(Object.assign({
        assetsHost: options.assetsHost,
        killswitches: options.killswitches || {},
      }, JSON.parse(JSON.stringify(options.data))));
    }
    
    if (options) {
      this.fetchProduct(options);
    }

    Radio.channel('internationalContext').on('close:internationalContext', this.close.bind(this, { hide: true }));
  }

  fetchData(options) {
    const self = this;
    this.model.fetch({
      type: 'GET',
      url: `/xapi/discover/v1/product?productIds=${options}`,
      success: () => {
        //self.createWishlist.call(self, signedIn);
      },
      error: e => console.log('Error getting data', e),
    });
  }

  createView() {
    this.view = new internationalContextView({
      model: this.model,
      cmData: this.cmData,
    });
    this.view.render();
  }

  onError(resp, textStatus, jqXHR) {
    console.warn(resp, textStatus, jqXHR);
    if (this.signedIn) {
      this.createView();
    }
    Radio.channel('internationalContext').trigger('show:internationalContext:error');
    $('.drawer-main-wrapper-internationalContext .slider-title span').html('');
  }

  close(options) {
    if (this.view) {
      this.view.destroy(options);
    }
    Radio.channel('internationalContext').reset(); // clear radio events
  }
}

export default internationalContext;

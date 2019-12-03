import Backbone from 'backbone';
import Cookie from '@component/common/src/util/Cookie';

export default Backbone.Model.extend({

  initialize(options) {
    this.set('uid', this.getUserId());
    this.set('assetsHost', options.assetsHost);
    this.set('country', options.country);
    this.set('currency', options.currency);

  },

  parse(data) {
    if (data.length && data[0]) {
      this.set('country', data[0].country);
      this.set('currency', data[0].currency);
    }
  },

  getUserId() {
    let uid;
    if (Cookie.get('bloomingdales_online_uid')) {
      uid = Cookie.get('bloomingdales_online_uid');
    }
    return uid;
  },

});

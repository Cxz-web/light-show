import Vue from 'vue'
import Tip from './tip.vue'

let TipConstructor = Vue.extend(Tip);


/* const Bac = function(option) {
	let options = {
		data: option
	}
	let instances = new MessageConstructor(options);
	instances.vm = instances.$mount();
	document.body.appendChild(instances.vm.$el);
	setTimeout(() => {
		instances.vm.$el.parentNode.removeChild(instances.vm.$el);
	}, 3000)
	return instances.vm;
} */






let tip = function(option) {
	let options = {
		data() {
			return option
		}
	}
	let instances = new TipConstructor(options);
	let obj = instances.$mount();
	let dom = obj.$el
	setTimeout(() => {
		dom.addEventListener('animationend', destroyElement)
		dom.classList.add('bounceOut')
	}, 3000)
	document.body.appendChild(dom);
	function destroyElement() {
		dom.removeEventListener('animationend', destroyElement)
		dom.parentNode.removeChild(dom)
	}
	return instances.vm;
}


/***
  删除组件
***/
/* destroyElement: function destroyElement() {
       //this.$el.addEventListener('transitionend', this.destroyElement);
      this.$el.removeEventListener('transitionend', this.destroyElement);
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    }
 */

export default tip;

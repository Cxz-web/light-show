import Vue from 'vue'
import XBac from './bac.vue'

let BacConstructor = Vue.extend(XBac);


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

let Bac = {
	add: function(option) {
		let options = {
			data: option
		}
		let instances = new BacConstructor(options);
		this.obj = instances.$mount();
		document.body.appendChild(this.obj.$el);
		return instances.vm;
	},
	
	remove: function() {

		this.obj.$el.classList.add('leave')
		/* this.obj.$el.parentNode.removeChild(this.obj.$el); */
		this.obj.$el.addEventListener('animationend', ()=>{
			this.obj.$el.parentNode.removeChild(this.obj.$el);
		})
	},
	
	obj:{
		
	}
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

export default Bac;

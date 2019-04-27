import Vue from 'vue'
import XBac from './bac.vue'

let BacConstructor = Vue.extend(XBac);

let Bac = {
	add: function() {
		let instances = new BacConstructor();
		this.obj = instances.$mount();
		document.body.appendChild(this.obj.$el);
		return instances.vm;
	},
	
	close: function() {
		if(!this.obj.$el) return
		this.obj.$el.classList.add('leave')
		this.obj.$el.addEventListener('animationend', ()=>{
			this.obj.$el.parentNode.removeChild(this.obj.$el);
			this.obj = {}
		})
	},
	
	obj:{}
}



export default Bac;

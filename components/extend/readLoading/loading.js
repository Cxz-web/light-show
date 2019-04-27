import Vue from 'vue'
import Loading from './loading.vue'

let LoadingConstructor = Vue.extend(Loading);

let loading = {
	init: function(option) {
		
		let instances = new LoadingConstructor();
		this.obj = instances.$mount();
		document.body.appendChild(this.obj.$el);
		return instances.vm;
	},

	close: function() {
		
		return new Promise((resolve, reject) => {
			this.obj.$el.addEventListener('animationend', () => {
				this.obj.$el.parentNode.removeChild(this.obj.$el);
				resolve()
			})
			this.obj.$el.classList.add('leave')
		})
		
		
		
	},

	obj: {

	}
}






export default loading;

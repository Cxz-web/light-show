import Vue from "vue";

// 核心组件
import EditSlide from "./view/editSlide.vue"
import ReadSlide from "./view/readSlide.vue"

 // 辅助组件
 import waiting from './extend/bac/bac.js'
 import readLoaing from './extend/readLoading/loading.js'
 import tip from './extend/tip/tip.js'
 
 


// const Components = {
//     EditSlide,
// 	ReadSlide
// };
// 
// Object.keys(Components).forEach(name => {
//     Vue.component(name, Components[name]);
// });
// 
// export default Components;


const Components = [
    EditSlide,
	ReadSlide
]


const install = function(Vue, opts = {}) {

  Components.forEach(component => {
    Vue.component(component.name, component);
  });

  Vue.prototype.$waiting = waiting
  Vue.prototype.$read = readLoaing
  Vue.prototype.$tip = tip
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
	install,
	EditSlide,
	ReadSlide
}




// import EditSlide from "./view/editSlide.vue";
// 
// const components = [
// 	EditSlide
// ]
// 
// 
// const install = function(Vue, opts = {}) {
//   components.forEach(component => {
//     Vue.component(component.name, component);
//   })
// 
// 
// };
// 
// 
// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue);
// }
// 
// export default {
//   install,
//   EditSlide
// };
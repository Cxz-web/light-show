import Vue from "vue";
import EditSlide from "./view/editSlide.vue"
import ReadSlide from "./view/readSlide.vue"

 


const Components = {
    EditSlide,
	ReadSlide
};

Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
});

export default Components;

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
import Vue from "vue";
import EditSlide from "./view/editSlide.vue";


const Components = {
    EditSlide
};

Object.keys(Components).forEach(name => {
    Vue.component(name, Components[name]);
});

export default Components;
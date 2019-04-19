import LightShow from './src/main.vue'
LightShow.install = function (Vue) {
    Vue.component(LightShow.name, LightShow)
}

export default LightShow
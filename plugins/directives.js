import Vue from 'vue'
import clickOutsideDirective from '@/directives/click-outside.js'
import pointerupOutsideDirective from '@/directives/click-pointerup.js'

Vue.directive('click-outside', clickOutsideDirective)
Vue.directive('pointerup-outside', pointerupOutsideDirective)

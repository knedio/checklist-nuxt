import Vue from 'vue';
import Vuex from 'vuex';
import Todo from './modules/todo';

Vue.use(Vuex);

export default {
	modules: {
		todo: Todo,
  }
}
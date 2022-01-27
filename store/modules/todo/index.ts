import { TodoItem } from "~/data/models/modules/todo/todo-item.model";
import { TodoState } from "./todo.state.model";
import { Commit } from 'vuex';
import { get, patch, post, put } from '~/helpers/ApiService';
import { AddTodoReponse } from "~/data/models/modules/todo/responses/add-todo-response";
import { FetchTodosReponse } from "~/data/models/modules/todo/responses/fetch-todos-response";
import { UpdateTodoPayload } from "~/data/models/modules/todo/payloads/update-todo-payload";
import { UpdateCompletedTodoPayload } from "~/data/models/modules/todo/payloads/update-completed-todo-payload";

export default {
  state: () => ({
    items: [],
    completedItems: [],
    item: {
      id: '',
      title: '',
      completed: false,
    }
  } as TodoState),
  getters: {
    TODO_ITEMS(state: TodoState): TodoItem[] {
      return state.items;
    },
    COMPLETED_ITEMS(state: TodoState): TodoItem[] {
      return state.completedItems;
    },
    TODO_ITEM(state: TodoState): TodoItem {
      return state.item;
    },
  },
  mutations: {
    SET_TODO_ITEMS(state: TodoState, payload: TodoItem[]): void {
      state.items = [...payload];
    },
    SET_COMPLETED_ITEMS(state: TodoState, payload: TodoItem[]): void {
      state.completedItems = [...payload];
    },
    SET_TODO_ITEM(state: TodoState, payload: TodoItem): void {
      state.item = {...payload};
    },
  },
  actions: {
    resetTodoItem({ commit }: { commit: Commit }): void {
      commit('SET_TODO_ITEM', {
        id: '',
        title: '',
        completed: false,
      });
    },
    async FETCH_TODOS(): Promise<FetchTodosReponse> {
      try {
        const { data } = await get(`/todo`, {});

        return data.items;
      } catch (err) {
        throw err;
      }
    },
    async FETCH_TODOS_BY_COMPLETED(
      { commit }: { commit: Commit },
      completed: boolean
    ): Promise<FetchTodosReponse> {
      try {
        const { data } = await get(`/todo/get-by-completed`, { completed });

        return data.items;
      } catch (err) {
        throw err;
      }
    },
    async ADD_TODO({ commit }: { commit: Commit }, title: string): Promise<AddTodoReponse> {
      try {
        const { data } = await post(`/todo`, { title });

        return data.item;
      } catch (err) {
        throw err;
      }
    },
    async UPDATE_TODO(
      { commit }: { commit: Commit },
      payload: UpdateTodoPayload
    ): Promise<AddTodoReponse> {
      try {
        const { data } = await put(`/todo/${payload.id}`, payload);

        return data.item;
      } catch (err) {
        throw err;
      }
    },
    async UPDATE_COMPLETED_TODO(
      { commit }: { commit: Commit },
      payload: UpdateCompletedTodoPayload
    ): Promise<AddTodoReponse> {
      try {
        const { data } = await put(`/todo/update-completed`, payload);

        return data.item;
      } catch (err) {
        throw err;
      }
    },
  }
}
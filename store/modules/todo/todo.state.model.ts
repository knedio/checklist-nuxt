import { TodoItem } from "~/data/models/modules/todo/todo-item.model";

export interface TodoState {
  items: TodoItem[],
  completedItems: TodoItem[],
  item: TodoItem
}
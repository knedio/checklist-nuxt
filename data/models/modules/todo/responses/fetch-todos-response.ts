import { TodoItem } from "../todo-item.model";

export class FetchTodosReponse {
  items!: TodoItem[];
  message!: string;
}
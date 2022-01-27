<template>
  <div class="d-flex flex-column">
    <div class="d-flex">
      <v-btn
        class="mb-2"
        color="primary"
        :disabled="!checkIfHasCompleted()"
        @click="onCompleteItem"
      >
        {{ isPending ? 'Complete' : 'Back to Pending' }}
      </v-btn>
    </div>
    <todo-list
      :isPending="isPending"
      :items="items"
      @edit="onEditItem"
      @check="onCheckItem"
    />
    <todo-form
      v-if="isPending"
      @add="onAddItem"
      @reset="onResetItem"
    />
  </div>
</template>
<style lang="scss" scoped>
</style>
<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
  import { uuid } from 'vue-uuid';
  import { TodoItem } from '~/data/models/modules/todo/todo-item.model';

  @Component
  export default class Todo extends Vue {
    @Prop() isPending!: boolean;

    @Watch('isPending')
    onChangeIsPending(newVal: boolean, oldVal: boolean){
      if(oldVal !== newVal) {
        this.onSetItems();
      }
    }

    @Watch('TODO_ITEMS')
    onChangeItems(newVal: TodoItem[], oldVal: TodoItem[]){
      if(oldVal !== newVal) {
        this.onSetItems();
      }
    }

    @Watch('COMPLETED_ITEMS')
    onChangeCompeltedItems(newVal: TodoItem[], oldVal: TodoItem[]){
      if(oldVal !== newVal) {
        this.onSetItems();
      }
    }

    get TODO_ITEMS(): TodoItem[] {
      return this.$store.getters.TODO_ITEMS;
    }
    get COMPLETED_ITEMS(): TodoItem[] {
      return this.$store.getters.COMPLETED_ITEMS;
    }
    get TODO_ITEM(): TodoItem {
      return this.$store.getters.TODO_ITEM;
    }

    items: TodoItem[] = [];

    mounted () { }

    onSetItems(): void {
      this.items = this.isPending
        ? this.TODO_ITEMS
        : this.COMPLETED_ITEMS
    }

    onAddItem(title: string): void {
      let items: TodoItem[] = [];

      if(!this.TODO_ITEM.id) { // for adding an item
        items = [
          ...this.items,
          {
            id: uuid.v1(),
            title: title,
            completed: false,
          }
        ];
      } else { // for updating an item
        this.items.forEach(x => {
          let newVal = {...x};
          if(newVal.id === this.TODO_ITEM.id) {
            newVal.title = title;
          }

          items = [
            ...items,
            newVal
          ];
        });
      }

      this.$store.commit('SET_TODO_ITEMS', items);
      this.onResetItem();
    }

    onEditItem(item: TodoItem): void {
      if(!this.TODO_ITEM.id) {
        this.$store.commit('SET_TODO_ITEM', item);
      } else {
        this.onResetItem();
      }
    }
    
    onCheckItem(item: TodoItem): void {
      let items: TodoItem[] = [];

      this.items.forEach(x => {
        let newVal = {...x};

        if(newVal.id === item.id) {
          newVal.completed = !newVal.completed;
        }

        items = [
          ...items,
          newVal
        ];
      });

      const commit = this.isPending
        ? 'SET_TODO_ITEMS'
        : 'SET_COMPLETED_ITEMS';

      this.$store.commit(commit, items);
    }

    onCompleteItem(): void {
      let items: TodoItem[] = [];
      let completed: TodoItem[] = [];

      this.items.forEach(x => {
        if(x.completed) {
          completed = [
            ...completed,
            x
          ];
        } else {
          items = [
            ...items,
            x
          ];
        }
      });

      if(this.isPending) {
        completed = [
          ...this.COMPLETED_ITEMS,
          ...completed
        ];
      } else {
        items = [
          ...this.TODO_ITEMS,
          ...items
        ];
      }

      this.$store.commit('SET_TODO_ITEMS', items);
      this.$store.commit('SET_COMPLETED_ITEMS', completed);
    }

    onResetItem(): void {
      this.$store.dispatch('resetTodoItem');
    }

    checkIfHasCompleted(): boolean {
      const ifHasCompleted = this.items?.filter(x => this.isPending ? x.completed : !x.completed);

      return ifHasCompleted?.length > 0;
    }

  }
</script>

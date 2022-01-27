<template>
  <div class="d-flex flex-column">
    <div class="d-flex">
      <v-btn
        class="mb-2"
        color="primary"
        :disabled="!checkIfHasCompleted() || isCompleting || isGettingData"
        :loading="isCompleting"
        @click="onCompleteItem"
      >
        {{ isPending ? 'Complete' : 'Back to Pending' }}
      </v-btn>
    </div>
    <todo-list
      :isPending="isPending"
      :items="TODO_ITEMS"
      :loading="isGettingData"
      @edit="onEditItem"
      @check="onCheckItem"
    />
    <todo-form
      v-if="isPending"
      :isSubmitting="isSubmitting"
      @add="onAddItem"
      @reset="onResetItem"
    />
  </div>
</template>
<style lang="scss" scoped>
</style>
<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
  import { TodoItem } from '~/data/models/modules/todo/todo-item.model';

  @Component
  export default class Todo extends Vue {
    @Prop() isPending!: boolean;
    @Prop() isPureJs!: boolean;

    @Watch('isPending')
    async onChangeIsPending(newVal: boolean, oldVal: boolean): Promise<void> {
      if(oldVal !== newVal) {
        await this.onFetchTodos()
      }
    }

    get TODO_ITEMS(): TodoItem[] {
      return this.$store.getters.TODO_ITEMS;
    }
    get TODO_ITEM(): TodoItem {
      return this.$store.getters.TODO_ITEM;
    }

    isSubmitting = false;
    isCompleting = false;
    isGettingData = true;

    async mounted () {
      await this.onFetchTodos()
    }

    async onFetchTodos() {
      try {
        this.isGettingData = true;
        const items = await this.$store.dispatch('FETCH_TODOS_BY_COMPLETED', !this.isPending);
        this.$store.commit('SET_TODO_ITEMS', items);
        this.isGettingData = false;
      } catch (err) {
        console.log('err', err);
        this.isGettingData = false;
      }
    }

    async onAddItem(title: string): Promise<void> {
      try {
        this.isSubmitting = true;
        let items: TodoItem[] = [];

        if(!this.TODO_ITEM.id) { // for adding an item
          const item = await this.$store.dispatch('ADD_TODO', title);

          items = [
            ...this.TODO_ITEMS,
            item
          ];
        } else {
          const item = await this.$store.dispatch('UPDATE_TODO', {
            id: this.TODO_ITEM.id,
            title
          });

          this.TODO_ITEMS.forEach(x => {
            let newVal = {...x};

            if(newVal.id === this.TODO_ITEM.id) {
              newVal = item;
            }

            items = [
              ...items,
              newVal
            ];
          });
        }

        this.$store.commit('SET_TODO_ITEMS', items);

        this.onResetItem();
        this.isSubmitting = false;
      } catch (err) {
        console.error(err)
      }
    }

    onEditItem(item: TodoItem): void {
      if(!this.TODO_ITEM.id || (this.TODO_ITEM.id !== item.id)) {
        this.$store.commit('SET_TODO_ITEM', item);
      } else {
        this.onResetItem();
      }
    }
    
    onCheckItem(item: TodoItem): void {
      let items: TodoItem[] = [];

      this.TODO_ITEMS.forEach(x => {
        let newVal = {...x};

        if(newVal.id === item.id) {
          newVal.completed = !newVal.completed;
        }

        items = [
          ...items,
          newVal
        ];
      });

      this.$store.commit('SET_TODO_ITEMS', items);
    }

    async onCompleteItem(): Promise<void> {
      try {
        this.isCompleting = true;
        let ids: string[] = [];

        this.TODO_ITEMS.forEach(x => {
          if((this.isPending && x.completed) || (!this.isPending && !x.completed)) {
            ids = [
              ...ids,
              x.id
            ];
          }
        });

        await this.$store.dispatch('UPDATE_COMPLETED_TODO', {
          ids,
          completed: this.isPending
        });

        const items: TodoItem[] = this.TODO_ITEMS.filter(x => !ids.includes(x.id));

        this.$store.commit('SET_TODO_ITEMS', items);
        this.isCompleting = false;
      } catch (err) {
        this.isCompleting = false;
      }
    }

    onResetItem(): void {
      this.$store.dispatch('resetTodoItem');
    }

    checkIfHasCompleted(): boolean {
      const ifHasCompleted = this.TODO_ITEMS?.filter(x => this.isPending ? x.completed : !x.completed);

      return ifHasCompleted?.length > 0;
    }

  }
</script>

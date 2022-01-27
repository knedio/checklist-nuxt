<template>
  <div
    id="todoList"
    class="todo-list scroll pa-2"
  >
    <div v-if="!loading">
      <transition-group
        v-if="items && items.length > 0"
        name="list"
      >
        <v-row
          v-for="item in items"
          :key="item.id"
          class="ma-0 mb-1 list-item"
        >
          <v-col
            cols="11"
            class="pa-0 d-flex align-center"
          >
            <v-checkbox
              class="mt-0 pt-0 checkbox-field align-self-start"
              hide-details
              plain
              @click="$emit('check', item)"
            ></v-checkbox>
            <div
              cols="11"
              class="black--text pa-0 word-break"
              v-bind:class="{ 'text-decoration-line-through': isPending ? item.completed : !item.completed }"
            >
              {{ item.title }}
            </div>
          </v-col>
          <v-col
            cols="1"
            class="pa-0 d-flex justify-center align-start"
          >
            <v-icon
              v-if="isPending"
              dense
              color="primary"
              @click="$emit('edit', item)"
            >mdi-pencil-outline</v-icon>
          </v-col>
        </v-row>
      </transition-group>
      <div v-else>
        No data available.
      </div>
    </div>
    <div
      v-else
      class="d-flex flex-column align-center"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      ></v-progress-circular>
      <div class="mt-1">
        Retrieving data. Please wait.
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.todo-list {
  height: 230px;
  overflow: auto;
}
.list-enter-active, .list-leave-active {
  transition: all 1s;
}
.list-enter, .list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
  import { TodoItem } from '~/data/models/modules/todo/todo-item.model';

  @Component
  export default class TodoList extends Vue {
    @Prop() loading!: boolean;
    @Prop() isPending!: boolean;
    @Prop() items!: TodoItem[];
    
    get TODO_ITEM(): TodoItem {
      return this.$store.getters.TODO_ITEM;
    }

    @Watch('TODO_ITEM')
    onChangeItems(newVal: TodoItem, oldVal: TodoItem){
      if(oldVal !== newVal && (!oldVal.id && !newVal.id)) {
        const list = document.getElementById('todoList');

        // if new item added then list will go to the bottom
        if(
          list &&
          (
            list.scrollHeight > list.clientHeight ||
            list.scrollWidth > list.clientWidth
          )
        ) {
          setTimeout(() => {
            const scrollHeight = list.scrollHeight;
            list.scrollTop = scrollHeight;
          });
        }
      }
    }
  }
</script>
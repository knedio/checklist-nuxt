<template>
  <form
    class="d-flex flex-row align-center mt-1"
    @submit.prevent
  >
    <v-text-field
      ref='inputField'
      v-model="title"
      class="mr-3"
      label="Title"
      name="title"
      :append-icon="TODO_ITEM.id ? 'mdi-close' : ''"
      :rules="errors.collect('title')"
      v-validate="'required'"
      @click:append="onResetItem"
      @keyup.enter="onAddItem"
    ></v-text-field>
    <v-btn
      :disabled="!title"
      :loading="isSubmitting"
      color="primary"
      @click="onAddItem"
    >
      {{ TODO_ITEM.id ? 'Update' : 'Add' }}
    </v-btn>
  </form>
</template>
<style lang="scss" scoped>
</style>
<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator';
  import { TodoItem } from '~/data/models/modules/todo/todo-item.model';

  @Component
  export default class TodoForm extends Vue {
    @Prop() isSubmitting!: boolean;

    get TODO_ITEM(): TodoItem {
      return this.$store.getters.TODO_ITEM;
    }

    title = '';

    @Watch('TODO_ITEM')
    onChangeItem(newVal: TodoItem, oldVal: TodoItem){
      if(oldVal !== newVal) {
        if(newVal.id) { // this will set the title and auto focus input
          this.title = newVal.title;
          const inputField = this.$refs.inputField as HTMLInputElement;
          if(inputField) {
            inputField.focus();
          }
        } else {
          this.onResetForm();
        }
      }
    }

    onAddItem(): void {
      this.$validator.validate().then(valid => {
        if(valid) {
          this.$emit('add', this.title);
          this.onResetForm();
        }
      });
    }

    onResetItem(): void {
      this.$emit('reset');
      this.onResetForm();
    }

    onResetForm(): void {
      this.title = '';
      this.$validator.reset();
    }
  }
</script>
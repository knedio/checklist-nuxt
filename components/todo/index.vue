<template>
  <v-card class="elevation-4 text-left todo">
    <v-card-title class="justify-space-between">
      <div>
        {{ 
          isPendingListView 
            ? 'Checklist'
            : 'Completed Checklist' 
        }}
      </div>
      <v-menu
        :offset-x="true"
        :nudge-width="140"
        left
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            class="menu-icon"
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list class="py-0">
          <v-list-item @click="isPureJs = !isPureJs">
            <v-list-item-title>
              {{ isPureJs ? 'With Laravel' : 'Pure JS' }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item @click="isPendingListView = !isPendingListView">
            <v-list-item-title>
              {{ isPendingListView ? 'Completed List' : 'CheckList' }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-title>
    <v-card-text>
      <todo-js
        v-if="isPureJs"
        :isPending="isPendingListView"
      />
      <todo-with-laravel
        v-else
        :isPureJs="isPureJs"
        :isPending="isPendingListView"
      />
    </v-card-text>
  </v-card>
</template>
<style lang="scss" scoped>
.todo {
  max-width: 450px;
  height: 445px;
}
</style>
<script lang="ts">
  import { Component, Vue } from 'nuxt-property-decorator';

  @Component
  export default class Todo extends Vue {
    isPureJs = false;
    isPendingListView = true;

    mounted () { }

  }
</script>

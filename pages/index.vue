<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      cols="12"
      sm="8"
      md="6"
      lg="4"
      align="center"
    >
      <todo />
    </v-col>
  </v-row>
</template>
<style lang="scss" scoped>
</style>
<script lang="ts">
  import { Component, Vue } from 'nuxt-property-decorator';

  @Component
  export default class Index extends Vue {
    
  }
</script>

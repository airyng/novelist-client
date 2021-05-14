<template>
  <span v-if="hasAutosave">
    <v-tooltip top>
      <template #activator="{ on }">
        <v-icon class="mainTextColor" v-on="on">mdi-content-save-cog-outline</v-icon>
      </template>
      <span>Обнаружено автосохранение</span>
    </v-tooltip>
  </span>
</template>

<script>
import GameAutoSaveManager from '@/plugins/gameAutoSaveManager'
export default {
  props: { novellaId: { type: [Number, String], required: true } },
  data () {
    return {
      loaded: false
    }
  },
  computed: {
    hasAutosave () {
      if (!this.loaded) { return false }
      const gameAutoSaveManager = new GameAutoSaveManager()
      return gameAutoSaveManager.getSave(this.novellaId)
    }
  },
  mounted () {
    this.loaded = true
  }
}
</script>

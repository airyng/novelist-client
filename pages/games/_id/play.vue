<template>
  <div>
    <GameLoadingScreen v-if="!loaded" />
    <GameCharactersSetup
      v-else-if="gameStage === 'charactersSetup'"
      :characters="characters"
      @characterUpdated="onCharacterUpdated"
      @setupFinished="onCharactersSetupFinished"
    />
    <GamePlayProcess
      v-else-if="gameStage === 'playProcess'"
      ref="playProcess"
      :scenes="scenes"
      :characters="characters"
      @gameOver="onGameOver"
    />
    <GameFinalScreen v-else-if="gameStage === 'gameOver'" :game="loadedItem" @callToRestart="restart" />
  <!-- <project-loader
    @onRestoreState="onRestoreState"
  /> -->
  </div>
</template>

<script>
// const defaultGame = {
//   scenes: [
//     { id: 1617138553349, title: 'Сцена 1617138553349', mainText: 'Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1  ', background: { type: 'color', value: '#1A237EFF' }, actions: [{ id: 1617138591912, actionText: 'Дальше...', to: 1617138591890, condition: false }, { id: 1617138591912, actionText: 'Дальше...', to: 1617138591890, condition: false }], character: 1617138569818 },
//     { id: 1617138591890, title: 'Сцена 1617138591890', mainText: 'Сцена 2', background: { type: 'color', value: '#1A237EFF' }, actions: [{ id: 1617138593593, actionText: 'Дальше...', to: 1617138593566, condition: false }, { id: 1617138596746, actionText: 'На выход', to: 1617138596717, condition: false }], character: 1617138569818 },
//     { id: 1617138593566, title: 'Сцена 1617138593566', mainText: 'Сцена 3', background: { type: 'color', value: '#1A237EFF' }, actions: [{ id: 1617138621744, actionText: 'На выход', to: 1617138596717, condition: false }], character: false },
//     { id: 1617138596717, title: 'Финал', mainText: 'Сцена 4', background: { type: 'color', value: '#1A237EFF' }, actions: [{ id: 1617138650148, actionText: 'Выход', to: 'win', condition: false }], character: 1617138569818 }
//   ],
//   characters: [{ name: 'fjkdsjfs', id: '1.1_6.3_1.1_2.1_1.3_6.4_14', uid: 1617138569818 }]
// }
import gameChecker from '@/plugins/gameChecker'

export default {
  async asyncData ({ $api, params, error, store }) {
    let loadedItem = false
    // Ищем новеллу в публичном списке "Последние новеллы"
    if (store.state.latestGames.length) {
      loadedItem = store.state.latestGames.find(item => item.id === Number(params.id))
    }
    // Ищем новеллу в личном списке "Мои новеллы"
    if (store.state.profile.myGames.length) {
      loadedItem = store.state.profile.myGames.find(item => item.id === Number(params.id))
    }

    if (!loadedItem) {
      loadedItem = await $api.getPublishedGameByID(params.id)
    }
    if (!loadedItem) { return error({ statusCode: 404 }) }
    return { loadedItem }
  },
  data () {
    return {
      loadedItem: false,
      gameStage: 'charactersSetup',
      scenes: [], // список сцен
      characters: [],
      projectID: null, // ID новеллы
      loaded: false
    }
  },
  computed: {
    gameStages () {
      return [
        'charactersSetup',
        'playProcess',
        'gameOver'
      ]
    }
  },
  mounted () {
    // данные загружаются из компонента project loader
    this.boot()
  },
  methods: {
    boot () {
      if (process.server) { return false }
      let game = JSON.parse(this.loadedItem.json)

      if (!gameChecker.isLatestVersion(game)) {
        game = gameChecker.updateGameToLatestVersion(game)
      }

      this.scenes = [...game.scenes]
      this.characters = [...game.characters]

      const notConfiguredCharacters = this.characters.filter(char => char.userChoose?.length)
      if (!notConfiguredCharacters.length) { this.onCharactersSetupFinished() }
      this.loaded = true
      // eslint-disable-next-line no-console
      console.log('Game booted.')
    },
    restart () {
      const notConfiguredCharacters = this.characters.filter(char => char.userChoose?.length)
      if (!notConfiguredCharacters.length) {
        this.onCharactersSetupFinished()
      } else {
        this.gameStage = this.gameStages[0]
      }
    },
    onCharacterUpdated (char) {
      this.characters = this.characters.map((character) => {
        if (character.uid === char.uid) {
          character = char
        }
        return character
      })
    },
    onRestoreState (gameData) {
      this.projectID = gameData.id
      this.scenes = JSON.parse(gameData.json)
      // this.goToScene(this.scenes[0])
    },
    onCharactersSetupFinished () {
      this.gameStage = this.gameStages[1]
      this.$refs.playProcess?.goToStart()
    },
    onGameOver () {
      this.gameStage = this.gameStages[2]
    }
  }
}
</script>

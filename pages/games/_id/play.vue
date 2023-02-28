<template>
  <div>
    <game-loading-screen v-if="!loaded" />
    <game-start-screen
      v-else-if="gameStage === gameStages.startScreen"
      :game="loadedItem"
      @callToStart="onStartNew"
      @loadGame="onLoadGame"
    />
    <game-characters-setup
      v-else-if="gameStage === gameStages.charactersSetup"
      :characters="characters"
      @characterUpdated="onCharacterUpdated"
      @setupFinished="onCharactersSetupFinished"
    />
    <game-play-process
      v-else-if="gameStage === gameStages.playProcess"
      ref="playProcess"
      :scenes="scenes"
      :characters="characters"
      :start-on-scene="lastActiveScene"
      @gameOver="onGameOver"
    />
    <game-final-screen v-else-if="gameStage === gameStages.gameOver" :game="loadedItem" @callToRestart="restart" />
  </div>
</template>

<script>
import gameChecker from '@/plugins/gameChecker'
import GameAutoSaveManager from '@/plugins/gameAutoSaveManager'

export default {
  beforeRouteLeave (to, from, next) {
    this.$store.dispatch('constructorStorage/resetState')
    next()
  },
  middleware: ['authenticated'],
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
      loadedItem = await $api.call('getGameByID', params.id)
    }
    if (!loadedItem) { return error({ statusCode: 404 }) }

    if (loadedItem.status === 'draft') { return error({ statusCode: 403 }) }
    return { loadedItem }
  },
  data () {
    return {
      loadedItem: false,
      gameStage: 'startScreen',
      scenes: [], // список сцен
      characters: [],
      projectID: null, // ID новеллы
      loaded: false,
      lastActiveScene: null,
      gameAutoSaveManager: null
    }
  },
  computed: {
    gameStages () {
      return {
        startScreen: 'startScreen',
        charactersSetup: 'charactersSetup',
        playProcess: 'playProcess',
        gameOver: 'gameOver'
      }
    }
  },
  mounted () {
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
      // const notConfiguredCharacters = this.characters.filter(char => char.userChoose?.length)
      // if (!notConfiguredCharacters.length) { this.onCharactersSetupFinished() }
      this.projectID = this.loadedItem.id
      this.loaded = true
      // eslint-disable-next-line no-console
      console.log('Game booted.')
    },
    onStartNew () {
      this.gameStage = this.gameStages.charactersSetup
    },
    onLoadGame (saveObj) {
      this.lastActiveScene = saveObj.lastSceneID
      this.characters = saveObj.characters
      this.onCharactersSetupFinished()
    },
    restart () {
      // Сбрасываем автосохранение
      this.gameAutoSaveManager = new GameAutoSaveManager()
      this.gameAutoSaveManager.delete(this.projectID)
      this.lastActiveScene = null
      // Сбрасываем автосохранение - конец

      const notConfiguredCharacters = this.characters.filter(char => char.userChoose?.length)
      if (!notConfiguredCharacters.length) {
        this.onCharactersSetupFinished()
      } else {
        this.gameStage = this.gameStages.charactersSetup
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
      // this.goToScene(this.scenes.startScreen)
    },
    onCharactersSetupFinished () {
      this.gameStage = this.gameStages.playProcess
      this.$refs.playProcess?.goToStart()
    },
    onGameOver () {
      this.gameStage = this.gameStages.gameOver
    }
  }
}
</script>

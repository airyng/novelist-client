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
      :scenes="scenes"
      :characters="characters"
      @gameOver="onGameOver"
    />
  <!-- <project-loader
    @onRestoreState="onRestoreState"
  /> -->
  </div>
</template>

<script>
import { InfoMessage } from '@/plugins/toast'
const defaultGame = {
  scenes: [
    { id: 1617138553349, title: 'Сцена 1617138553349', mainText: 'Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1 Сцена 1  ', background: { type: 'color', value: '#1A237EFF' }, actions: [{ id: 1617138591912, actionText: 'Дальше...', to: 1617138591890, condition: false }, { id: 1617138591912, actionText: 'Дальше...', to: 1617138591890, condition: false }], character: 1617138569818 },
    { id: 1617138591890, title: 'Сцена 1617138591890', mainText: 'Сцена 2', background: { type: 'color', value: '#1A237EFF' }, actions: [{ id: 1617138593593, actionText: 'Дальше...', to: 1617138593566, condition: false }, { id: 1617138596746, actionText: 'На выход', to: 1617138596717, condition: false }], character: 1617138569818 },
    { id: 1617138593566, title: 'Сцена 1617138593566', mainText: 'Сцена 3', background: { type: 'color', value: '#1A237EFF' }, actions: [{ id: 1617138621744, actionText: 'На выход', to: 1617138596717, condition: false }], character: false },
    { id: 1617138596717, title: 'Финал', mainText: 'Сцена 4', background: { type: 'color', value: '#1A237EFF' }, actions: [{ id: 1617138650148, actionText: 'Выход', to: 'quit', condition: false }], character: 1617138569818 }
  ],
  characters: [{ name: 'fjkdsjfs', id: '1.1_6.3_1.1_2.1_1.3_6.4_14', uid: 1617138569818 }]
}
export default {
  data () {
    return {
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
      const localSavedGame = localStorage.getItem('game')
      if (localSavedGame) {
        const savedGameObject = JSON.parse(localSavedGame)
        savedGameObject.json = JSON.parse(savedGameObject.json)
        // eslint-disable-next-line no-console
        console.log(savedGameObject)
        this.scenes = [...savedGameObject.json.scenes]
        this.characters = [...savedGameObject.json.characters]
      } else {
        this.scenes = [...defaultGame.scenes]
        this.characters = [...defaultGame.characters]
      }
      const notConfiguredCharacters = this.characters.filter(char => char.userChoose?.length)
      if (!notConfiguredCharacters.length) { this.onCharactersSetupFinished() }
      // eslint-disable-next-line no-console
      this.loaded = true
      console.log('Game booted.')
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
    },
    onGameOver () {
      InfoMessage('Игра окончена')
      this.$router.push('/')
    }
  }
}
</script>

import lsm from '@/plugins/localStorageManager'

class gameAutoSaveManager {
  savedGames = []

  constructor () {
    this.savedGames = this.getAllSaved()
  }

  getAllSaved () {
    return lsm.init().state.autoSaves
  }

  save ({ gameID, lastSceneID, characters }) {
    const gamesUnique = this.savedGames.filter(item => item.id !== gameID)

    const newSave = {
      id: gameID,
      lastSceneID,
      characters
    }
    gamesUnique.push(newSave)

    const _lsm = lsm.init()
    _lsm.state.autoSaves = gamesUnique
    _lsm.save()
  }

  getSave (gameID) {
    return this.savedGames.find(item => Number(item.id) === Number(gameID))
  }

  delete (gameID) {
    const gamesUnique = this.savedGames.filter(item => item.id !== gameID)

    const _lsm = lsm.init()
    _lsm.state.autoSaves = gamesUnique
    _lsm.save()

    this.savedGames = this.getAllSaved()
  }
}

export default gameAutoSaveManager

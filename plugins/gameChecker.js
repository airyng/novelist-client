// Версия 1 представляет собой массив сцен в качестве корневого объекта
// Версия 2 изменяет корневой массив в объект вида { scenes, characters, version }
// Версия 3 вносит изменения в формат id сцен, экшнов и персонажей
const version = 3

export default {
  isLatestVersion (game) {
    return game?.version === version
  },
  updateGameToLatestVersion (game) {
    try {
      game = this.updateToVersion2(game)
      game = this.updateToVersion3(game)

      game.version = version
      return game
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e)
      return false
    }
  },
  updateToVersion3 (game) {
    game.scenes.forEach((scene) => {
      // Обновление формата id сцен
      if (typeof scene.id === 'number') {
        scene.id = `s${scene.id}`
      }
      scene.actions.forEach((action, index) => {
        // Обновление формата id экшенов
        if (typeof action.id === 'number') {
          action.id = `a${action.id}`
        }
        if (typeof action.to === 'number') {
          action.to = `s${action.to}`
        }
        // Устанавливаем некое дефолтное значение, если его не было
        if (typeof action.sortIndex !== 'number') {
          action.sortIndex = scene.actions.length - (index + 1)
        }
      })
    })
    game.characters.forEach((char) => {
      if (typeof char.uid === 'number') {
        char.uid = `c${char.uid}`
      }
    })
    return game
  },
  updateToVersion2 (game) {
    // Проверка на корректность структуры
    if (!game?.scenes) {
      game = {
        scenes: game,
        characters: []
      }
    }
    // Исправление структуры данных бекграундов
    game?.scenes.forEach((element) => {
      if (element.background && !element.background.type) {
        if (element.background.url) {
          element.background = {
            value: element.background.url,
            type: 'image'
          }
        }
      }
      return element
    })
    return game
  }
}

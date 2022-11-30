// Версия 0 представляет собой массив сцен в качестве корневого объекта
// Версия 1 представляет собой объект вида { scenes, characters, version }
const version = 1

export default {
  isLatestVersion (game) {
    return game?.version === version
  },
  // Думаю, нужно автоматически обновлять на сервере исправленный json,
  // чтобы больше не править его лишний раз
  updateGameToLatestVersion (game) {
    // Проверка на корректность структуры
    // Ошибка после нулевой версии
    if (!game.scenes) {
      game = {
        scenes: game,
        characters: []
      }
    }
    // Ошибка после нулевой версии
    game.scenes.map((element) => {
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

    game.version = version
    return game
  }
}

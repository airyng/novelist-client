const version = 1

export default {
  isLatestVersion (game) {
    // eslint-disable-next-line eqeqeq
    return game.version && game.version == version
  },
  // Думаю, нужно автоматически обновлять на сервере исправленный json,
  // чтобы больше не исправить его лишний раз
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
    game.scenes.forEach((element) => {
      if (!element.background.type) {
        if (element.background.url) {
          element.background = {
            value: element.background.url,
            type: 'image'
          }
        }
      }
    })

    game.version = version
    return game
  }
}

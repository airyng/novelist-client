const moveArrElem = (arr, oldIndex, newIndex) => {
  if (newIndex >= arr.length) {
    let k = newIndex - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0])
  return arr
}

const getGameBannerFromScenes = (_scenes) => {
  const scenes = Array.isArray(_scenes) ? [..._scenes] : { ..._scenes.scenes }
  if (
    scenes &&
    scenes[0] &&
    scenes[0] &&
    scenes[0].background &&
    (scenes[0].background.url || scenes[0].background.value)
  ) {
    const url = scenes[0].background.url || scenes[0].background.value
    if (url.indexOf(process.env.BACKEND_URL) === 0) {
      return url
    } else {
      return process.env.BACKEND_URL + url
    }
  } else {
    return process.env.BACKEND_URL + '/storage/backgrounds/default.jpg'
  }
}

const excerpt = (text, maxLength) => {
  if (!text || !text.length) { return '...' }
  if (text.length <= maxLength) {
    return text
  } else {
    return text.substring(0, maxLength) + '...'
  }
}

// sleep function for simulating server response delay
async function sleep (timeout = 1500) {
  await new Promise(resolve => setTimeout(() => resolve(), timeout))
}

const getGenderTranslation = (gender) => {
  const genders = {
    Male: 'Мужской',
    Female: 'Женский'
  }
  return genders[gender]
}

export {
  excerpt,
  moveArrElem,
  sleep,
  getGenderTranslation,
  getGameBannerFromScenes
}

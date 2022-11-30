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

const getGameBannerFromScenes = (scenes) => {
  const background = scenes?.[0]?.background?.url || scenes?.[0]?.background?.value
  if (!background) { return 'black' }
  return background
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

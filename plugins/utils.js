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

// Проверяем является ли переданное значение каноническим идентификатором экшна
const checkIsActionId = (value) => {
  if (typeof value !== 'string') { return false }
  const searchResult = value.match?.(/^s[0-9]*/gm) // проверка на соответствие идентификатора назначения формату
  return Array.isArray(searchResult) && searchResult[0].length === value.length
}

const throttle = function (func, ms) {
  let isThrottled = false
  let savedArgs
  let savedThis

  function wrapper () {
    if (isThrottled) { // (2)
      savedArgs = arguments
      savedThis = this
      return
    }

    func.apply(this, arguments) // (1)

    isThrottled = true

    setTimeout(function () {
      isThrottled = false // (3)
      if (savedArgs) {
        wrapper.apply(savedThis, savedArgs)
        savedArgs = savedThis = null
      }
    }, ms)
  }

  return wrapper
}

const debounce = (func, wait, immediate) => {
  // 'private' variable for instance
  // The returned function will be able to reference this due to closure.
  // Each call to the returned function will share this common timer.
  let timeout
  // Calling debounce returns a new anonymous function
  return function () {
    // reference the context and args for the setTimeout function
    const context = this
    const args = arguments
    // Should the function be called now? If immediate is true
    //   and not already in a timeout then the answer is: Yes
    const callNow = immediate && !timeout
    // This is the basic debounce behaviour where you can call this
    //   function several times, but it will only execute once
    //   (before or after imposing a delay).
    //   Each time the returned function is called, the timer starts over.
    clearTimeout(timeout)
    // Set the new timeout
    timeout = setTimeout(function () {
      // Inside the timeout function, clear the timeout variable
      // which will let the next execution run when in 'immediate' mode
      timeout = null
      // Check if the function already ran with the immediate flag
      if (!immediate) {
        // Call the original function with apply
        // apply lets you define the 'this' object as well as the arguments
        //    (both captured before setTimeout)
        func.apply(context, args)
      }
    }, wait)
    // Immediate mode and no wait timer? Execute the function...
    if (callNow) { func.apply(context, args) }
  }
}

export {
  excerpt,
  moveArrElem,
  sleep,
  getGenderTranslation,
  getGameBannerFromScenes,
  throttle,
  debounce,
  checkIsActionId
}

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

export {
  excerpt,
  moveArrElem,
  sleep
}

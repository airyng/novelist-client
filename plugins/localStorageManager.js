export default {
  state: {},
  _managerSlug: 'novelistLocalStorage',
  init () {
    const data = window.localStorage.getItem(this._managerSlug)
    if (!data) { this.state = this._initialState() } else {
      const parsedData = JSON.parse(data)
      this.state = typeof parsedData === 'object' ? parsedData : this._initialState()
    }
    return this
  },
  save () {
    window.localStorage.setItem(this._managerSlug, JSON.stringify(this.state))
  },
  purge () {
    window.localStorage.removeItem(this._managerSlug)
    return this.init()
  },
  clearField (fieldName) {
    if (!fieldName) { return }
    const initialState = this._initialState()
    if (this.state[fieldName] && initialState[fieldName]) {
      this.state[fieldName] = initialState[fieldName]
      this.save()
      return this
    } else {
      // eslint-disable-next-line no-console
      console.error('LocalStorageManager: Can\'t clear field with name: ' + fieldName)
      return false
    }
  },
  _initialState () {
    return {
      autoSaves: []
    }
  }
}

export default function ({ $atm, error }) { // ,req ,$api, store,
  try {
    const token = $atm.getToken()
    if (!token) { return error({ statusCode: 401 }) }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err)
  }
}

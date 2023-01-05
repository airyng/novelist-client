export default {
  device () {
    let device = 'Unknown'
    const ua = {
      'Generic Linux': /Linux/i,
      Android: /Android/i,
      BlackBerry: /BlackBerry/i,
      Bluebird: /EF500/i,
      'Chrome OS': /CrOS/i,
      Datalogic: /DL-AXIS/i,
      Honeywell: /CT50/i,
      iPad: /iPad/i,
      iPhone: /iPhone/i,
      iPod: /iPod/i,
      macOS: /Macintosh/i,
      Windows: /IEMobile|Windows/i,
      Zebra: /TC70|TC55/i
    }
    Object.keys(ua).map(v => navigator.userAgent.match(ua[v]) && (device = v))
    return device
  },
  browserName () {
    const userAgent = navigator.userAgent
    let browserName

    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = 'chrome'
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = 'firefox'
    } else if (userAgent.match(/safari/i)) {
      browserName = 'safari'
    } else if (userAgent.match(/opr\//i)) {
      browserName = 'opera'
    } else if (userAgent.match(/edg/i)) {
      browserName = 'edge'
    } else {
      browserName = 'Unknown'
    }
    return browserName
  },
  dimensions () {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }
}

import { FC } from 'react'

export const loadJS     = (url: string, name: string) => {
  const existing = document.getElementById(name + '-script')
  const script   = document.createElement('script')
  const promise  = new Promise((resolve, reject) => {
    if (existing) {
      resolve(existing)
      return
    }
    script.onerror = reject
    script.onload  = resolve
    script.async   = true
    script.src     = url
    script.id      = name + '-script'
    document.body.appendChild(script)
  })
  return promise.then(() => {
    return global[name].default
  }).catch((e) => {
    document.body.removeChild(existing || script)
    throw e
  })
}
export const loadCSS    = (url: string, name: string) => {
  const existing = document.getElementById(name + '-styles')
  const link     = document.createElement('link')
  return new Promise((resolve, reject) => {
    if (existing) {
      resolve(null)
      return
    }
    link.onerror = reject
    link.onload  = resolve
    link.rel     = 'stylesheet'
    link.type    = 'text/css'
    link.id      = name + '-styles'
    link.href    = url
    document.head.appendChild(link)
  }).catch((e) => {
    document.head.removeChild(existing || link)
    throw e
  })
}
export const loadBundle = async (name: string, cssFile: string, jsFile: string, fallback: FC) => {
  try {
    // In dev mode, CRA does not produce a separate CSS bundle
    if (process.env.NODE_ENV !== 'development' && cssFile) {
      await loadCSS(cssFile, name)
    }
    return await loadJS(jsFile, name)
  } catch (e) {
    console.log('Could Not Load Resources for Micro App', name, e)
    return fallback
  }
}

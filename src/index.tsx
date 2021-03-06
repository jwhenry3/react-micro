import _MicroApp                                          from './MicroApp'
import { Component, FC }                                  from 'react'


export const MicroApp = _MicroApp
export type { ExternalMicroAppProps, LocalMicroAppProps } from './MicroApp'
export const exposeMicroApp = (name: string, root: Component<any> | FC) => {
  global[name] = {
    default: root
  }
}

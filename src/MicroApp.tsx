import loadable               from 'react-loadable'
import { FC, lazy, Suspense } from 'react'
import ErrorBoundary          from './ErrorBoundary'
import { PageNotFound }       from './PageNotFound'
import { Loading }            from './Loading'
import { loadBundle }         from './lib/load'
import { SomethingWentWrong } from './SomethingWentWrong'
import React                  from 'react'

export interface ExternalMicroAppProps {
  name: string
  cssFile?: string
  jsFile: string
  baseRoute?: string
  pageNotFound?: FC
  somethingWentWrong?: FC
  loading?: FC
}

export interface LocalMicroAppProps {
  name: string
  importPromise: Promise<any>
  baseRoute?: string
  pageNotFound?: FC
  somethingWentWrong?: FC
  loading?: FC
}

export const ExternallyLoaded = ({ cssFile, jsFile, name, pageNotFound, loading, somethingWentWrong, ...rest }: ExternalMicroAppProps & any) => {
  const Loadable = loadable({
    loader : () => loadBundle(name, cssFile, jsFile, pageNotFound || PageNotFound),
    loading: loading || Loading
  })
  return <Loadable {...rest} />
}
export const LazyLoaded       = ({ name, importPromise, pageNotFound, loading, somethingWentWrong, ...rest }: LocalMicroAppProps & any) => {
  const Loadable = lazy(() => importPromise.catch(e => ({ default: pageNotFound || PageNotFound })))
  const Loader   = loading || Loading
  return <Suspense fallback={<Loader/>}><Loadable {...rest} /></Suspense>
}
const MicroApp                = (props: (ExternalMicroAppProps | LocalMicroAppProps) & any) => {
  return <ErrorBoundary name={props.name} fallback={props.somethingWentWrong || SomethingWentWrong}>
    {props.hasOwnProperty('importPromise') ? <LazyLoaded  {...props} /> : <ExternallyLoaded  {...props} />}
  </ErrorBoundary>
}

export default MicroApp

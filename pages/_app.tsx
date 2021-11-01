import React from 'react'
import { IdProvider } from '@radix-ui/react-id'
import { globalStyles } from '@theme'
import { AnimatePresence } from 'framer-motion'

export default function App({ Component, pageProps, router }) {
  globalStyles()
  return (
    <IdProvider>
      <AnimatePresence exitBeforeEnter>
        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </IdProvider>
  )
}

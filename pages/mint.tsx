import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import { createMachine, assign } from 'xstate'
import { createModel } from 'xstate/lib/model'
import { useMachine } from '@xstate/react'
import { styled } from '@theme'
import React from 'react'
import dynamic from 'next/dynamic'
import { slateDark } from '@radix-ui/colors'
import { motion } from 'framer-motion'
import { FaTwitter, FaDiscord } from 'react-icons/fa'
import { elementScrollIntoView } from 'seamless-scroll-polyfill'
import { useRouter } from 'next/router'

const Line = dynamic(() => import('components/line'), { ssr: false })

const View = styled(motion.div, {
  display: 'flex',
})

const Text = styled(motion.span, {})

const Title = styled('h1', {
  color: 'white',
  fontSize: 36,
  fontWeight: 900,
  mb: 5,
  mt: 0,
})

const Button = styled(motion.button, {
  color: 'white',
  background: 'black',
  textAlign: 'center',
  width: 'min-content',
  height: 'min-content',
  whiteSpace: 'nowrap',
  fontWeight: 900,
  fontSize: '$md',
  py: 2,
  px: 9,
})

const KeyInput = styled(motion.input, {
  p: 10,
  my: 10,
  backgroundColor: 'black',
  border: '2px white solid',
  width: '100%',
  fontSize: 18,
  color: 'white',
  borderRadius: 0,
  '&::placeholder': {
    color: 'slateDark.slate9',
  },
})

export default function App() {
  useLayoutEffect(() => {
    console.log(
      '%cyou trying to be a shadowy super coder?\n\nnonono, go away\n',
      'font-size: 24px; font-family: sans-serif; font-weight: 900',
    )
  })
  return (
    <View
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 1,
          ease: [0, 0.1, 0.6, 1],
        },
      }}
      css={{ height: '100vh' }}
    >
      <View css={{ my: 'auto' }}>
        <Line color={255} height={500} />
      </View>
      <View
        css={{
          height: '100vh',
          color: 'white',
          flexDirection: 'column',
          p: '1rem',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          '::selection': {
            background: 'white',
            color: 'black',
          },
        }}
      >
        <Text>/0</Text>
        <View
          css={{
            p: 30,
            flexDirection: 'column',
            maxWidth: 400,
            mx: 'auto',
            my: 'auto',
            backgroundColor: 'black',
            border: '5px solid white',
          }}
        >
          <Title>Hi!</Title>
          <Text>looks like you may need a key, idk tho</Text>
          <View
            css={{
              mt: 75,
              flexDirection: 'column',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            <Text>please insert your key below:</Text>
            <KeyInput placeholder="******************************" />
          </View>
        </View>
        <View
          css={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 10,
            height: 10,
            backgroundColor: 'white',
          }}
        />
        <style jsx global>{`
          html {
            color-scheme: 'dark';
            background: black;
          }
        `}</style>
      </View>
    </View>
  )
}

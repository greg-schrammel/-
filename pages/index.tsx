import { useLayoutEffect, useState, useEffect } from 'react'
import { createMachine, assign } from 'xstate'
import { createModel } from 'xstate/lib/model'
import { useMachine } from '@xstate/react'
import { styled } from '@theme'
import React from 'react'
import dynamic from 'next/dynamic'
import { slate } from '@radix-ui/colors'
import { motion } from 'framer-motion'
import { FaTwitter, FaDiscord } from 'react-icons/fa'
import { elementScrollIntoView, elementScrollIntoViewPolyfill } from 'seamless-scroll-polyfill'
import { useRouter } from 'next/router'

const Line = dynamic(() => import('components/line'), { ssr: false })

const View = styled(motion.div, {
  display: 'flex',
})

const Text = styled(motion.span, {})

const Title = styled('h1', {
  color: 'black',
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

// too slow
const dialogues = [
  'oh you thought it would be this easy? try harder',
  'ok you got the spirit',
  "but it still ain't it anon",
  `for real this is the wrong button, stop`,
  'just STOP pressing it bro',
  'omg how annoying',
  `fine, I'll show you how to mint, please scroll down`,
  `wtf, why you still here? SCROLL DOWN`,
  `Oh there's nothing down there? lol give me a moment`,
  `you can scroll down now`,
]
const timedOutDialogue = 'too slow, better luck next time'
const reetryDialogs = [
  `you'r back??`,
  `I like you, but no you won't get another chance`,
  'bye bye',
  `alright I'll take you this time, just don't tell anyone ok`,
]

const second = 1000

const linesMintModel = createModel({
  stage: 0 as number,
  dialogue: null as string,
})

const lineMintMachine = createMachine({
  id: 'mint',
  initial: 'idle',
  context: linesMintModel.initialContext,
  states: {
    idle: {
      entry: linesMintModel.assign(linesMintModel.initialContext),
      on: {
        tapMint: [
          { target: 'reetry', cond: () => !!localStorage.getItem('beenHere') },
          { target: 'talking' },
        ],
      },
    },
    reetry: {
      id: 'reetry',
      initial: 'talking',
      states: {
        talking: {
          entry: linesMintModel.assign({
            dialogue: (ctx) => reetryDialogs[ctx.stage],
            stage: (ctx) => ctx.stage + 1,
          }),
          after: {
            [3 * second]: {
              target: '#mint.goMint',
              cond: (ctx) => ctx.stage === reetryDialogs.length,
            },
            [4 * second]: { target: '#reetry.waiting' },
          },
        },
        waiting: {
          after: { [30 * second]: { target: '#mint.idle' } },
        },
      },
      on: {
        tapMint: {
          target: '#reetry.talking',
          cond: (ctx) => ctx.stage <= reetryDialogs.length,
        },
      },
    },
    waiting: {
      after: { [20 * second]: { target: 'timedOut', cond: (ctx) => ctx.stage >= 2 } },
      on: {
        tapMint: 'talking',
      },
    },
    talking: {
      entry: linesMintModel.assign({
        dialogue: (ctx) => dialogues[ctx.stage],
        stage: (ctx) => ctx.stage + 1,
      }),
      always: { target: 'takingToMint', cond: (ctx) => ctx.stage === dialogues.length },
      after: { [4 * second]: { target: 'waiting' } },
      on: { tapMint: 'talking' },
    },
    timedOut: {
      entry: linesMintModel.assign({ dialogue: null }),
      on: {
        tapMint: {
          actions: assign({ stage: 0, dialogue: timedOutDialogue }),
        },
      },
      after: {
        [30 * second]: { target: 'idle' },
      },
    },
    goMint: {
      entry: ['setUserEndedInitialMintFlow', 'redirectMint'],
    },
    takingToMint: {
      entry: linesMintModel.assign({ dialogue: dialogues[dialogues.length - 1] }),
      on: {
        reachedBottomOfPage: 'goMint',
      },
      // after: {
      //   // [1 * second]: { actions: 'scrollToBottom' },
      //   [3 * second]: { target: 'goMint' },
      // },
    },
  },
})

const MintButton = ({ state, send }) => {
  return (
    <View css={{ flexDirection: 'column' }}>
      <Button
        // css={{ alignSelf: 'end', justifySelf: 'start' }}
        onTap={() => send('tapMint')}
        whileTap={{ background: 'black', color: 'white' }}
        whileHover={{ color: 'black', background: 'white', outline: '2px solid black' }}
      >
        mint a line
      </Button>
      <View css={{ position: 'relative', height: 'min-content' }}>
        <View
          css={{
            position: 'absolute',
            top: 5,
            left: 0,
            background: 'white',
            // border: '1px solid black',
            width: 'max-content',
            my: 3,
            maxWidth: 200,
          }}
        >
          {['talking', 'reetry.talking', 'takingToMint'].some(state.matches) && (
            <Text>{state.context.dialogue}</Text>
          )}
          {state.value === 'timedOut' && <Text>{state.context.dialogue}</Text>}
          {state.value === 'ended' && <Text>{state.context.dialogue}</Text>}
          {/* {state.value === 'takingToMint' && (
            <Text
              css={{
                position: 'fixed',
                width: 250,
                mx: 'auto',
                background: 'white',
              }}
            >
              {state.context.dialogue}
            </Text>
          )} */}
        </View>
      </View>
    </View>
  )
}

const useReachedBottomOfPage = (fn) => {
  const handleScroll = () => {
    const bottom =
      Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight
    if (bottom) fn()
  }
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
}

export default function App() {
  const router = useRouter()
  const [state, send] = useMachine(lineMintMachine, {
    actions: {
      scrollToBottom: () =>
        elementScrollIntoView(document.querySelector('#bottom'), { behavior: 'smooth' }),
      setUserEndedInitialMintFlow: () => localStorage.setItem('beenHere', 'yep'),
      redirectMint: () => router.replace('/mint', '/', { scroll: false }),
    },
  })
  useEffect(() => {
    router.prefetch('/mint')
  }, [])
  useReachedBottomOfPage(() => send('reachedBottomOfPage'))

  return (
    <View
      css={{
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        '::selection': {
          background: 'black',
          color: 'white',
        },
      }}
      exit={{
        filter: 'invert(1)',
        opacity: 0,
        transition: {
          duration: 1,
          ease: [0, 0.1, 0.6, 1],
        },
      }}
    >
      <View
        css={{
          flexDirection: 'column',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
      >
        <View css={{ flexDirection: 'column', minHeight: '100vh', minWidth: '100vw' }}>
          <View css={{ justifyContent: 'space-between' }}>
            <View
              css={{
                flexDirection: 'column',
                px: 60,
                py: 50,
                gap: 12,
              }}
            >
              <View css={{ flexDirection: 'column' }}>
                <Title>lines [—]</Title>
                <Text css={{ color: slate.slate9, fontWeight: 500, fontSize: '$md' }}>
                  "500 procedurally generated lines"
                </Text>
              </View>
              <MintButton state={state} send={send} />
            </View>
          </View>
        </View>
        {['takingToMint', 'goMint'].some(state.matches) && (
          <>
            <View
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              css={{ height: 500, my: 150 }}
            />
            <Text
              initial={{ rotate: 200 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 5 }}
              css={{
                fontSize: 120,
                filter: 'grayscale(100%)',
                mb: 150,
                transform: 'scale(5)',
              }}
            >
              🖕
            </Text>
          </>
        )}

        <div id="bottom" />
      </View>
      <View css={{ mt: 100 }}>
        <Line color={0} height={500} />
      </View>
    </View>
  )
}

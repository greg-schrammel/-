import { createStitches } from '@stitches/react'

export const { styled, css, getCssText, globalCss } = createStitches({
  theme: {
    space: {
      1: '5px',
      2: '10px',
      3: '15px',
    },
    fontSizes: {
      xxs: '10px',
      xs: '12px',
      sm: '14px',
      regular: '16px',
      md: '18px',
      lg: '24px',
      xl: '36px',
      xxl: '48px',
    },
    fonts: {
      sans: `'Circular', apple-system, sans-serif`,
      mono: 'Söhne Mono, menlo, monospace',
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
  },
  utils: {
    // Abbreviated margin properties
    m: (value) => ({
      marginTop: value,
      marginBottom: value,
      marginLeft: value,
      marginRight: value,
    }),
    mt: (value) => ({
      marginTop: value,
    }),
    mr: (value) => ({
      marginRight: value,
    }),
    mb: (value) => ({
      marginBottom: value,
    }),
    ml: (value) => ({
      marginLeft: value,
    }),
    mx: (value) => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: (value) => ({
      marginTop: value,
      marginBottom: value,
    }),
    // Abbreviated padding properties
    p: (value) => ({
      paddingTop: value,
      paddingBottom: value,
      paddingLeft: value,
      paddingRight: value,
    }),
    pt: (value) => ({
      paddingTop: value,
    }),
    pr: (value) => ({
      paddingRight: value,
    }),
    pb: (value) => ({
      paddingBottom: value,
    }),
    pl: (value) => ({
      paddingLeft: value,
    }),
    px: (value) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
  },
})

export const globalStyles = globalCss({
  html: {
    // 'color-scheme': 'dark',
    backgroundColor: '$background',
    overflowX: 'hidden',
  },
  body: {
    margin: 0,
    minHeight: '100vh',
    maxWidth: '100vw',
  },
  '#__next': {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    '&>div': {
      width: '100%',
    },
  },
  '*': {
    fontFamily: '$sans',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    boxShadow: 'none',
    border: 'none',
    boxSizing: 'border-box',
    listStyleType: 'none',
  },
  '*:focus': {
    outline: 'none',
  },
  a: {
    textDecoration: 'none',
    cursor: 'pointer',
  },
})

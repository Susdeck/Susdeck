/* eslint-disable no-undef */
const susdeckUniversal = {
  themes: {
    // Built-in themes.
    Default: [
      { 'template-columns': 'repeat(4,1fr)' },
      { 'font-family': 'Inter' }
    ]
  },
  hasConnected: false
}

socket.on('server_connected', () => {
  if (susdeckUniversal.hasConnected) { socket.emit('Reloadme') }
  susdeckUniversal.hasConnected = true
})

const rootElem = document.querySelector(':root')

// because theming is cool
if (!localStorage.getItem('sd-theme')) {
  localStorage.setItem('sd-theme', JSON.stringify(susdeckUniversal.themes.Default))
}
localStorage.setItem('sd-theme', JSON.stringify(susdeckUniversal.themes.Default))

const userTheme = JSON.parse(localStorage.getItem('sd-theme'))

// Setup the user's theme
userTheme.forEach(property => {
  Object.keys(property).forEach(key => {
    rootElem.style.setProperty(`--sd-${key}`, property[key])
  })
})

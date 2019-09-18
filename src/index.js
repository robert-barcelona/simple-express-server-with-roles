import server from './server'

let started = false

const run = async () => {
  if (started) return
  try {
    await server()
    // eslint-disable-next-line require-atomic-updates
    started = true
  } catch (e) {
    console.log(`error starting server ${e.message}`)
  }
}

run().then(() => console.log('started application'))

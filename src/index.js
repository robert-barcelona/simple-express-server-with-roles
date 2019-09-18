import server from './server'


const run = async () => {
  try {
    await server()
  } catch (e) {
    console.log(`error starting server ${e.message}`)
  }
}

run().then(() => console.log('started application'))

import app from './app'

app.listen(process.env.APP_PORT || 3333, () => {
  console.log(`=> Server is running in port: ${process.env.APP_PORT}`)
  console.log(`=> Debug is: ${process.env.APP_DEBUG}`)
})

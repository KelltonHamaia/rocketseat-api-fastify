import { server } from './app.ts'

await server.listen({ port: 3333, host: '0.0.0.0 ' }).then(() => {
    console.log('Running!')
})

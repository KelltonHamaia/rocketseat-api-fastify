import { server } from './app.ts'

await server.listen({ port: 3333 }).then(() => {
    console.log('Running!')
})

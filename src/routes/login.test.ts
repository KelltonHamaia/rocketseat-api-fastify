import { it, expect } from 'vitest'
import supertest from 'supertest'
import { server } from '../app.ts'
import { makeUser } from '../tests/factories/make-user.ts'

it('Should login an user successfully', async () => {
    await server.ready()
    const { user, passwordBeforeHash } = await makeUser()

    const response = await supertest(server.server)
        .post('/sessions')
        .set('Content-type', 'Application/json')
        .send({
            email: user.email,
            password: passwordBeforeHash,
        })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
        token: expect.any(String),
    })
})

import supertest from 'supertest'
import { expect, it } from 'vitest'
import { server } from '../app.ts'
import { randomUUID } from 'node:crypto'
import { makeCourse } from '../tests/factories/make-course.ts'
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts'

it('should list all courses', async () => {
    await server.ready()

    const titleId = randomUUID()
    const course = await makeCourse(titleId)
    const { token } = await makeAuthenticatedUser('manager')

    const response = await supertest(server.server)
        .get(`/courses?search=${course.title}`)
        .set('Authorization', token)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
        total: expect.any(Number),
        courses: expect.any(
            Array<{
                id: number
                title: string
                enrollments: number
            }>
        ),
    })
})

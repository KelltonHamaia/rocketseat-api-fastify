import supertest from 'supertest'
import { expect, it } from 'vitest'
import { server } from '../app.ts'
import { makeCourse } from '../tests/factories/make-course.ts'
import { makeAuthenticatedUser } from '../tests/factories/make-user.ts'

it('Should find a course based on the provided id', async () => {
    await server.ready()
    const { token } = await makeAuthenticatedUser('student')
    const course = await makeCourse()

    const response = await supertest(server.server)
        .get(`/courses/${course.id}`)
        .set('Authorization', token)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
        course: {
            id: expect.any(String),
            title: expect.any(String),
            description: null,
        },
    })
})

it('Should return nothing but a 404 status when a course is not found', async () => {
    await server.ready()
    const { token } = await makeAuthenticatedUser('student')
    const courseId = 'CBA2E131-C83C-471C-9DAC-4F4A84B55476'
    const response = await supertest(server.server)
        .get(`/courses/${courseId}`)
        .set('Authorization', token)

    expect(response.status).toBe(404)
})

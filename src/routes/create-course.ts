import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import { checkRequestJWT } from './hooks/check-request-jwt.ts'
import { checkUserRole } from './hooks/check-user-role.ts'

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
    server.post(
        '/courses',
        {
            preHandler: [checkRequestJWT, checkUserRole('manager')],
            schema: {
                tags: ['courses'],
                summary: 'Create a course',
                description:
                    'This route gets a title and optionally a description, then it creates a new course.',
                body: z.object({
                    title: z.string().min(5, 'title too short'),
                    description: z.string().optional(),
                }),
                response: {
                    201: z.object({ courseId: z.uuid() }),
                    500: z.object({ message: z.string() }),
                },
            },
        },
        async (request, reply) => {
            const { title, description } = request.body

            const result = await db
                .insert(courses)
                .values({
                    title: title,
                    description: description,
                })
                .returning()

            if (!result || result.length < 0) {
                return reply.status(500).send({ message: 'Internal Server Error.' })
            }

            return reply.status(201).send({ courseId: result[0].id })
        }
    )
}

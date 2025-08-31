import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../database/client.ts'
import { courses } from '../database/schema.ts'
import { checkRequestJWT } from './hooks/check-request-jwt.ts'
import { getAuthenticatedUserFromRequest } from '../utils/get-authenticated-user-from-request.ts'

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
    server.get(
        '/courses/:id',
        {
            preHandler: [checkRequestJWT],
            schema: {
                tags: ['courses'],
                summary: 'Get course by id',
                description: 'Get course by id',
                response: {
                    200: z.object({
                        course: z.object({
                            id: z.string(),
                            title: z.string(),
                            description: z.string().nullable(),
                        }),
                    }),
                    404: z.null().describe('Course not found'),
                },
                params: z.object({
                    id: z.uuid(),
                }),
            },
        },
        async (request, reply) => {
            const user = getAuthenticatedUserFromRequest(request)

            const { id } = request.params

            const result = await db
                .select({
                    id: courses.id,
                    title: courses.title,
                    description: courses.description,
                })
                .from(courses)
                .where(eq(courses.id, id))

            if (!result || result.length === 0) {
                return reply.status(404).send()
            }

            return reply.status(200).send({ course: result[0] })
        }
    )
}

import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { registerUseCase } from '../../use-cases/register'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const dto = registerBodySchema.parse(request.body)

  try {
    await registerUseCase(dto)
  } catch (error) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}

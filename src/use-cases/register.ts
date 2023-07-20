import { hash } from 'bcryptjs'
import { prisma } from '../lib/prisma'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCase(dto: RegisterUseCaseRequest) {
  const password_hash = await hash(dto.password, 6)

  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email: dto.email,
    },
  })

  if (userWithSameEmail) {
    throw new Error('E-mail already exists.')
  }

  await prisma.user.create({
    data: {
      name: dto.name,
      email: dto.email,
      password_hash,
    },
  })
}

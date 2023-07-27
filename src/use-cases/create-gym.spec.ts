import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create a new gym', async () => {
    const { gym } = await sut.execute({
      title: 'Typescript Gym',
      description: null,
      phone: null,
      latitude: -29.6825724,
      longitude: -53.8037892,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})

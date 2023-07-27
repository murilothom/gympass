import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '../repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let usersRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    usersRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(usersRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -29.6825724,
      longitude: -53.8037892,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -29.6825724,
      userLongitude: -53.8037892,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 6, 25, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -29.6825724,
      userLongitude: -53.8037892,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -29.6825724,
        userLongitude: -53.8037892,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different day', async () => {
    vi.setSystemTime(new Date(2023, 6, 25, 8, 0, 0))

    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -29.6825724,
      userLongitude: -53.8037892,
    })

    vi.setSystemTime(new Date(2023, 6, 26, 8, 0, 0))

    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -29.6825724,
      userLongitude: -53.8037892,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: 'gym-02',
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: -29.7193661,
      longitude: -53.715205,
    })

    await expect(() =>
      sut.execute({
        userId: 'user-02',
        gymId: 'gym-02',
        userLatitude: -29.6825724,
        userLongitude: -53.8037892,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})

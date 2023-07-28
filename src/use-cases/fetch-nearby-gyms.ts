import { Gym } from '@prisma/client'
import { GymsRepository } from '../repositories/gyms-repository'

interface FetchNearByGymUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface FetchNearByGymUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearByGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearByGymUseCaseRequest): Promise<FetchNearByGymUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    return {
      gyms,
    }
  }
}

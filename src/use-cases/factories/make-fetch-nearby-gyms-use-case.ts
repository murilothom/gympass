import { PrismaGymsRepository } from '../../repositories/prisma/prisma-gyms-repository'
import { FetchNearByGymUseCase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const fetchNearbyGymsUseCase = new FetchNearByGymUseCase(gymsRepository)

  return fetchNearbyGymsUseCase
}

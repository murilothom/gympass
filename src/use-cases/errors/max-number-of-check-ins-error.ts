export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('Max Number of check-ins reached.')
  }
}

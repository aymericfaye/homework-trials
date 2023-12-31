import {CountryCode, Sponsor, Trial} from "./Config"

export class TrialsService {
  trials: Trial[]

  constructor(trials: Trial[]) {
    this.trials = trials
  }

  // Main function to perform the search
  // TODO: Limit the search result in case of a large dataset
  find(countryCode?: CountryCode, sponsor?: Sponsor, date?: Date): Array<Trial> {
    return this.trials.filter(
      t => {
        const hasCountry = countryCode ? t.countryCode.toLowerCase() == countryCode.toLowerCase() : true
        const hasSponsor = sponsor ? t.sponsor.toLowerCase() == sponsor.toLowerCase() : true
        const isOnGoing = date ? (t.startDate < date && date < t.endDate) : true

        return hasCountry && hasSponsor && isOnGoing
      }
    )
  }
}

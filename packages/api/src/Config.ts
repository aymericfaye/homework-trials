import rawCountries from "../data/countries.json"
import rawSponsors from "../data/sponsors.json"
import rawTrials from "../data/trials.json"

export type CountryCode = string

export type Country = {
  name: string,
  code: CountryCode,
}

export type Sponsor = string

export type Trial = {
  name: string,
  countryCode: CountryCode,
  startDate: Date,
  endDate: Date,
  sponsor: Sponsor,
  canceled: boolean,
  studyType: string,
  primaryPurpose: string,
}

export type Config = {
  countries: Country[],
  sponsors: Sponsor[],
  trials: Trial[],
}

// Load app configuration, throw if any error occurs
// Ideally, should return a type of the form Either<Config, ValidationErrors[]>
export function loadConfig(): Config {
  const countries: Country[] = rawCountries.map(
    t => ({
      name: t.name,
      code: t.code.toUpperCase()
    })
  )
  const sponsors: Sponsor[] = rawSponsors

  const trials: Trial[] = rawTrials.map(
    t => ({
      name: t.name,
      countryCode: t.country.toUpperCase(),
      startDate: new Date(t.start_date),
      endDate: new Date(t.end_date),
      sponsor: t.sponsor,
      canceled: t.canceled,
      studyType: t.study_type,
      primaryPurpose: t.primary_purpose,
    })
  )

  // Validate trials
  trials.forEach(
    t => {
      if (!countries.find(c => c.code == t.countryCode)) {
        throw `Invalid country code for trial ${t.name}`
      }
      if (t.startDate > t.endDate) {
        throw `Invalid trial dates for trial ${t.name}`
      }
      if (!sponsors.find(s => s == t.sponsor)) {
        throw `Invalid sponsor for trial ${t.name}`
      }
    }
  )

  return {
    countries: countries,
    sponsors: sponsors,
    trials: trials
  }
}

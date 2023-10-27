import { program } from "commander";
import { fetchJsonAs, QueryParam } from "./FetchUtils";

type Trial = {
  name: string,
  start_date: string,
  end_date: string,
  sponsor?: string,
  country?: string,
}

async function fetchOngoingTrials(country?: string, sponsor?: string): Promise<Trial[]> {
  let searchParams: QueryParam[] = []
  if (country) searchParams = searchParams.concat({ name: "country", value: country })
  if (sponsor) searchParams = searchParams.concat({ name: "sponsor", value: sponsor })
  return await fetchJsonAs<Trial[]>("http://localhost:8080/trials/ongoing", searchParams)
}

function formatTrial(trial: Trial): string {
  let result = trial.name
  if (trial.country) result += `, ${trial.country}`
  if (trial.sponsor) result += `, ${trial.sponsor}`
  return result
}

program
  .name("inato-cli")
  .description("Get the list of clinical trials from Inato API.")
  .option("-c, --country <value>", "filter by country code (FR, UK, etc.)")
  .option("-s, --sponsor <value>", "filter by sponsor")
  .parseAsync(process.argv)

const options = program.opts()

fetchOngoingTrials(options.country, options.sponsor)
  .then(
    trials => trials.forEach(
      t => console.log(formatTrial(t))
    )
  )
  .catch(error => console.log('Failed to fetch trials data.'))

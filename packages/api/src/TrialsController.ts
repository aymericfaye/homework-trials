import { Request, Response } from "express"
import moment from "moment"
import { Country } from "./Config"
import { TrialsService } from "./TrialsService"

type OnGoingReqQuery = {
  country?: string;
  sponsor?: string;
}

export class TrialsController {
  trialsService: TrialsService
  countries: Country[]

  constructor(trialsService: TrialsService, countries: Country[]) {
    this.trialsService = trialsService
    this.countries = countries
  }
  
  onGoing = (req: Request<{}, {}, {}, OnGoingReqQuery>, res: Response) => {
    const { country, sponsor } = req.query
    const now = new Date(Date.now())
    const result = this.trialsService.find(country, sponsor, now).map(
      t => {
        return {
          name: t.name,
          start_date: (moment(t.startDate)).format("YYYY-MM-DD"),
          end_date: (moment(t.endDate)).format("YYYY-MM-DD"),
          country: country && this.countries.find(c => c.code == t.countryCode)?.name,
          sponsor: sponsor && t.sponsor,
        }
      }
    )
    res.send(result)
  }
}

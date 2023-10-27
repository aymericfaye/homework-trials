import { Request, Response } from "express"
import moment from "moment"
import { TrialsService } from "../../trials/src/TrialsService"

type OnGoingReqQuery = {
  country?: string;
  sponsor?: string;
}

export class TrialsController {
  trialsService: TrialsService

  constructor(trialsService: TrialsService) {
    this.trialsService = trialsService
  }
  
  onGoing(req: Request<{}, {}, {}, OnGoingReqQuery>, res: Response) {
    const { country, sponsor } = req.query
    const now = new Date(Date.now())
    const result = this.trialsService.find(country, sponsor, now).map(
      t => {
        return {
          name: t.name,
          start_date: (moment(t.startDate)).format("YYYY-MM-DD"),
          end_date: (moment(t.endDate)).format("YYYY-MM-DD"),
          sponsor: t.sponsor,
        }
      }
    )
    res.send(result)
  }
}

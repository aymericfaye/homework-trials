import { expect } from "chai"
import { loadConfig } from "../src/Config"
import { Trial } from "../src/Config"
import { TrialsService } from "../src/TrialsService"

export function describe(desc: string, suite: () => Array<number>): void {
  console.log(`${desc} should`)
  const results = suite()
  const success = results.reduce((a, b) => a + b)
  if (results.length == success) {
    process.stdout.write("\u001b[32m")
  }
  console.log(`${success}/${results.length} tests passed`)
}

export function should(desc: string, test: () => void): number {
  try {
    process.stdout.write(`  ${desc}...`)
    test()
    process.stdout.write(" ok\n")
    return 1
  } catch (error) {
    console.log(`\n\u001b[31m${error}`)
    console.log(`\nFailed\u001b[37m`)
    return 0
  }
}

// FIXME: We should use test data instead
const config = loadConfig()
const trialsService = new TrialsService(config.trials)

describe("TrialsService", () => [
  should("return all available trials", () => {
    const trials = trialsService.find()
    expect(trials.length).to.equal(6)
  }),

  should("filter trials by country", () => {
    const trials = trialsService.find("FR")
    expect(trials.length).to.equal(2)
    trials.forEach(
      t => expect(t.countryCode).to.equal("FR")
    )
  }),

  should("filter trials by sponsor", () => {
    const trials = trialsService.find(undefined, "Sanofi")
    expect(trials.length).to.equal(3)
    trials.forEach(
      t => expect(t.sponsor).to.equal("Sanofi")
    )
  }),

  should("filter ongoing trials for a given date", () => {
    const date = new Date("2021-10-01")
    const trials = trialsService.find(undefined, undefined, date)
    expect(trials.length).to.equal(5)
    trials.forEach(
      t => {
        expect(t.startDate).to.lessThan(date)
        expect(t.endDate).to.greaterThan(date)
      }
    )
  }),

  should("filter ongoing trials by country and sponsor", () => {
    const trials = trialsService.find("FR", "Sanofi", new Date("2021-10-01"))
    expect(trials.length).to.equal(2)
  }),
])
import { generateReport } from "./fhir"

const _allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let currentMonth = new Date().toLocaleString('default', { month: 'short' })
let _months = _allMonths.slice(_allMonths.indexOf(currentMonth) + 1).concat()
_months = _months.concat(_allMonths.slice(0, (_allMonths.indexOf(currentMonth) + 1)))

const allMonths = _months

export let percentageFeeds = async () => {
    // latest unique one prescribed
    let ebm = await infantsOnEBM()
    let dhm = await infantsOnDHM()
    let breastFeeding = await infantsOnBreastFeeding()
    let formula = await infantsOnFormula()
    return {
        ebm, dhm, breastFeeding, formula, oral: (breastFeeding)
    }
}

export let infantsOnDHM = async () => {
    let patientIds = []
    let infants = await generateReport("infantsOnDHM")
    for (let i of infants) {
        let x = i.resource.patient.reference
        if (patientIds.indexOf(x) < 0) {
            patientIds.push(x)
        }
    }
    let unique = [...new Set(patientIds)]
    return unique.length
}

export let infantsOnEBM = async () => {
    let patientIds = []
    let infants = await generateReport("infantsOnEBM")
    // console.log("inf", infants)
    for (let i of infants) {
        let x = i.resource.subject.reference
        if (patientIds.indexOf(x) === -1) {
            patientIds.push(x)
        }
    }
    console.log(patientIds)
    let unique = [...new Set(patientIds)]
    return unique.length
}

export let infantsOnBreastFeeding = async () => {
    let patientIds = []
    let infants = await generateReport("infantsOnBreastFeeding")
    for (let i of infants) {
        let x = i.resource.subject.reference
        if (patientIds.indexOf(x) === -1) {
            patientIds.push(x)
        }
    }
    let unique = [...new Set(patientIds)]
    return unique.length
}

export let infantsOnFormula = async () => {
    let patientIds = []
    let infants = await generateReport("infantsOnFormula")
    for (let i of infants) {
        let x = i.resource.subject
        if (patientIds.indexOf(x) < 0) {
            patientIds.push(x)
        }
    }
    let unique = [...new Set(patientIds)]
    return unique.length
}
// infantsOnDHM()
export let firstFeeding = async () => {

    let observations = await generateReport("firstFeeding")
    console.log(observations)
    let categories: { [index: string]: number } = { withinOne: 0, afterOne: 0, afterTwo: 0, afterThree: 0 }
    let _map: { [index: string]: string } = { withinOne: "Within 1 Hour", afterOne: "After 1 Hour", afterTwo: "After 2 Hours", afterThree: "After 3 Hours" }
    if (observations) {
        for (let o of observations) {
            for (let i of Object.keys(_map)) {

                if (o.resource.valueString === _map[i]) {
                    categories[i] += 1
                }
            }
        }
    }
    return categories
}


export let expressingTime = async () => {
    let patientIds = []
    let months: { [index: string]: any } = {};
    let patients: { [index: string]: number } = {};

    for (let month of allMonths) {
        months[month] = patients
    }
    let observations = await generateReport("expressingTimes")
    let categories: { [index: string]: number } = { underFive: 0, underSeven: 0, aboveSeven: 0 }

    let now = new Date()

    let lastYear = now.setFullYear(now.getFullYear() - 1)
    console.log(observations)
    for (let i of observations) {
        let date = (new Date(i.resource.valueString)).getTime()
        let month = new Date(i.resource.valueString).toLocaleString('default', { month: 'short' })
        months[month] = { [i.resource.subject.reference]: months[month][i.resource.subject.reference] || 0 }

        if (date >= lastYear) {
            months[month][i.resource.subject.reference]++
        }
    }
    // console.log(months)
    let results: Array<any> = [];
    // do the counts
    for (let i of Object.keys(months)) {
        let underFive = 0
        let underSeven = 0
        let aboveSeven = 0;
        if (months[i])
            for (let x of Object.keys(months[i])) {
                if (months[i][x] < 5) {
                    underFive++
                } else if (months[i][x] > 5 && months[i][x] < 7) {
                    underSeven++
                } else if (months[i][x] > 7) {
                    aboveSeven++
                }
            }
        results.push({
            month: i,
            underFive,
            underSeven,
            aboveSeven,
        })

    }

    // console.log(results)
    return results

}

// expressingTime()

export let calculateMortalityRateByMonth = async () => {
    let thisYear = ''
    let lastYear = ''
    return
}


export let calculateMortalityRate = async () => {
    let patients = await generateReport("allPatients")
    let count = 0
    for (let p of patients) {
        if (p.resource.id.length > 12) {
            count++
        }
    }
    let totalDeceased = 0
    let deceased = await generateReport("deceasedInfants")
    for (let p of deceased) {
        if (p.resource.id.length > 12) {
            totalDeceased++
        }
    }

    let arr: Array<any> = []
    allMonths.map((month) => {
        arr.push({
            "month": month,
            "value": 0
        })
    })

    return { rate: Math.round((totalDeceased / count) * 100) /100, data: arr }
}


export let calculateExpressingTimes = async () => {


    return
}
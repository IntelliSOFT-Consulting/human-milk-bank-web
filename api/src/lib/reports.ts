import { FhirApi, generateReport } from "./fhir"

const _allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let currentMonth = new Date().toLocaleString('default', { month: 'short' })
let _months = _allMonths.slice(_allMonths.indexOf(currentMonth) + 1).concat()
_months = _months.concat(_allMonths.slice(0, (_allMonths.indexOf(currentMonth) + 1)))

const allMonths = _months;

export let percentageFeeds = async (patient: string | null = null) => {

    let careplans = await generateReport("prescribedFeeds")
    let response: { [index: string]: number } = { dhm: 0, formula: 0, ebm: 0, iv: 0, oral: 0 }

    if (patient) {
        for (let plan of careplans) {
            let o = await FhirApi({ url: `/Observation?encounter=${plan.resource.encounter.reference}` })
            let observations = o.data.entry
            for (let _o of observations) {
                if (_o.resource.subject.reference === `Patient/${patient}`) {
                    if (_o.resource.code.coding[0].code === "Formula-Volume") {
                        response.formula += _o.resource.valueQuantity.value
                    }
                    if (_o.resource.code.coding[0].code === "DHM-Volume") {
                        response.dhm += _o.resource.valueQuantity.value
                    }
                    if (_o.resource.code.coding[0].code === "IV-Volume") {
                        response.iv += _o.resource.valueQuantity.value
                    }
                    if (_o.resource.code.coding[0].code === "EBM-Volume") {
                        response.ebm += _o.resource.valueQuantity.value
                    }
                }
            }
        }
    } else {
        for (let plan of careplans) {
            let o = await FhirApi({ url: `/Observation?encounter=${plan.resource.encounter.reference}` })
            let observations = o.data.entry
            for (let _o of observations) {
                if (_o.resource.code.coding[0].code === "Formula-Volume") {
                    response.formula += _o.resource.valueQuantity.value
                }
                if (_o.resource.code.coding[0].code === "DHM-Volume") {
                    response.dhm += _o.resource.valueQuantity.value
                }
                if (_o.resource.code.coding[0].code === "IV-Volume") {
                    response.iv += _o.resource.valueQuantity.value
                }
                if (_o.resource.code.coding[0].code === "EBM-Volume") {
                    response.ebm += _o.resource.valueQuantity.value
                }
            }

        }
    }
    let total = 0.0
    for (let i of Object.keys(response)) {
        total += response[i]
    }

    for (let i of Object.keys(response)) {
        response[i] = Math.round((response[i] / total) * 100 * 100) / 100
    }
    response.oral = response.iv
    return response
}


export let infantsOnDHM = async () => {
    let patientIds = []
    let infants = await generateReport("infantsOnDHM")
    for (let i of infants) {
        let x = i.resource.patient.reference
        if (patientIds.indexOf(x) < 0) {
            patientIds.push(x);
        }
    }
    let unique = [...new Set(patientIds)]
    return unique.length
}

export let infantsOnEBM = async () => {
    let patientIds = []
    let infants = await generateReport("infantsOnEBM")
    for (let i of infants) {
        let x = i.resource.subject.reference
        if (patientIds.indexOf(x) === -1) {
            patientIds.push(x)
        }
    }
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

export let getGestation = async (type: string) => {
    let deceasedInfants = await generateReport("deceasedInfants")
    let ids: Array<string> = []
    deceasedInfants.map((i: any) => {
        ids.push("Patient/" + i.resource.id)
    })
    let patientIds: Array<string> = []
    let infants = await generateReport((type === "preterm") ? "pretermBabies" : "termBabies")
    for (let i of infants) {
        let x = i.resource.subject.reference
        if (patientIds.indexOf(x) === -1) {
            patientIds.push(x)
        }
    }
    for (let id of ids) {
        patientIds = patientIds.filter((item: string) => item !== id)
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
export let firstFeeding = async () => {

    let observations = await generateReport("firstFeeding")
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
    let months: { [index: string]: any } = {};
    let patients: { [index: string]: number } = {};

    for (let month of allMonths) {
        months[month] = patients
    }
    let observations = await generateReport("expressingTimes")

    let now = new Date()

    let lastYear = now.setFullYear(now.getFullYear() - 1)
    for (let i of observations) {
        let date = (new Date(i.resource.valueDateTime)).getTime()
        let month = new Date(i.resource.valueDateTime).toLocaleString('default', { month: 'short' })
        months[month] = { [i.resource.subject.reference]: months[month][i.resource.subject.reference] || 0 }

        if (date >= lastYear) {
            months[month][i.resource.subject.reference]++
        }
    }
    // console.log("Months", months)
    let results: Array<any> = [];
    let underFive = 0;
    let underSeven = 0;
    let aboveSeven = 0;
    // do the counts
    for (let i of Object.keys(months)) {
        console.log(i)
        for (let x of Object.keys(months[i])) {
            if (months[i][x] < 5) {
                underFive++
            } else if (months[i][x] >= 5 && months[i][x] <= 7) {
                underSeven++
            } else if (months[i][x] > 7) {
                aboveSeven++
            }
        }
        results.push({ month: i, underFive, underSeven, aboveSeven, })
        underFive = 0; underSeven = 0; aboveSeven = 0;
    }
    return results

}


export let mortalityRateByMonth = async () => {
    let months: { [index: string]: any } = {};
    let results: Array<any> = [];


    for (let month of allMonths) {
        months[month] = { born: 0, died: 0 }
    }
    let observations = await generateReport("deceasedInfants")
    let babiesBorn = await generateReport("allBabies")

    let now = new Date()

    let lastYear = now.setFullYear(now.getFullYear() - 1)
    for (let i of observations) {
        let date = (new Date(i.resource.meta.lastUpdated)).getTime()
        let month = new Date(i.resource.meta.lastUpdated).toLocaleString('default', { month: 'short' })

        if (date >= lastYear) {
            months[month].died++
        }
    }
    for (let i of babiesBorn) {
        let date = (new Date(i.resource.birthDate)).getTime()
        let month = new Date(i.resource.birthDate).toLocaleString('default', { month: 'short' })
        if (date >= lastYear) {
            months[month].born++
        }
    }

    for (let i of Object.keys(months)) {
        console.log(months)
        results.push({
            month: i,
            value: (Math.round((months[i].died / months[i].born) * 100) / 100 || 0) || 0
        })
    }

    return results

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
    return { rate: Math.round((totalDeceased / count) * 100) / 100, data: await mortalityRateByMonth() }
}



// patient level reports


let _r = [
    ""
]
export let patientLevelReport = async (report: string) => {



}

export let babiesReceivingFeeds = async () => {
    let observations = await generateReport("firstFeeding")
    let babies = [];
    for (let observation of observations) {
        console.log(observation)
        if (babies.indexOf(observation.resource.subject.reference) < 0) {
            if (observation.resource.valueString === "Within 1 Hour") {
                babies.push(observation.resource.subject.reference)
            }
        }
    }
    return babies.length
}

export let mothersInitiatingLactation = async () => {

    let observations = await generateReport("mothersInitiatingLactation")
    let mothers = [];
    for (let observation of observations) {
        console.log(observation)
        if (mothers.indexOf(observation.resource.subject.reference) < 0) {
            mothers.push(observation.resource.subject.reference)
        }
    }
    return mothers.length

}

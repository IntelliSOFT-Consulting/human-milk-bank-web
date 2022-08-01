import { FhirApi, generateReport } from "./fhir"
import db from './prisma'


const _allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
let currentMonth = (new Date()).toLocaleString('default', { month: 'short' })

let _months = _allMonths.slice(_allMonths.indexOf(currentMonth) + 1).concat()
_months = _months.concat(_allMonths.slice(0, (_allMonths.indexOf(currentMonth) + 1)))

const allMonths = _months;

export let getTotalDHMOrders = async (all: boolean = false) => {
    let lastStockEntryTime = await (await getLastStockEntry())?.createdAt || null
    let totalVolume = await db.order.aggregate({
        _sum: { pasteurized: true, unPasteurized: true },
        where: {
            ...(!all) && {
                ...(lastStockEntryTime) && {
                    createdAt: {
                        gte: lastStockEntryTime
                    }
                }
            }
        }
    })
    return { pasteurized: totalVolume._sum.pasteurized, unPasteurized: totalVolume._sum.unPasteurized }
}

export let availableDHMVolume = async () => {
    let parsteurized = (await getLastStockEntry())?.pasteurized || 0 - (await (await getTotalDHMOrders()).pasteurized || 0)
    let unParsteurized = (await getLastStockEntry())?.pasteurized || 0 - (await (await getTotalDHMOrders()).pasteurized || 0)
    if (parsteurized < 0) { parsteurized = 0 }
    if (unParsteurized < 0) { unParsteurized = 0 }
    return { unParsteurized, parsteurized }
}

let getLastStockEntry = async () => {
    let time = await db.stockEntry.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        take: 1
    })
    return time[0]
}



export let percentageFeeds = async (patient: string | null = null) => {

    let careplans = await generateReport("prescribedFeeds")
    let response: { [index: string]: number } = { dhm: 0, formula: 0, ebm: 0, iv: 0 }

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
    // console.log(response)
    let total = 0.0
    for (let i of Object.keys(response)) {
        total += response[i]
    }

    for (let i of Object.keys(response)) {
        response[i] = Math.round((response[i] / total) * 100 * 100) / 100 || 0;
    }
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
        console.log(months)
        months[month] = { [i.resource.subject.reference]: months[month][i.resource.subject.reference] || 0 }

        if (date >= lastYear) {
            months[month][i.resource.subject.reference]++
        }
    }
    let results: Array<any> = [];
    let underFive = 0;
    let underSeven = 0;
    let aboveSeven = 0;
    // do the counts
    for (let i of Object.keys(months)) {
        // console.log(i)
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
        let date = (new Date(i.resource.issued)).getTime()
        let month = new Date(i.resource.issued).toLocaleString('default', { month: 'short' })

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
        // console.log(months)
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



export let babiesReceivingFeeds = async () => {
    let observations = await generateReport("firstFeeding")
    let babies = [];
    for (let observation of observations) {
        if (babies.indexOf(observation.resource.subject.reference) < 0) {
            if (observation.resource.valueString === "Within 1 Hour") {
                babies.push(observation.resource.subject.reference)
            }
        }
    }
    let unique = [...new Set(babies)]
    return unique.length
}

export let mothersInitiatingLactation = async () => {
    let observations = await generateReport("mothersInitiatingLactation")
    return countPatients(observations)
}


export let infantsExposedToFormula = async () => {
    let observations = await generateReport("infantsOnFormula")
    return countPatients(observations)
}

export let infantsFullyFedOnMothersMilk = async () => {
    // all babies - without careplans
    let babies = [];
    let allBabies = await generateReport("allBabies")
    for (let i of allBabies) {
        babies.push(i.resource.id)
    }
    let withCarePlans = await (await FhirApi({ url: "/CarePlan" })).data
    withCarePlans = withCarePlans?.entry || []
    for (let c of withCarePlans) {
        babies = babies.filter((p: any) => p !== c.resource.subject.reference.split("/")[1])
    }
    let unique = [...new Set(babies)]
    return unique.length
}

export let infantsReceivingExclusiveHumanMilkDiets = async () => {
    // no ebm, no breast milk
    // all patient - (ebm, breast milk)
    let babies = [];
    let allBabies = await generateReport("allBabies")
    for (let i of allBabies) {
        babies.push(i.resource.id)
    }
    let infantsOnEBM = await generateReport("infantsOnEBM")
    for (let c of infantsOnEBM) {
        babies = babies.filter((p: any) => p !== c.resource.subject.reference.split("/")[1])
    }
    let unique = [...new Set(babies)]
    return unique.length
}

export let getPatientsOnBreastMilk = async () => {

}

export let avgDaysToReceivingMothersOwnMilk = async () => {
    return 2
}

export let countPatients = (observations: any[]) => {
    // console.log(observations)
    let babies = [];
    for (let observation of observations) {
        if (babies.indexOf(observation.resource.subject.reference) < 0) {
            babies.push(observation.resource.subject.reference)
        }
    }
    let unique = [...new Set(babies)]
    return unique.length
}

export let countPatientsFromNutritionOrders = (orders: any) => {
    // console.log(orders)
    let babies = [];
    for (let order of orders) {
        if (babies.indexOf(order.resource.patient.reference) < 0) {
            babies.push(order.resource.patient.reference)
        }
    }
    let unique = [...new Set(babies)]
    return unique.length
}


let getObservationsTotal = async (patientId: string, code: string) => {
    let total = 0.0
    let o = await FhirApi({ url: `/Observation?patient=${patientId}&code=${code}` })
    let observations = o.data.entry || [];
    for (let x of observations) {
        total += x.resource.valueQuantity.value
    }
    return total
}

export let generateFeedingReport = async (patients: any[]) => {
    let results: any[] = [];
    for (let p of patients) {
        let patient = await (await FhirApi({ url: `/Patient/${p}` })).data
        let mother = await (await FhirApi({ url: `/Patient?link=${p}` })).data
        mother = mother.entry[0]
        results.push({
            volumeOfMilkExpressed: await getObservationsTotal(p, "62578-0"),
            volumeReceived: await getObservationsTotal(p, "Total-Taken"),
            dob: patient.birthDate,
            ipNumber: mother.resource.id,
            id: p,
            patientNames: (patient.name[0].family + " " + patient.name[0].given[0]),
            milkExpression: await averageMilkExpressionFrequency(p)

        })
    }
    return results
}

export let generateInfantNutrition = async (patients: any[]) => {
    let results: any[] = [];
    for (let p of patients) {
        let patient = await (await FhirApi({ url: `/Patient/${p}` })).data
        results.push({
            volumeOfMilkExpressed: await getObservationsTotal(p, "62578-0"),
            volumeReceived: await getObservationsTotal(p, "Total-Taken"),
            dob: patient.birthDate,
            ipNumber: p,
            id: p,
            patientNames: (patient.name[0].family + " " + patient.name[0].given[0])
        })
    }
    return results
}

export let daysToReceivingMothersOwnMilk = async (patientId: string) => {
    let weight = await getCurrentWeight(patientId)

    let targetDate = await (await FhirApi({ url: `/Observation?code=${"Total-Taken"}&patient=${patientId}` })).data
    if (Object.keys(targetDate).indexOf('entry') < 0) {
        return "-"
    }
    let resource = targetDate.entry[0].resource
}

export let generalPatientLevelReport = async (patients: any[]) => {
    let report: any[] = [];
    for (let p of patients) {
        let patient = await (await FhirApi({ url: `/Patient/${p}` })).data
        let mother = await (await FhirApi({ url: `/Patient?link=${p}` })).data
        mother = mother.entry[0]
        let currentWeightAndRateChange = await weightAndRateChange(p)
        report.push({
            dob: patient.birthDate,
            gestation: await getPatientGestation(p),
            ipNumber: mother.resource.id,
            id: p,
            birthWeight: await getBirthWeight(p),
            babyNames: (patient.name[0].family + " " + patient.name[0].given[0]),
            weightRateChange: (currentWeightAndRateChange.rate).toFixed(2),
            currentWeight: currentWeightAndRateChange.weight,
        })
    }
    return report
}

export let mothersInitiatedLactationAt = async (patientId: string) => {
    let observations = await (await FhirApi({ url: `/Observation?code=62578-0&patient=${patientId}` })).data
    observations = observations?.entry || []
    if (observations.length < 1) {
        return "-"
    }
    return observations[0].resource.issued
}

export let lactationSupportPatientLevelReport = async (patients: any[]) => {
    let report: any[] = [];
    for (let p of patients) {
        let patient = await (await FhirApi({ url: `/Patient/${p}` })).data
        let child = await (await FhirApi({ url: `/Patient/${(patient.link[0].other.reference).split("/")[1]}` })).data
        report.push({
            dob: child.birthDate,
            ipNumber: patient.id,
            id: p,
            patientNames: (patient.name[0].family + " " + patient.name[0].given[0]),
            babyNames: (child.name[0].family + " " + child.name[0].given[0]),
            lactationInitiatedAt: await mothersInitiatedLactationAt(patient.id)
        })
    }
    return report
}

export let infantNutritionReport = async (patients: any[]) => {
    let report: any[] = [];
    for (let p of patients) {
        let patient = await (await FhirApi({ url: `/Patient/${p}` })).data
        report.push({
            dob: patient.birthDate,
            gestation: await getPatientGestation(p),
            ipNumber: p,
            id: p,
            birthWeight: await getBirthWeight(p),
            babyNames: (patient.name[0].family + " " + patient.name[0].given[0])
        })
    }
    return report
}

export let lactationSupportReport = async (patients: any[]) => {
    let report: any[] = [];
    for (let p of patients) {
        let patient = await (await FhirApi({ url: `/Patient/${p}` })).data
        report.push({
            dob: patient.birthDate,
            gestation: await getPatientGestation(p),
            ipNumber: p,
            id: p,
            birthWeight: await getBirthWeight(p),
            babyNames: (patient.name[0].family + " " + patient.name[0].given[0])
        })
    }
    return report
}


export let lowBirthWeight = async () => {
    // below 2500g
    let observations = await generateReport("lowBirthweight")
    return countPatients(observations)
}

export let getBirthWeight = async (patientId: string) => {
    let gestation = await (await FhirApi({ url: `/Observation?code=8339-4&patient=${patientId}` })).data
    return gestation?.entry ? ((gestation.entry[0].resource.valueQuantity.value < 2500) ? "Low" : (gestation.entry[0].resource.valueQuantity.value < 1500) ? "Very Low" : (gestation.entry[0].resource.valueQuantity.value < 1500) ? "Extermely Low" : "Normal") : "-"
}

export let getExpressionFrequency = async (patientId: string) => {
    let observations = await (await FhirApi({ url: `/Observation?code=62578-0&patient=${patientId}` })).data
    // console.log(observations)
    observations = observations?.entry || [];
    let expressions: { [index: string]: number } = {}
    for (let o of observations) {
        let date = new Date(o.resource.issued).toLocaleDateString()
        if (Object.keys(expressions).indexOf(date) < 0) {
            expressions[date] = 0
        } else {
            expressions[date]++
        }
    }
    return expressions

}


export let averageMilkExpressionFrequency = async (patientId: string) => {
    let all = await getExpressionFrequency(patientId)
    let total = 0;
    Object.keys(all).map((i) => {
        total += all[i]
    })
    return Math.round(total / Object.keys(all).length) || 0
}
// expressionFrequency("c3e65dee-b99a-43d6-8ad7-2892bb663e82")

export let weightAndRateChange = async (patientId: string) => {
    let weightValues = await (await FhirApi({ url: `/Observation?code=3141-9&patient=${patientId}&_count=2` })).data?.entry || null
    if (!weightValues) {
        return { weight: 0, rate: 0 }
    }
    let lastWeight = weightValues[1].resource.valueQuantity.value
    let currentWeight = weightValues[0].resource.valueQuantity.value
    let rate = (currentWeight - lastWeight) / lastWeight * 100
    return { weight: currentWeight, rate }
}

export let getCurrentWeight = async (patientId: string) => {
    let weightValues = await (await FhirApi({ url: `/Observation?code=3141-9&patient=${patientId}&_count=1` })).data?.entry || null
    if (!weightValues) {
        return 0
    }
    let currentWeight = weightValues[0].resource.valueQuantity.value
    return currentWeight
}

export let getPatientGestation = async (patientId: string) => {
    let gestation = await (await FhirApi({ url: `/Observation?code=11885-1&patient=${patientId}` })).data
    return gestation?.entry ? (gestation.entry[0].resource.valueQuantity.value >= 37) ? "Preterm" : "Term" : "-"
}

export let receivingExclusiveHumanMilk = async () => {

}
export let totalDailyFeeds = async (patientId: string) => {
    let oneDayAgo = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).toISOString();


}

export let getFeedDistribution = async (patientId: string) => {
    let oneDayAgo = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).toISOString();

    let observations = await (await FhirApi({ url: `/Encounter?reason-code=Feeding%20and%20Monitoring&_revinclude=Observation:encounter&_lastUpdated=gt${oneDayAgo}&patient=${patientId}` })).data
    // console.log(observations)
    let feedTypes: any = {
        iv: "IV-Volume",
        dhm: "DHM-Volume",
        ebm: "EBM-Volume",
        formula: "Formula-Volume"
    }
    let totalDailyFeeds = 0
    let today = new Date().toLocaleTimeString()
    let feeds: { [index: string]: number } = { iv: 0, ebm: 0, dhm: 0, formula: 0 }
    let feedingTimes: { [index: string]: any } = {}
    observations = observations?.entry || []
    for (let o of observations) {
        if (o.resource.resourceType === "Observation") {
            Object.keys(feedTypes).map((feed) => {
                if (o.resource.code.coding[0].code === feedTypes[feed]) {
                    feeds[feed]++
                    totalDailyFeeds += o.resource.valueQuantity.value
                    let dt = new Date(o.resource.issued).toLocaleTimeString()
                    feedingTimes[dt] = feeds
                    //reset counter
                    feeds = { iv: 0, ebm: 0, dhm: 0, formula: 0 }
                }
            })
        }
    }
    // get patient info
    let patient = await (await FhirApi({ url: `/Patient/${patientId}` })).data
    let mother = await (await FhirApi({ url: `/Patient?link=${patientId}` })).data
    mother = mother.entry[0]
    patient = {
        dob: patient.birthDate,
        ipNumber: mother.resource.id,
        id: patientId,
        babyNames: (patient.name[0].family + " " + patient.name[0].given[0])
    }
    let res = { feedingTimes, patient, expressions: (await getExpressionFrequency(patientId))[today] || 0, totalDailyFeeds }
    return res
}


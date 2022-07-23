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
        _sum: { dhmVolume: true },
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
    return totalVolume._sum.dhmVolume
}

export let availableDHMVolume = async () => {
    let volume = (await getLastStockEntry())?.dhmVolume || 0 - (await getTotalDHMOrders() || 0)
    if (volume < 0) {
        return 0
    }
    return volume
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

export let patientLevelReport = async (report: string) => {

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
    for (let c of withCarePlans.entry) {
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

export let patientsOnBreastMilk = async () => {

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

export let expressionFrequency = async (patientId: string) => {
    let gestation = await (await FhirApi({ url: `/Observation?code=8339-4&patient=${patientId}` })).data
    return gestation?.entry ? ((gestation.entry[0].resource.valueQuantity.value < 2500) ? "Low" : (gestation.entry[0].resource.valueQuantity.value < 1500) ? "Very Low" : (gestation.entry[0].resource.valueQuantity.value < 1500) ? "Extermely Low" : "Normal") : "-"
}

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

export let getPatientGestation = async (patientId: string) => {
    let gestation = await (await FhirApi({ url: `/Observation?code=11885-1&patient=${patientId}` })).data
    return gestation?.entry ? (gestation.entry[0].resource.valueQuantity.value >= 37) ? "Preterm" : "Term" : "-"
}

export let receivingExclusiveHumanMilk = async () => {

}

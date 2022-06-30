import { generateReport } from "./fhir"

let months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"]


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
        if (patientIds.indexOf(x) === -1 ) {
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
    let observations = await generateReport("expressingTime")
    let categories: { [index: string]: number } = { withinOne: 0, afterOne: 0, afterTwo: 0, afterThree: 0 }
    let _map: { [index: string]: string } = { withinOne: "Within 1 Hour", afterOne: "After 1 Hour", afterTwo: "After 2 Hours", afterThree: "After 3 Hours" }
    if (observations) {
        for (let o of observations) {
            console.log(o)
            for (let i in Object.keys(_map)) {
                if (o.valueString === _map[i]) {
                    categories[i] += 1
                }
            }
        }
    }

}

export let calculateMortalityRateByMonth = async () => {
    let thisYear = ''
    let lastYear = ''
    return
}


export let calculateMortalityRate = async () => {
    let patients = await generateReport("allPatients")
    let count = 0
    for(let p of patients){
        if(p.resource.id.length > 12){
            count++
        }
    }
    let totalDeceased = 0
    let deceased = await generateReport("deceasedInfants")
    for(let p of deceased){
        if(p.resource.id.length > 12){
            totalDeceased++
        }
    }
    
    let arr: Array<any> = []
    months.map((month) => {
        arr.push({
            "month": month,
            "value": 0
        })
    })

    return { rate: (totalDeceased / count), data: arr }
}


export let calculateExpressingTimes = async () => {


    return
}
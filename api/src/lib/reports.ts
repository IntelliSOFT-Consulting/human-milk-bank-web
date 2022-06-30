import { generateReport } from "./fhir"

let months = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"]

let getTotalBabies = async () => {
    let totalBabies = await generateReport("noOfBabies");
    return totalBabies
}

export let percentageFeeds = async () => {
    let ebm = await generateReport("noOfInfantsOnEBM")
    let dhm = await infantsOnDHM()
    let breastFeeding = await generateReport("noOfInfantsBreastFeeding")
    let formula = await generateReport("noOfInfantsOnFormula")
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
    return patientIds.length
}

infantsOnDHM()
export let firstFeeding = async () => {

    let observations = await generateReport("firstFeeding")
    console.log(observations)
    let categories: { [index: string]: number } = { withinOne: 0, afterOne: 0, afterTwo: 0, afterThree: 0 }
    let _map: { [index: string]: string } = { withinOne: "Within 1 Hour", afterOne: "After 1 Hour", afterTwo: "After 2 Hours", afterThree: "After 3 Hours" }
    if (observations) {
        for (let o of observations) {
            // console.log(o)
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

    return
}


export let calculateMortalityRate = async () => {
    let totalBabies = await getTotalBabies()
    let totalDeceased = await generateReport("noOfDeceasedInfants")
    let arr: Array<any> = []
    months.map((month) => {
        arr.push({
            "month": month,
            "value": 0
        })
    })
    // get monthly values

    return { rate: (totalDeceased / totalBabies), data: arr }
}


export let calculateExpressingTimes = async () => {


    return
}
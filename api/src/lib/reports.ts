import { generateReport } from "./fhir"

let months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"]

let getTotalBabies = async () => {
    let totalBabies = await generateReport("noOfBabies");
    return totalBabies
}

export let percentageFeeds = async () => {
    let totalBabies = await getTotalBabies();
    let ebm = await generateReport("noOfInfantsOnEBM") / totalBabies * 100
    let dhm = await generateReport("infantsPartiallyReceivingDHM") / totalBabies * 100
    let breastFeeding = await generateReport("noOfInfantsBreastFeeding") / totalBabies * 100
    let formula = await generateReport("noOfInfantsOnFormula") / totalBabies * 100
    return {
        ebm, dhm, breastFeeding, formula, oral: breastFeeding
    }
}


export let firstFeeding = async () => {

    let observations = await generateReport("firstFeeding")
    let categories: { [index: string]: number } = {withinOne:0, afterOne:0, afterTwo:0, afterThree:0}
    let _map: { [index: string]: string } = {withinOne:"Within 1 Hour", afterOne:"After 1 Hour", afterTwo:"After 2 Hours", afterThree:"After 3 Hours"}
    if(observations){
        for(let o of observations){
            for(let i in Object.keys(_map)){
                if (o.value === _map[i]){
                    categories[i] += 1
                } 
            }
        }
    }
    return categories
    }
    



// type of DHM
export let dhmDailySummary = async () => {

    // let currentMonth = months[new Date().getDays()]
    let dayOfWeek = new Date().toLocaleString('en-us', {  weekday: 'short' })

    let high, low;
    
    return
}

export let expressingTime = async () => {

}


export let averageDays = async () => {
    return
}

export let calculateMortalityRateByMonth = async () => {

    return 
}

export let dhmByMonth = async () => {
    return

}

export let calculateMortalityRate: Function = async() => {
    let totalBabies = await getTotalBabies()
    let totalDeceased = await generateReport("noOfDeceasedInfants")
    let arr = []
    let data = months.map((month) => {
        arr.push( {
            "month": month,
            "value": 0
        })
    })
    // get monthly values

    return { rate:(totalDeceased / totalBabies), data}
}



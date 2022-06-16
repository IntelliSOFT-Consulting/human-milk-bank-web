from datetime import datetime
import random
from faker import Faker

fake = Faker()


def encounter_gen(id, patient, practitioner=None):
    return {
        "resourceType": "Encounter",
        "id": id,
        "active": True,
        "gender": "female",
        "date": (fake.date_of_birth(minimum_age=19).isoformat()
                 if patient == "mother" else fake.date_of_birth(maximum_age=0).isoformat()),
        "address": [{
            "postalCode": "Pumwani"
        }]
    }


def patient_gen(id, patient="mother"):
    name = fake.name()
    print("Patient Name: ", name)
    return {
        "resourceType": "Patient",
        "id": id,
        "active": True,
        "name": [{
            "family": name.split(" ")[0],
            "given": [name.split(" ")[1]]
        }],
        "gender": "female",
        "birthDate": (fake.date_of_birth(minimum_age=19).isoformat()
                      if patient == "mother" else fake.date_of_birth(maximum_age=0).isoformat()),
        "address": [{
            "postalCode": "Pumwani"
        }]
    }


def observation_gen(patient, id, observation_code, display, range, units, system="loinc"):
    return {
        "resourceType": "Observation",
        "id": id,
        "code": {
            "coding": [{
                "system": ("http://loinc.org"
                           if system == "loinc" else "http://snomed.com/ct"),
                "code": observation_code,
                "display": display
            }]
        },
        "valueQuantity": {
            "value": random.randint(int(range.split(',')[0]), int(range.split(',')[1])),
            "system": "http://unitsofmeasure.org",
            "code": units
        },
        "subject": {
            "reference": "Patient/{}".format(patient)
        },
        "encounter": {
            "reference": "Encounter/3a0acf38-2308-4d5c-a894-6362326b7abc"
        },
        "date": datetime.now().isoformat()
    }


observation_map = [
    {
        "code": "8339-4",
        "range": "2000,3000",
        "display": "Birth weight Measured",
        "system":"loinc",
        "units": "grams"
    }, {
        "code": "11885-1",
        "range": "20,40",
        "display": "Gestation",
        "units": "weeks",
        "system":"loinc"
    },
    {
        "code": "419099009",
        "type": "snomed",
        "display": "Dead",
        "system":"snomed"
    }
]


patient_map = [

]


encounter_map = [

]

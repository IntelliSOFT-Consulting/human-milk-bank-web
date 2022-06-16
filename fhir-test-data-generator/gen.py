import requests
import uuid
import os
from fhir import encounter_gen, observation_map, observation_gen, patient_gen

URL = os.environ.get("FHIR_BASE_URL") or "https://devnndak.intellisoftkenya.com/fhir"
  
def _gen(patient):
    for (i) in observation_map:
        print(i)

        #patient
        patient_id=str(uuid.uuid4())
        print(observation_gen(patient_id, patient_id, i['code'], i['display'], i['range'], i['units'] ))
        # p = requests.put(URL + "/Patient/{}".format(patient_id),
        #                 json=patient_gen(patient_id, patient=patient))
        # print("..patient: ", patient_id, p.status_code, p.text)

        # #encounters
        # encounter_id = str(uuid.uuid4())
        # e = requests.put(URL + "/Encounter/{}".format(encounter_id),
        #                 json=encounter_gen(encounter_id, patient_id))
        # print("..encounter: " ,encounter_id, e.status_code, e.text)

        # #observations
        # observation_id = str(uuid.uuid4())
        # o = requests.put(URL + "/Observation/{}".format(observation_id),
        #                 json=observation_gen(patient_id, observation_id, i['code'], i['display'], i['range'], i['units'] ))
        # print("..observation: ", i['display'] ,observation_id, o.status_code, o.text)
    
for i in range(1, 20):
    _gen(patient="child")







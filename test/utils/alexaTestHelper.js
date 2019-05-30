import _ from 'lodash';

async function setSlotValue(alexa, slot, value, resId, resValue) {
  // slot == name of slot
  // value == what the user said
  // resId == what Slot Value ID is resolves to in the Interaction Model
  // resValue == what Slot Value it resolves to in the Interaction Model
  return alexa.filter((payload) => {
    _.get(payload.request.intent.slots, slot).value = value;

    if (resId) {
      _.get(payload.request.intent.slots, slot).resolutions = {
        resolutionsPerAuthority: [
          {
            authority: 'amazon',
            status: {
              code: 'ER_SUCCESS_MATCH',
            },
            values: [
              {
                value: {
                  id: resId,
                  name: resValue,
                },
              },
            ],
          },
        ],
      };
    }
  });
}

function newSession(va) {
  return va.VirtualAlexa.Builder()
    .handler('./src/alexa.handler')
    .interactionModelFile('./interaction-model.json')
    .create();
}

export {
  setSlotValue,
  newSession,
};

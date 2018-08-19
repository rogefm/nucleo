import NucleoObjectType from './types/NucleoObjectType';

export default function lawyer(contract: any, data: any) {
  const contractKeys = Object.keys(contract);
  const { fields: contractFields } = contract;
  const dataKeys = Object.keys(data);
  const contractName = contract.name;
  let __errors__: Array<any> =  [];

  // loop checking object values comparison
  for (let i = 0; dataKeys.length > i; i++) {
    const currentDataKey = data[dataKeys[i]];
    // recursion to call itself when is NucleoObjectType instance
    if (currentDataKey instanceof NucleoObjectType) {
      lawyer(contract[dataKeys[i]], currentDataKey);
    }

    // console.log('currentDataKey', currentDataKey);
    if (!contractFields[dataKeys[i]]) {
      __errors__.push({
        contract: contractName,
        error: `${dataKeys[i]} is not in ${contractName} contract and can not be saved in store.`
      });
    }

    if (contractFields[dataKeys[i]] && !contractFields[dataKeys[i]].serialize(currentDataKey)) {
      __errors__.push({
        contract: contractName,
        error: `${dataKeys[i]} field was expected as ${contractFields[dataKeys[i]].Type} but got ${typeof currentDataKey}`
      });
    }
  }

  if (__errors__.length) {
    throw Error(JSON.stringify({ errors: __errors__ }));
  }
}

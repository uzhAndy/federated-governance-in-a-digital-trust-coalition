import { Attribute } from 'src/app/models/credential';
import { Schema } from 'src/app/models/schema';

export function getSchemaMetas(schmemaIds: string[]): Schema[] {
  let retArray: Schema[] = [];
  schmemaIds.forEach((el: string) => {
    const split = el.split(':');
    const schemaMeta: Schema = {
      schemaIssuerDid: split[0],
      schemaName: split[2],
      version: split[3],
      schemaId: el,
    };
    retArray.push(schemaMeta);
  });
  return retArray;
}

export function createAttributesFromSchema(attNames: string[]): Attribute[] {
  let retArray: Attribute[] = [];
  attNames.forEach((attName: string) => {
    let currAtt: Attribute = {
        name: attName,
        value: "",
        selected:false
    } 
    retArray.push(currAtt);
  });

  return retArray;
}

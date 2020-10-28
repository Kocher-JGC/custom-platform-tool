import {
  FoundationType, ComplexType, TypeOfIUBDSL, Schemas
} from '@iub-dsl/definition';
import { FlowCollection } from '@iub-dsl/definition/flow';
import { ActionCollection } from '@iub-dsl/definition/actions/action';
import { actionsCollection, demoActionFlow } from './action-collection';
import { schemas } from './scheams';
import { componentsCollection } from './components';

export const tableExtralFlow: FlowCollection = {
  updFlow_1: {
    id: 'updFlow_1',
    actionId: 'updA_1',
    flowOut: [],
    flowOutCondition: []
  }

};

export const tableExtralAction: ActionCollection = {
  updA_1: {
    actionId: 'updA_1',
    actionName: 'updA_1_name',
    actionType: 'openModalFromTableClick',
    actionOptions: {
      pageUrl: ''
    },
    actionOutput: 'undefined',
  }
};

export const userTable = {
  sysRtCxtInterface: {} as any,
  schemas,
  metadataCollection: {} as any,
  relationshipsCollection: {},
  componentsCollection,
  actionsCollection: Object.assign({}, actionsCollection),
  flowCollection: Object.assign({}, demoActionFlow),
  layoutContent: {} as any,
  pageID: "userTable",
  name: "用户表格",
  type: "config"
};

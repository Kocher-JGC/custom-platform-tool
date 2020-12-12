import { DispatchModuleName } from "..";

export interface DispatchModuleRelationship {
  module: DispatchModuleName.relationship;
  method: DispatchMethodNameOfRelationship
}

export type TDispatchMethodNameOfRelationship = keyof typeof DispatchMethodNameOfRelationship

export const enum DispatchMethodNameOfRelationship {
  effectAnalysis = 'effectAnalysis',
  effectDispatch = 'effectDispatch',
  effectReceiver = 'effectReceiver',
  findEquMetadata = 'findEquMetadata'
}
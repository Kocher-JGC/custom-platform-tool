import { DispatchModuleName } from ".";

export interface DispatchModuleRelationship {
  module: DispatchModuleName.relationship;
  method: DispatchMethodNameOfRelationship
}

export type TDispatchMethodNameOfRelationship =
  'effectAnalysis'|
  'effectDispatch'|
  'effectReceiver'|
  'findEquMetadata';

export enum DispatchMethodNameOfRelationship {
  effectAnalysis = 'effectAnalysis',
  effectDispatch = 'effectDispatch',
  effectReceiver = 'effectReceiver',
  findEquMetadata = 'findEquMetadata'
}

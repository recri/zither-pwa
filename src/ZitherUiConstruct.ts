import type { FaustUIDescriptor, FaustUIGroup } from './faust/faustwasm';

export const runUi = {
  type: 'vgroup',
  label: 'run',
  items: [
    {
      type: 'button',
      label: 'activate',
      address: '/zlactivate',
      index: 1234,
      url: '',
    },
  ],
} as FaustUIGroup;

export const mechUi = {
  type: 'vgroup',
  label: 'mech',
  items: [],
} as FaustUIGroup;

export const decorUi = {
  type: 'vgroup',
  label: 'decor',
  items: [],
} as FaustUIGroup;

export const perfUi = {
  type: 'vgroup',
  label: 'perf',
  items: [],
} as FaustUIGroup;

export const defInstUi = {
  type: 'vgroup',
  label: 'instr',
  items: [],
} as FaustUIGroup;

export const defEffUi = {
  type: 'vgroup',
  label: 'effect',
  items: [],
} as FaustUIGroup;

export const constructUi = (
  instUi: FaustUIGroup,
  effUi: FaustUIGroup
): FaustUIDescriptor => [
  {
    type: 'tgroup',
    label: 'root',
    items: [runUi, mechUi, decorUi, instUi, effUi, perfUi],
  },
];

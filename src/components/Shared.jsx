
import React from 'react';
import { PetType } from '../constants';

export const StatusBadge = ({ type }) => {
  const colors = {
    'Vaccination': 'bg-blue-50 text-blue-600 border-blue-100',
    'Grooming': 'bg-purple-50 text-purple-600 border-purple-100',
    'Medication': 'bg-red-50 text-red-600 border-red-100',
    'Vet': 'bg-emerald-50 text-emerald-600 border-emerald-100',
    'Other': 'bg-slate-50 text-slate-600 border-slate-100',
  };
  const baseClass = "text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border";
  return <span className={`${baseClass} ${colors[type] || colors['Other']}`}>{type}</span>;
};

export const getPetEmoji = (type) => {
  switch (type) {
    case PetType.DOG: return '🐕';
    case PetType.CAT: return '🐈';
    case PetType.BIRD: return '🐦';
    default: return '🐾';
  }
};

export const CategoryBadge = ({ category }) => {
  const colors = {
    'Advice': 'bg-amber-50 text-amber-700 border-amber-100',
    'Lost & Found': 'bg-rose-50 text-rose-700 border-rose-100',
    'Adoption': 'bg-violet-50 text-violet-700 border-violet-100',
    'Story': 'bg-cyan-50 text-cyan-700 border-cyan-100',
  };
  return <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${colors[category]}`}>{category}</span>;
};

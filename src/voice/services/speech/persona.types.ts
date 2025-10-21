export enum PersonaLanguage {
  Francais = 'fr-FR',
  Anglais = 'en-US'
}

export enum PersonaLevel {
  Elementaire = 'Élémentaire (CM1-CM6)',
  College = 'Collège (6ème-3ème)',
  Lycee = 'Lycée (Seconde-Terminale)',
  Licence = 'Licence',
  Bachelor = 'Diplôme de Bachelor',
  Master = 'Master',
  Doctorant = 'Doctorant (Candidat au Ph.D)',
  Postdoc = 'Postdoc',
  PhD = 'Ph.D'
}

export enum PersonaLearningStyle {
  Visuel = 'Visuel',
  Verbal = 'Verbal',
  Actif = 'Actif',
  Intuitif = 'Intuitif',
  Reflechi = 'Réfléchi',
  Global = 'Global'
}

export enum PersonaCommunicationStyle {
  Formel = 'Formel',
  ManuelScolaire = 'Style manuel scolaire',
  LangageSimple = 'Langage simple',
  RaconterHistoire = 'Raconter une histoire',
  Socratique = 'Socratique'
}

export enum PersonaTone {
  Encourageant = 'Encourageant',
  Neutre = 'Neutre',
  Informatif = 'Informatif',
  Amical = 'Amical',
  Humoristique = 'Humoristique'
}

export enum PersonaReasoningFramework {
  Deductif = 'Déductif',
  Inductif = 'Inductif',
  Abductif = 'Abductif',
  Analogique = 'Analogique',
  Causal = 'Causal'
}

export interface PersonaConfig {
  language: PersonaLanguage;
  level: PersonaLevel;
  learningStyle: PersonaLearningStyle;
  communicationStyle: PersonaCommunicationStyle;
  tone: PersonaTone;
  reasoningFramework: PersonaReasoningFramework;
  emojis: boolean;
}

export const defaultPersonaConfig: PersonaConfig = {
  language: PersonaLanguage.Francais,
  level: PersonaLevel.Lycee,
  learningStyle: PersonaLearningStyle.Verbal,
  communicationStyle: PersonaCommunicationStyle.LangageSimple,
  tone: PersonaTone.Amical,
  reasoningFramework: PersonaReasoningFramework.Deductif,
  emojis: true
};

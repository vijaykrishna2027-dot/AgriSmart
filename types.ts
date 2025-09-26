export interface WeatherDay {
  day: string;
  highTemp: number;
  lowTemp: number;
  conditions: string;
  advice: string;
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface IdentificationResult {
    type: 'plant' | 'soil';
    plant?: {
        commonName: string;
        scientificName: string;
        description: string;
        growingConditions: string;
        commonPestsAndDiseases: string;
    };
    soil?: {
        soilType: string;
        composition: string;
        suitableCrops: string;
        managementTips: string;
        phLevel: string;
        nutrientLevels: string;
    };
}


export interface Job {
    id: number;
    title: string;
    location: string;
    description: string;
    contact: string;
    originalLanguage: string;
}
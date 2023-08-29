import { Listing } from '@/types/universalis';

export interface Repairer {
	Abbreviation_en: string;
	Icon: string;
	Name_en: string;
}

export interface Gear {
	ClassJobRepair: Repairer;
	Desynth: number;
  ID: number;
	Icon: string;
	IconHD: string;
	ItemKind: {
		Name_en: string;
	}
	LevelItem: number;
	listings: Listing[];
	Name: string;
}
import { Exercise } from "./exercise.model";
import { IInstruction } from "./instructions.interface";

export class Program {
    id?: string;
    createdAt: number;
    instruction: IInstruction;
    title: string;
    notes: string;
    parentFolderId?: string | null;
  }

export const INITIAL_DATA_PHASE: Exercise[] = [
  {
    Number: "1A",
    Description: "Bear Crawl Push Ups",
    Link: "oh15GpmbPsc",
    Sets: "3",
    Reps: "10",
    Tempo: "3-3-0",
    Rest: ":30",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "1B",
    Description: "Posterior Fly Renegade Row",
    Link: "SIyCmNmQQQ8",
    Sets: "3",
    Reps: "5 Each",
    Tempo: "3-3-0",
    Rest: ":0",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "1C",
    Description: "Underhand Band Pull Aparts",
    Link: "CPSry57YJKk",
    Sets: "3",
    Reps: "10",
    Tempo: "3-3-0",
    Rest: ":0",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "2A",
    Description: "Bear Crawl Rows",
    Link: "lxni89la-VA",
    Sets: "3",
    Reps: "5",
    Tempo: "3-3-0",
    Rest: "2:00",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "2B",
    Description: "Medball Squeeze Push Ups",
    Link: "iBNI2UBEJek",
    Sets: "3",
    Reps: "7",
    Tempo: "3-3-0",
    Rest: ":00",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "2C",
    Description: "90 Degree Partial Range Bench",
    Link: "8KP5XPr6qLM",
    Sets: "4",
    Reps: "4,3,2,1",
    Tempo: "(3-3-0), (4-4-0), (5-5-0), (10-10,0)",
    Rest: ":00",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "3A",
    Description: "Offset Incline Press",
    Link: "rXG1QORHISc",
    Sets: "3",
    Reps: "5 Each",
    Tempo: "3-3-0",
    Rest: ":00",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "3B",
    Description: "Cable Machine Pull Overs",
    Link: "jD0W3z83QZI",
    Sets: "3",
    Reps: "5",
    Tempo: "3-3-0",
    Rest: ":00",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "3C",
    Description: "Ninja Pull Up Holds",
    Link: "s5rfcwLTMSQ",
    Sets: "3",
    Reps: "20 Seconds Each",
    Tempo: "-",
    Rest: ":00",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "4A",
    Description: "Steering Wheels",
    Link: "887kfH3BQkI",
    Sets: "3",
    Reps: "7 Each Way",
    Tempo: "-",
    Rest: "1:00",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "4B",
    Description: "Tic Tocs",
    Link: "wRPakIrhHkQ",
    Sets: "3",
    Reps: "7 Each",
    Tempo: "-",
    Rest: ":00",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "4C",
    Description: "Uneven 90 Degree Bottoms Up Carry",
    Link: "j_E5xxo-1kc",
    Sets: "3",
    Reps: "30 Seconds Each",
    Tempo: "-",
    Rest: ":00",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
];

export const INITIAL_DATA_RECOVERY: Exercise[] = [
  {
    Number: "1A",
    Description: "Band Pull Aparts",
    Link: "781ImK2YCIM",
    Sets: "3",
    Reps: "15",
    Tempo: "-",
    Rest: ":30",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "1B",
    Description: "Goblet Squat with Prying",
    Link: "XhUAlz3w80U",
    Sets: "3",
    Reps: "1",
    Tempo: "0-3-0",
    Rest: ":0",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "1C",
    Description: "Face Pulls",
    Link: "pRLmJta5dZc",
    Sets: "3",
    Reps: "10",
    Tempo: "-",
    Rest: ":0",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "1D",
    Description: "DB Curls",
    Link: "nZzBsbpiO8I",
    Sets: "3",
    Reps: "20",
    Tempo: "-",
    Rest: ":00",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
];

export const INITIAL_DATA_EMPTY: Exercise[] = [
  {
    Number: "1",
    Description: "",
    Link: "",
    Sets: "",
    Reps: "",
    Tempo: "",
    Rest: "",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "2",
    Description: "",
    Link: "",
    Sets: "",
    Reps: "",
    Tempo: "",
    Rest: "",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "3",
    Description: "",
    Link: "",
    Sets: "",
    Reps: "",
    Tempo: "",
    Rest: "",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "4",
    Description: "",
    Link: "",
    Sets: "",
    Reps: "",
    Tempo: "",
    Rest: "",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
  {
    Number: "5",
    Description: "",
    Link: "",
    Sets: "",
    Reps: "",
    Tempo: "",
    Rest: "",
    tracking: { "week 1": "", "week 2": "", "week 3": "" },
  },
];

export const INITIAL_JSON_PHASE = JSON.stringify(INITIAL_DATA_PHASE);
export const INITIAL_JSON_RECOVERY = JSON.stringify(INITIAL_DATA_RECOVERY);
export const INITIAL_JSON_EMPTY = JSON.stringify(INITIAL_DATA_EMPTY);

export const PHASE_KEY = "Phase";
export const RECOVERY_KEY = "Recovery Days";

export const DEFAULT_PROGRAM = (title: string | null = null, parentFolderId: string | null = null): Program => {
  return {
    instruction: {
      [PHASE_KEY] : {
        "day 1": {
          title: "Max Effort Upper",
          exercises: INITIAL_JSON_EMPTY,
          image: "max-upper",
        },
        "day 2": {
          title: "Max Effort Lower",
          exercises: INITIAL_JSON_EMPTY,
          image: "max-lower",
        },
        "day 3": {
          title: "Dynamic Effort Upper",
          exercises: INITIAL_JSON_EMPTY,
          image: "dynamic-upper",
        },
        "day 4": {
          title: "Dynamic Effort Lower Body",
          exercises: INITIAL_JSON_EMPTY,
          image: "dynamic-lower",
        },
      },
      [RECOVERY_KEY]: {
        "day 1": {
          title: "Recovery Day 1",
          exercises: INITIAL_JSON_EMPTY,
          image: "recovery-1",
        },
        "day 2": {
          title: "Recovery Day 2",
          exercises: INITIAL_JSON_EMPTY,
          image: "recovery-2",
        },
        "day 3": {
          title: "Recovery Day 3",
          exercises: INITIAL_JSON_EMPTY,
          image: "recovery-3",
        },
      },
    },
    createdAt: new Date().getTime(),
    title: title || "Default",
    parentFolderId: parentFolderId,
    notes: ""
  };
};
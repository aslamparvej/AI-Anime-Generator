import { Schema, model, models, Document, Types } from "mongoose";

// Define the Scene interface
export interface IScene {
  _id?: Types.ObjectId;
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  cameraAngle?: string;
  mood: string;
  order: number;
}

// Define the Character schema
export interface ICharacter {
  _id?: Types.ObjectId;
  name: string;
  role: string;
  personality: string;
  appearance: string;
  abilities?: string;
}

// Define the Storyboard schema
export interface IStoryboard extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId; // Reference to User
  title: string;
  prompt: string;
  genre: string;
  artStyle: string;
  numScenes: number;
  scenes: IScene[]; // Array of scenes in the storyboard
  characters: ICharacter[]; // Array of characters in the storyboard
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Scene Schema
const SceneSchema = new Schema<IScene>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String },
    thumbnailUrl: { type: String },
    cameraAngle: { type: String, required: true },
    mood: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { _id: true }
);

// Character Schema
const CharacterSchema = new Schema<ICharacter>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    personality: { type: String, required: true },
    appearance: { type: String, required: true },
    abilities: { type: String },
  },
  { _id: true }
);

// Storyboard Schema
const StoryboardSchema = new Schema<IStoryboard>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    genre: { type: String, required: true },
    artStyle: { type: String, required: true },
    numScenes: { type: Number, required: true, min: 1 },

    scenes: {
      type: [SceneSchema],
      default: [],
    },

    characters: {
      type: [CharacterSchema],
      default: [],
    },

    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

const Storyboard = (models.Storyboard as any) || model<IStoryboard>("Storyboard", StoryboardSchema);

export default Storyboard;
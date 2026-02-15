export interface GenerateImageRequest {
  prompt: string;
  aspectRatio: string;
}

export interface GenerateImageResponse {
  imageUrl: string;
}

export interface ErrorResponse {
  error: string;
}

export type AspectRatio = "1:1" | "4:3" | "16:9" | "9:16";

export interface StyleSuggestion {
  emoji: string;
  label: string;
  value: string;
}

export interface QuickIdea {
  emoji: string;
  label: string;
  prompt: string;
}

import type { ContentEntryMap } from "astro:content";

export type Feature = {
  button: button;
  image: string;
  bulletpoints: string[];
  content: string;
  title: string;
};

export type About = {
  tagline: string;
  button: button;
  image: string;
  bulletpoints: string[];
  content1: string;
  content2: string;
  title: string;
};

export type Button = {
  enable: boolean;
  label: string;
  link: string;
};

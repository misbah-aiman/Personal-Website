export type SiteInfo = {
  name: string;
  role: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  location: string;
};

export type AboutStat = { value: string; label: string };

export type About = {
  intro: string;
  body: string[];
  stats: AboutStat[];
};

export type Skill = { name: string; iconName: string };

export type SkillGroup = {
  id: string;
  title: string;
  skills: Skill[];
};

export type Education = {
  id: string;
  school: string;
  degree: string;
  period: string;
  location: string;
  description: string;
  grade: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
};

export type Content = {
  site: SiteInfo;
  typingPhrases: string[];
  about: About;
  skillGroups: SkillGroup[];
  education: Education[];
  projects: Project[];
};

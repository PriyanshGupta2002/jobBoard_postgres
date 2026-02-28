import { Briefcase, Home, PencilRuler } from "lucide-react";

export enum role {
  PERSON = "person",
  ORG = "org",
}

export const sidebarItems = [
  {
    name: "Home",
    icon: Home,
    allowedRoles: [role.PERSON, role.ORG],
    url: "/",
  },
  {
    name: "Jobs",
    icon: Briefcase,
    allowedRoles: [role.ORG, role.PERSON],
    url: "/jobs",
  },
  {
    name: "Create Job",
    icon: PencilRuler,
    allowedRoles: [role.ORG],
    url: "/create-job",
  },
  {
    name: "Applied Jobs",
    icon: Briefcase,
    allowedRoles: [role.PERSON],
    url: "/applied-jobs",
  },
];

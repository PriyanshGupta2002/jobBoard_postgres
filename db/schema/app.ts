import {
  boolean,
  date,
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { relations } from "drizzle-orm";

export const timestamps = {
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const profile = pgTable(
  "profile",
  {
    id: serial("id").primaryKey(),
    authUserId: text("authuserId")
      .notNull()
      .unique() // only if 1-1 needed
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    headline: text("headline"),
    bio: varchar("bio", { length: 256 }),
    role: varchar({ enum: ["org", "person"] }),
    profilePhoto: varchar("profilePhoto"),
    ...timestamps,
  },
  (table) => ({
    authUserIdx: index("profile_authUserId_idx").on(table.authUserId),
  }),
);

export const profileRelations = relations(profile, ({ one, many }) => ({
  user: one(user, {
    fields: [profile.authUserId],
    references: [user.id],
  }),
  socialPosts: many(socialPost),
  jobs: many(jobs),
  experiences: many(experiences),
  education: many(education),
}));

export const organization = pgTable(
  "organizations",
  {
    id: serial("id").primaryKey(),
    profileId: integer("profileId")
      .notNull()
      .unique() // only if 1-1 needed
      .references(() => profile.id, { onDelete: "cascade" }),
    companyDescription: varchar("companyDescription", { length: 256 }),
    establishedIn: date("establishedIn"),
    countOfEmployee: text("countOfEmployee").notNull(),
    companyDomain: text("companyDomain").notNull(),
    ...timestamps,
  },
  (table) => ({
    profileIdx: index("organizations_profileId_idx").on(table.profileId),
  }),
);

export const organizationRelations = relations(
  organization,
  ({ one, many }) => ({
    profile: one(profile, {
      fields: [organization.profileId],
      references: [profile.id],
    }),
    jobs: many(jobs),
  }),
);

export const jobs = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),
    organizationId: integer("organizationId")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    jobTitle: text("jobTitle"),
    externalJobUrl: text("externalJobUrl"),
    jobDescription: varchar("jobDescription").notNull(),
    minSalary: integer("minSalary").notNull(),
    maxSalary: integer("maxSalary").notNull(),
    currency: varchar("currency"),
    discloseSalary: boolean("discloseSalary").default(true),
  },
  (table) => [index("orgId_idx").on(table.organizationId)],
);

export const jobRelations = relations(jobs, ({ one, many }) => ({
  organization: one(organization, {
    references: [organization.id],
    fields: [jobs.organizationId],
  }),
  applicants: many(applicants),
}));

export const socialPost = pgTable(
  "socialPost",
  {
    id: serial("id").primaryKey(),
    postDescription: varchar("postDescription"),
    profileId: integer("profileId")
      .notNull()
      .references(() => profile.id, { onDelete: "cascade" }),
    ...timestamps,
  },
  (table) => [index("userId_idx").on(table.profileId)],
);

export const socialPostRelations = relations(socialPost, ({ one, many }) => ({
  profile: one(profile, {
    references: [profile.id],
    fields: [socialPost.profileId],
  }),
  media: many(media),
}));

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  medialUrl: text("medialUrl"),
  socialPostId: integer("socialPostId")
    .notNull()
    .references(() => socialPost.id, { onDelete: "cascade" }),
  mediaType: text("mediaType", { enum: ["video", "image"] }),
});

export const mediaRelations = relations(media, ({ one }) => ({
  socialPost: one(socialPost, {
    references: [socialPost.id],
    fields: [media.id],
  }),
}));

export const applicants = pgTable(
  "applicants",
  {
    id: serial("id").primaryKey(),
    jobId: integer("jobId")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),

    profileId: integer("profileId")
      .notNull()
      .references(() => profile.id, { onDelete: "cascade" }),

    ...timestamps,
  },
  (table) => [
    uniqueIndex("job_profile_unique_idx").on(table.jobId, table.profileId),
  ],
);

export const applicantsRelations = relations(applicants, ({ one }) => ({
  jobs: one(jobs, {
    fields: [applicants.jobId],
    references: [jobs.id],
  }),
  profile: one(profile, {
    references: [profile.id],
    fields: [applicants.profileId],
  }),
}));

export const experiences = pgTable(
  "experiences",
  {
    id: serial("id").primaryKey(),
    profileId: integer("profileId")
      .notNull()
      .references(() => profile.id, { onDelete: "cascade" }),
    companyName: varchar("company_name", { length: 255 }),
    designation: varchar("designation", { length: 255 }),
    roleAndResponsibilities: varchar("role_and_responsibilities", {
      length: 1000,
    }),
    skillsLearned: varchar("skills_learned", { length: 500 }),
    currentlyWorking: boolean("currently_working").default(false),
    startDate: date("start_date"),
    endDate: date("end_date"),
    ...timestamps,
  },
  (table) => [index("experience_user_idx").on(table.profileId)],
);

export const experienceRelations = relations(experiences, ({ one }) => ({
  profile: one(profile, {
    references: [profile.id],
    fields: [experiences.profileId],
  }),
}));

export const education = pgTable(
  "education",
  {
    id: serial("id").primaryKey(),
    profileId: integer("profileId")
      .notNull()
      .references(() => profile.id, { onDelete: "cascade" }),
    instituteName: text("instituteName"),
    degree: text("degree"),
    course: text("course"),
    startDate: date("start_date"),
    endDate: date("end_date"),
    ...timestamps,
  },
  (table) => [index("education_user_idx").on(table.profileId)],
);

export const educationRelations = relations(education, ({ one }) => ({
  profile: one(profile, {
    references: [profile.id],
    fields: [education.profileId],
  }),
}));

export type Profile = typeof profile.$inferSelect;
export type NewProfile = typeof profile.$inferInsert;
export type Organization = typeof organization.$inferSelect;
export type NewOrganization = typeof organization.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type Applicants = typeof applicants.$inferSelect;
export type NewApplicants = typeof applicants.$inferInsert;
export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;
export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;

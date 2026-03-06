import {
  boolean,
  check,
  customType,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { relations, sql } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["org", "person"]);

const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});
export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
};

export const profile = pgTable(
  "profile",
  {
    id: serial("id").primaryKey(),

    authUserId: text("auth_user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),

    name: text("name").notNull(),
    headline: text("headline"),
    bio: varchar("bio", { length: 256 }),
    role: roleEnum("role").notNull(),
    profilePhoto: varchar("profile_photo"),

    ...timestamps,
  },
  (table) => [index("profile_auth_user_id_idx").on(table.authUserId)],
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
  likes: many(likes),
  comments: many(comments),
}));

export const organization = pgTable(
  "organizations",
  {
    id: serial("id").primaryKey(),

    profileId: integer("profile_id")
      .notNull()
      .unique()
      .references(() => profile.id, { onDelete: "cascade" }),

    companyDescription: varchar("company_description", { length: 256 }),
    establishedIn: date("established_in"),
    countOfEmployees: text("count_of_employees").notNull(),
    companyDomain: text("company_domain").notNull(),

    ...timestamps,
  },
  (table) => [index("organizations_profile_id_idx").on(table.profileId)],
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

    organizationId: integer("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),

    jobTitle: text("job_title").notNull(),
    externalJobUrl: text("external_job_url"),
    jobDescription: text("job_description").notNull(),

    minSalary: integer("min_salary").notNull(),
    maxSalary: integer("max_salary").notNull(),
    currency: varchar("currency"),
    discloseSalary: boolean("disclose_salary").default(true),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      () =>
        sql`to_tsvector('english', coalesce(job_title,'') || ' ' || coalesce(job_description,''))`,
    ),
    ...timestamps,
  },
  (table) => [
    index("jobs_search_idx").using("gin", table.searchVector),
    index("jobs_organization_id_idx").on(table.organizationId),
    check("min_salary_positive", sql`${table.minSalary} >= 0`),
    check("max_salary_positive", sql`${table.maxSalary} >= 0`),
    check("salary_range_valid", sql`${table.minSalary} <= ${table.maxSalary}`),
  ],
);

export const jobRelations = relations(jobs, ({ one, many }) => ({
  organization: one(organization, {
    fields: [jobs.organizationId],
    references: [organization.id],
  }),
  applicants: many(applicants),
}));

export const socialPost = pgTable(
  "social_posts",
  {
    id: serial("id").primaryKey(),

    postDescription: text("post_description").notNull(),

    profileId: integer("profile_id")
      .notNull()
      .references(() => profile.id, { onDelete: "cascade" }),
    searchVector: tsvector("search_vector").generatedAlwaysAs(
      () => sql`to_tsvector('english', coalesce(post_description, ''))`,
    ),

    ...timestamps,
  },
  (table) => [
    index("social_posts_profile_id_idx").on(table.profileId),
    index("posts_search_idx").using("gin", table.searchVector),
  ],
);

export const socialPostRelations = relations(socialPost, ({ one, many }) => ({
  profile: one(profile, {
    fields: [socialPost.profileId],
    references: [profile.id],
  }),
  media: many(media),
  likes: many(likes),
  comments: many(comments),
}));

export const media = pgTable("media", {
  id: serial("id").primaryKey(),

  mediaUrl: text("media_url").notNull(),

  socialPostId: integer("social_post_id")
    .notNull()
    .references(() => socialPost.id, { onDelete: "cascade" }),

  mediaType: text("media_type", { enum: ["video", "image"] }),
});

export const mediaRelations = relations(media, ({ one }) => ({
  socialPost: one(socialPost, {
    fields: [media.socialPostId],
    references: [socialPost.id],
  }),
}));

export const applicants = pgTable(
  "applicants",
  {
    id: serial("id").primaryKey(),

    jobId: integer("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),

    profileId: integer("profile_id")
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
    fields: [applicants.profileId],
    references: [profile.id],
  }),
}));

export const experiences = pgTable(
  "experiences",
  {
    id: serial("id").primaryKey(),

    profileId: integer("profile_id")
      .notNull()
      .references(() => profile.id, { onDelete: "cascade" }),

    companyName: varchar("company_name", { length: 255 }).notNull(),
    designation: varchar("designation", { length: 255 }).notNull(),
    roleAndResponsibilities: varchar("role_and_responsibilities", {
      length: 1000,
    }),
    skillsLearned: varchar("skills_learned", { length: 500 }),

    currentlyWorking: boolean("currently_working").default(false),
    startDate: date("start_date"),
    endDate: date("end_date"),

    ...timestamps,
  },
  (table) => [index("experiences_profile_id_idx").on(table.profileId)],
);

export const experienceRelations = relations(experiences, ({ one }) => ({
  profile: one(profile, {
    fields: [experiences.profileId],
    references: [profile.id],
  }),
}));

export const education = pgTable(
  "education",
  {
    id: serial("id").primaryKey(),

    profileId: integer("profile_id")
      .notNull()
      .references(() => profile.id, { onDelete: "cascade" }),

    instituteName: text("institute_name"),
    degree: text("degree"),
    course: text("course"),

    startDate: date("start_date"),
    endDate: date("end_date"),

    ...timestamps,
  },
  (table) => [index("education_profile_id_idx").on(table.profileId)],
);

export const educationRelations = relations(education, ({ one }) => ({
  profile: one(profile, {
    fields: [education.profileId],
    references: [profile.id],
  }),
}));

export const likes = pgTable(
  "likes",
  {
    socialPostId: integer("social_post_id")
      .notNull()
      .references(() => socialPost.id, { onDelete: "cascade" }),

    profileId: integer("profile_id")
      .notNull()
      .references(() => profile.id, { onDelete: "cascade" }),

    ...timestamps,
  },
  (table) => [
    primaryKey({ columns: [table.profileId, table.socialPostId] }),
    index("likes_social_post_id_idx").on(table.socialPostId),
  ],
);

export const likeRelations = relations(likes, ({ one }) => ({
  profile: one(profile, {
    fields: [likes.profileId],
    references: [profile.id],
  }),
  socialPost: one(socialPost, {
    fields: [likes.socialPostId],
    references: [socialPost.id],
  }),
}));

export const comments = pgTable(
  "comments",
  {
    id: serial("id").primaryKey(),

    socialPostId: integer("social_post_id")
      .notNull()
      .references(() => socialPost.id, { onDelete: "cascade" }),

    profileId: integer("profile_id")
      .notNull()
      .references(() => profile.id, { onDelete: "cascade" }),

    ...timestamps,
  },
  (table) => [
    index("comments_social_post_id_idx").on(table.socialPostId),
    index("comments_profile_id_idx").on(table.profileId),
  ],
);

export const commentRelations = relations(comments, ({ one }) => ({
  socialPost: one(socialPost, {
    fields: [comments.socialPostId],
    references: [socialPost.id],
  }),
  profile: one(profile, {
    fields: [comments.profileId],
    references: [profile.id],
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
export type Likes = typeof likes.$inferSelect;
export type NewLikes = typeof likes.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

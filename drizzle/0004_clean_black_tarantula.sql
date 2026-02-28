CREATE TABLE "applicants" (
	"id" serial PRIMARY KEY NOT NULL,
	"jobId" integer NOT NULL,
	"profileId" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"profileId" integer NOT NULL,
	"instituteName" text,
	"degree" text,
	"course" text,
	"start_date" date,
	"end_date" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"profileId" integer NOT NULL,
	"company_name" varchar(255),
	"designation" varchar(255),
	"role_and_responsibilities" varchar(1000),
	"skills_learned" varchar(500),
	"currently_working" boolean DEFAULT false,
	"start_date" date,
	"end_date" date,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"organizationId" integer NOT NULL,
	"jobTitle" text,
	"externalJobUrl" text,
	"jobDescription" varchar NOT NULL,
	"minSalary" integer NOT NULL,
	"maxSalary" integer NOT NULL,
	"currency" varchar,
	"discloseSalary" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"medialUrl" text,
	"socialPostId" integer NOT NULL,
	"mediaType" text
);
--> statement-breakpoint
CREATE TABLE "socialPost" (
	"id" serial PRIMARY KEY NOT NULL,
	"postDescription" varchar,
	"profileId" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_jobId_jobs_id_fk" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_profileId_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "education" ADD CONSTRAINT "education_profileId_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_profileId_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media" ADD CONSTRAINT "media_socialPostId_socialPost_id_fk" FOREIGN KEY ("socialPostId") REFERENCES "public"."socialPost"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "socialPost" ADD CONSTRAINT "socialPost_profileId_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "job_profile_unique_idx" ON "applicants" USING btree ("jobId","profileId");--> statement-breakpoint
CREATE INDEX "education_user_idx" ON "education" USING btree ("profileId");--> statement-breakpoint
CREATE INDEX "experience_user_idx" ON "experiences" USING btree ("profileId");--> statement-breakpoint
CREATE INDEX "orgId_idx" ON "jobs" USING btree ("organizationId");--> statement-breakpoint
CREATE INDEX "userId_idx" ON "socialPost" USING btree ("profileId");
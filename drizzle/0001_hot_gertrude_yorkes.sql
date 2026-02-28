CREATE TABLE "organizations" (
	"id" serial PRIMARY KEY NOT NULL,
	"profileId" integer NOT NULL,
	"companyDescription" varchar(256),
	"establishedIn" date,
	"countOfEmployee" text NOT NULL,
	"companyDomain" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_profileId_profile_id_fk" FOREIGN KEY ("profileId") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE no action;
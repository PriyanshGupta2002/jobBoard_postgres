CREATE INDEX "organizations_profileId_idx" ON "organizations" USING btree ("profileId");--> statement-breakpoint
CREATE INDEX "profile_authUserId_idx" ON "profile" USING btree ("authuserId");--> statement-breakpoint
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_profileId_unique" UNIQUE("profileId");--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_authuserId_unique" UNIQUE("authuserId");
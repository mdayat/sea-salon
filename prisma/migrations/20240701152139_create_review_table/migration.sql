-- CreateTable
CREATE TABLE "review" (
    "id" UUID NOT NULL,
    "reviewer_id" UUID NOT NULL,
    "rating" SMALLINT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

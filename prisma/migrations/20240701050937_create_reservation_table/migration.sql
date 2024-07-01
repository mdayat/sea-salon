-- CreateEnum
CREATE TYPE "service_type" AS ENUM ('haircuts_and_styling', 'manicure_and_pedicure', 'facial_treatments');

-- CreateTable
CREATE TABLE "reservation" (
    "id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "service_type" "service_type" NOT NULL,
    "datetime" TIMESTAMP NOT NULL,

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

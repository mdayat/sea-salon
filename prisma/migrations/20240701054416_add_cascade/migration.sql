-- DropForeignKey
ALTER TABLE "reservation" DROP CONSTRAINT "reservation_customer_id_fkey";

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

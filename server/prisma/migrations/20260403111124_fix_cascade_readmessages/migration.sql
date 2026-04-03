-- DropForeignKey
ALTER TABLE "message_reads" DROP CONSTRAINT "message_reads_messageId_fkey";

-- AddForeignKey
ALTER TABLE "message_reads" ADD CONSTRAINT "message_reads_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

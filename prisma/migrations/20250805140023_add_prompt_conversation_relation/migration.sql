/*
  Warnings:

  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserUpvotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_postId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Prompt" DROP CONSTRAINT "Prompt_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Prompt" DROP CONSTRAINT "Prompt_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserUpvotes" DROP CONSTRAINT "_UserUpvotes_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_UserUpvotes" DROP CONSTRAINT "_UserUpvotes_B_fkey";

-- AlterTable
ALTER TABLE "public"."Prompt" ADD COLUMN     "upvotes" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "public"."Comment";

-- DropTable
DROP TABLE "public"."Post";

-- DropTable
DROP TABLE "public"."_UserUpvotes";

-- CreateTable
CREATE TABLE "public"."_PromptUpvotes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PromptUpvotes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PromptUpvotes_B_index" ON "public"."_PromptUpvotes"("B");

-- AddForeignKey
ALTER TABLE "public"."Prompt" ADD CONSTRAINT "Prompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prompt" ADD CONSTRAINT "Prompt_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "public"."Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PromptUpvotes" ADD CONSTRAINT "_PromptUpvotes_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Prompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_PromptUpvotes" ADD CONSTRAINT "_PromptUpvotes_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

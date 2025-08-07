-- CreateTable
CREATE TABLE "public"."_UserUpvotes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserUpvotes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_UserUpvotes_B_index" ON "public"."_UserUpvotes"("B");

-- AddForeignKey
ALTER TABLE "public"."_UserUpvotes" ADD CONSTRAINT "_UserUpvotes_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_UserUpvotes" ADD CONSTRAINT "_UserUpvotes_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

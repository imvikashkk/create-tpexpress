-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "fname" VARCHAR(100) NOT NULL,
    "lname" VARCHAR(100),
    "email" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."credentials" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_hash_key" ON "public"."credentials"("hash");

-- AddForeignKey
ALTER TABLE "public"."credentials" ADD CONSTRAINT "credentials_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;


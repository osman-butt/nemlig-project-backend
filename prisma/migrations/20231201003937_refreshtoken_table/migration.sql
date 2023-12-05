-- CreateTable
CREATE TABLE `User_token` (
    `token_id` VARCHAR(256) NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`token_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User_token` ADD CONSTRAINT `User_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('user', 'admin', 'moderator') NOT NULL,
    `isActive` BOOLEAN NOT NULL,
    `mfaSecret` VARCHAR(191) NULL,
    `passwordResetToken` VARCHAR(191) NULL,
    `passwordResetExpires` DATETIME(3) NULL,
    `lastLogin` DATETIME(3) NULL,
    `loginAttempts` INTEGER NOT NULL,
    `lockUntil` INTEGER NULL,
    `tokenVersion` INTEGER NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

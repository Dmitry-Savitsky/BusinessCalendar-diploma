-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июн 24 2025 г., 22:58
-- Версия сервера: 10.1.48-MariaDB
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Создаём базу, если она ещё не существует
CREATE DATABASE IF NOT EXISTS `jobplanner_BusinessCalendar`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
-- Переключаемся на неё
USE `jobplanner_BusinessCalendar`;

-- --------------------------------------------------------

-- Структура таблицы `ClientAddresses`
CREATE TABLE `ClientAddresses` (
  `Id` int(11) NOT NULL,
  `Address` longtext NOT NULL,
  `ClientId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Дамп данных таблицы `ClientAddresses`
INSERT INTO `ClientAddresses` (`Id`, `Address`, `ClientId`) VALUES
  (1, 'st. Sputnik, 98, 210', 3),
  (2, 'string', 5),
  (3, 'string', 5),
  (4, 'string', 5),
  (5, 'string', 5),
  (6, 'string', 5),
  (7, 'string', 6),
  (8, 'st. Nepokorennih, 89', 16),
  (9, 'st. Nepokorennih, 89', 10),
  (10, 'qwerty', 19),
  (11, 'kkkkk', 28),
  (12, 'пр. Мира, д. 55, кв. 88', 45);



-- --------------------------------------------------------

--
-- Структура таблицы `Clients`
--

CREATE TABLE `Clients` (
  `Id` int(11) NOT NULL,
  `PublicId` char(36) CHARACTER SET ascii NOT NULL,
  `ClientName` longtext NOT NULL,
  `ClientPhone` longtext NOT NULL,
  `CompanyId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `Clients`
--

INSERT INTO `Clients` (`Id`, `PublicId`, `ClientName`, `ClientPhone`, `CompanyId`) VALUES
(3, 'eb51a4bf-62f4-4961-8a5c-5b94a6ba1a9f', 'Barabolya Ilya', '+375296548923', 1),
(4, '90d310d4-deee-401f-92d2-b05caf1f6a48', 'Isakovich Egor', '+375336541252', 1),
(5, '21d43944-9ac0-4719-a804-81ffc2612e2e', 'string', 'string', 1),
(6, '571a542c-7e3e-4a2c-a266-75849e4f6b61', 'Ignat', '+375298745566', 1),
(7, '4f39d2a5-491e-41a7-b167-79e9865d5f88', 'Kate', '+375336658954', 1),
(8, '929a717b-4c2a-4007-ab57-f0ecb4a2bc47', 'Ivan', '+375337894512', 1),
(9, '849dbfa2-76d6-45a4-ad04-46fe9acd423b', 'Vital', '+375336654575', 1),
(10, '9230e28c-58aa-4200-aece-400f5f1c4560', 'George', '+375297895632', 1),
(11, '0c631343-a968-4815-a9c9-ca63ec40f351', 'John', '+375297894563', 1),
(12, 'c8a02e95-bd6a-4c31-a15b-2f49257f6620', 'Ben', '+375297895658', 1),
(13, '603d13b3-e75f-481f-903d-b36743c8e63c', 'Josh', '+375297894588', 1),
(14, 'e1cedc32-5a30-4fa8-a7fe-80cc32add6c6', 'Vladimir', '+375297898565', 1),
(15, '3b6228fb-eb72-47c9-906b-56d2b2c85c7f', 'Doe', '+375297894444', 1),
(16, '46aed4d9-e9e7-462a-9d35-e0bff0e300a3', 'Galya', '+375297865653', 1),
(17, 'eb876944-f81d-4616-bcf7-d55b11a16d6f', 'Greg', '+375297898696', 1),
(18, 'c47d5152-7594-43b5-89cd-0ad0c2986083', 'Gema', '+375295695869', 1),
(19, 'c585c6ee-ef45-471e-9678-70c600a5bd53', 'David', '+375337784848', 1),
(20, '4bcf5546-e402-4e08-a676-490cd3a06a06', 'qqwe', '45813', 1),
(21, '12d8a96e-0633-4b13-9dd1-7328ee83ff4e', 'Ivan', '+375298889977', 1),
(22, '7c4fba42-cc6b-4ae5-b26e-257709dee437', 'david', '+375339941272', 1),
(23, '7e052b96-d991-44b4-ae5c-392f6e341bfd', 'Ilya', '+1238955566', 1),
(24, 'b18314c4-dffc-41a6-96a6-69d6b38c812b', 'Egor', '+375298887898', 1),
(25, 'f48b4ae3-9107-41c4-9547-52037517799d', 'dim', '+375339941', 1),
(26, '272c1fab-10e5-402c-93b8-c27d42dabf79', 'ggg', '+3758895', 1),
(27, 'f1fa911d-1b0a-4355-9fab-c61699d2b346', 'dsa', '+15613513513', 1),
(28, '4a41e4dc-42bb-4b7f-a021-5002cfbe3d25', 'asd', '8898989', 1),
(29, 'f9362b55-3884-40d7-8b10-810fb1b53a20', 'qwe', '151313', 1),
(30, '4b316003-b542-4c21-b0bf-2c64969bf853', 'ivan', '+375889966', 1),
(31, '6641c3df-1cf0-47fe-8395-0fd90723bf20', 'Dmitry', '+375339941288', 1),
(32, '97bc0ffd-506a-4cad-baa1-e36147a2d52f', 'dqaav', '+3592625156', 1),
(33, '536968f8-f659-4b09-8f50-f2b34bd0d3fa', 'OOOOOOYYYY', '+3755555555', 1),
(34, '057914d2-215e-4b6e-8218-d9f9cf1dc990', 'Hun', '+789456123', 1),
(35, 'd4739ab2-411a-482a-8bc5-d78530304756', 'tyui', '+78965485', 1),
(36, 'd810e101-4065-4d68-9f09-b8c55a8e0851', 'TTy', '64565465465', 1),
(37, 'c1b31ff4-a542-4b7a-90e1-218a58bf4409', 'fjei', '48651613', 1),
(38, '1b9cf009-e8f3-480b-b3a7-3f954e5633a5', 'Олег Подскобочный', '+375(33)994-12-72', 1),
(39, '3e508f33-5819-4fad-b0bb-e49b974c8bab', 'sad', '+15313513', 1),
(40, '5ad21103-cac6-4622-bf4c-ab7c485353b5', 'Евгения Ж.', '+375259879879', 1),
(41, 'a0f3aec2-cee3-43ad-811a-f7fccba7d400', 'Василиса', '+375118885566', 1),
(42, '2aec9eec-1318-42b3-a8b2-003ec3de5a3a', 'Денис З.', '+375884561223', 1),
(43, 'b9965ca6-13e4-4297-aedd-c3c2bc88563f', 'Виталий', '+375961235874', 1),
(44, '39fe1961-a94a-4c85-b6f3-4369905cc822', 'Олег', '+375756984235', 1),
(45, '83d213c1-0497-430b-81f3-8da19f252aae', 'Анастасия', '+37589659895', 1),
(46, '27626e3d-fcd5-46fb-88c1-677531afdc9d', 'Борис', '+3754569878', 1),
(47, '1138d4e3-34a6-4918-abc1-64b9ef0e4603', 'Александр', '+3756984231', 1),
(48, '9cbebff7-730b-402d-885d-ffadcf84bb26', 'Давид', '+375642589511', 1),
(49, 'b7f88b81-b132-4fac-9854-cfb2d50b17ac', 'Гена', '+375842697532', 1),
(50, '72dabb0a-b3aa-4dc7-b9e2-adf5446bcd48', 'Зинаида', '+37548963214', 1),
(51, 'c1dfc37e-aa82-4e28-9de5-c8d1c575d0e6', 'Ysdas', '44441665153', 1),
(52, 'e73383d8-4367-43fa-81df-2ca3b2c41555', 'йцу', '489239234', 1),
(53, 'eeaccd06-3164-432d-83b7-59fe754ea1be', 'Дмитрий', '+37525984486465', 1),
(54, '8d8d8be5-0fe2-4138-a3e6-14090a8c4450', 'Женя', '+375265131203', 1),
(55, '8978c68b-7ce8-4c16-a72f-ad2e934d62b3', 'Женя', '+1531468561', 1),
(56, 'fa361ca4-2df1-4aaf-bdbb-25af7de1eef7', 'Дарья', '+375259840533', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `Companies`
--

CREATE TABLE `Companies` (
  `Id` int(11) NOT NULL,
  `PublicId` char(36) CHARACTER SET ascii NOT NULL,
  `CompanyName` longtext,
  `CompanyPhone` longtext,
  `CompanyAddress` longtext,
  `Login` longtext,
  `Password` longtext,
  `ImgPath` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `Companies`
--

INSERT INTO `Companies` (`Id`, `PublicId`, `CompanyName`, `CompanyPhone`, `CompanyAddress`, `Login`, `Password`, `ImgPath`) VALUES
(1, '5134b320-8436-4445-a690-97959bd569fb', 'Цирюльня No. 2', '+375339996645', 'пл. Ленина, 99', 'root', '$2a$11$FEN859fEggiPeDVCG8qbt.ffkV85ixn539Jx7dM088VeFZ1GnyWZS', '/images/ba81f460-a857-449d-9cec-0f8781f2b996_3e7863307b83bd36e472420c576f0a33.jpg'),
(2, '187f7ef6-d5e3-47bf-b5cd-41477b1e8e8c', 'Best haircuts', '+375297896565', 'st. Lenina, 56', 'qwe', '$2a$11$3Xt2rwUly6emvaDE9vinduLvbVmskjGfKU2bZ63.Eq9D9e/vU/vkm', ''),
(3, '44011648-78dd-4fb4-afeb-a3ac6e5974e3', 'PhotoTopStudio', '+375297775588', 'st. Gorchina, 63', 'root99', '$2a$11$P75aB/wd0phFm/drKxEUsO8uQ9xTN6bFFMqEWW1sNgote4cVvsi8e', ''),
(4, '38f13dfa-da91-4f39-b179-decebf1e634e', 'Парикмахерская CutStyle', '+375298887744', 'Пионерская улица, 5, Могилёв', 'admin', '$2a$11$lhvk.KGVGvGTwPq.TzXvk.PAhgOkBCSoIxsSoVAkRLmQQheKKsnNS', ''),
(5, 'e98926f2-598c-4960-a2df-ded8bd1a1d60', 'qweadasd', '+375298887745', 'Пионерская улица, 88, Могилёв', 'rootroot', '$2a$11$63QK/3Vni5YuShoAprDUvOZLyMyKQDZ6/Ya8t5FaY615EIT001XcS', '');

-- --------------------------------------------------------

--
-- Структура таблицы `ExecutorHasServices`
--

CREATE TABLE `ExecutorHasServices` (
  `ExecutorId` int(11) NOT NULL,
  `ServiceId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `ExecutorHasServices`
--

INSERT INTO `ExecutorHasServices` (`ExecutorId`, `ServiceId`) VALUES
(1, 1),
(1, 2),
(1, 6),
(1, 8),
(1, 9),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(4, 4),
(4, 5),
(4, 6),
(4, 7),
(7, 8),
(7, 9),
(8, 1),
(8, 2),
(8, 4),
(8, 9);

-- --------------------------------------------------------

--
-- Структура таблицы `ExecutorNotifications`
--

CREATE TABLE `ExecutorNotifications` (
  `Id` int(11) NOT NULL,
  `ExecutorId` int(11) NOT NULL,
  `IntervalMinutes` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `Executors`
--

CREATE TABLE `Executors` (
  `Id` int(11) NOT NULL,
  `PublicId` char(36) CHARACTER SET ascii NOT NULL,
  `ExecutorName` longtext NOT NULL,
  `ExecutorPhone` longtext NOT NULL,
  `Password` longtext,
  `Description` longtext,
  `CompanyId` int(11) NOT NULL,
  `ImgPath` longtext NOT NULL,
  `TelegramId` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `Executors`
--

INSERT INTO `Executors` (`Id`, `PublicId`, `ExecutorName`, `ExecutorPhone`, `Password`, `Description`, `CompanyId`, `ImgPath`, `TelegramId`) VALUES
(1, '6805ee40-3e14-407a-a6b2-06e07240ed5b', 'Дарья В.', '+375298876959', '$2a$11$H7WXCJTiOjgn/WUi9VTwUuexSoh9EWXoezKl8JNj2criW7AjUDtzq', 'Женские стрижки', 1, '/images/18151c72-119f-45fd-9ec6-845bd86e9ffa_4.png', NULL),
(2, '64aebc91-4caf-4322-984a-354acabd7478', 'Иван Б.', '+375295468585', '$2a$11$3.pmL9BZAIMc3rSvNkBoguk474I3w2OF6ABjcFNZsXQeDkGpHy5dy', 'Мужские стрижки', 1, '/images/528c6b83-e5d5-415b-a53a-f9b878953ee9_2.png', NULL),
(4, 'ad1adf22-18d6-487b-b004-791c0f6f27d0', 'Евгений Х.', '+375295552233', '$2a$11$igiOJgooIkykmr1dujNVa.vqFtOND7c3zgXS/xQDWxhkynQnAEAme', 'Мужские стрижки', 1, '/images/e017afa1-d1c8-47c9-93fc-5401a37bdce7_3.png', NULL),
(7, 'eef2ff42-a1b6-44fc-9406-cb224807aaf1', 'Наталья Р.', '+375297895686', '$2a$11$Bx6LFzmj4drQZBtFJmKAe.rQ9Wy9fZG6eMNuUho84FTbbKZoABAC.', 'Маникюр', 1, '/images/5b14f930-65ce-42b9-8296-95ca2e8d0eb3_5.png', NULL),
(8, 'b8a56b39-9be5-4197-8474-cdb852a61e92', 'Жанна И.', '+375297896989', NULL, 'Окрашивание', 1, '/images/57dd7dac-5578-45db-94d0-487b56be7b71_1.png', NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `ExecutorWorkTimes`
--

CREATE TABLE `ExecutorWorkTimes` (
  `Id` int(11) NOT NULL,
  `ExecutorId` int(11) NOT NULL,
  `DayNo` int(11) DEFAULT NULL,
  `IsWorking` tinyint(1) NOT NULL,
  `FromTime` time(6) DEFAULT NULL,
  `TillTime` time(6) DEFAULT NULL,
  `BreakStart` time(6) DEFAULT NULL,
  `BreakEnd` time(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `ExecutorWorkTimes`
--

INSERT INTO `ExecutorWorkTimes` (`Id`, `ExecutorId`, `DayNo`, `IsWorking`, `FromTime`, `TillTime`, `BreakStart`, `BreakEnd`) VALUES
(1, 1, 0, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(2, 1, 1, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(3, 1, 2, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(4, 1, 3, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(5, 1, 4, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(6, 1, 5, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(7, 1, 6, 0, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(8, 2, 0, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(9, 2, 1, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(10, 2, 2, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(11, 2, 3, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(12, 2, 4, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(13, 2, 5, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(14, 2, 6, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(22, 4, 0, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(23, 4, 1, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(24, 4, 2, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(25, 4, 3, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(26, 4, 4, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(27, 4, 5, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(28, 4, 6, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(43, 7, 0, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(44, 7, 1, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(45, 7, 2, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(46, 7, 3, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(47, 7, 4, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(48, 7, 5, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(49, 7, 6, 1, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(50, 8, 0, 0, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(51, 8, 1, 0, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(52, 8, 2, 0, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(53, 8, 3, 0, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(54, 8, 4, 0, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(55, 8, 5, 0, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000'),
(56, 8, 6, 0, '09:00:00.000000', '18:00:00.000000', '14:00:00.000000', '15:00:00.000000');

-- --------------------------------------------------------

--
-- Структура таблицы `Orders`
--

CREATE TABLE `Orders` (
  `Id` int(11) NOT NULL,
  `PublicId` char(36) CHARACTER SET ascii NOT NULL,
  `OrderComment` longtext,
  `ClientId` int(11) NOT NULL,
  `OrderStart` datetime(6) NOT NULL,
  `OrderEnd` datetime(6) DEFAULT NULL,
  `ClientAddressId` int(11) DEFAULT NULL,
  `Confirmed` tinyint(1) DEFAULT NULL,
  `Completed` tinyint(1) DEFAULT NULL,
  `CompanyId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `Orders`
--

INSERT INTO `Orders` (`Id`, `PublicId`, `OrderComment`, `ClientId`, `OrderStart`, `OrderEnd`, `ClientAddressId`, `Confirmed`, `Completed`, `CompanyId`) VALUES
(4, '5c723822-bdae-466c-a565-d0878944589f', 'first time', 8, '2025-05-17 07:00:00.000000', '2025-05-17 07:30:00.000000', NULL, NULL, NULL, 1),
(5, '3f156234-2f2a-4293-9da7-bff578315dff', 'hope that would be great', 9, '2025-05-18 06:00:00.000000', '2025-05-18 07:10:00.000000', NULL, 1, NULL, 1),
(6, '2cd3f675-5b06-4cd9-91ab-283ea1e3bb32', 'waiting', 10, '2025-05-18 07:15:00.000000', '2025-05-18 08:55:00.000000', NULL, 1, NULL, 1),
(8, '822b4474-577b-437a-8427-512494979980', NULL, 12, '2025-05-19 09:15:00.000000', '2025-05-19 09:45:00.000000', NULL, 1, 1, 1),
(9, 'e294094d-cbd5-4bd8-a17f-19abfc5fc7b5', NULL, 13, '2025-05-19 07:45:00.000000', '2025-05-19 07:55:00.000000', NULL, 1, NULL, 1),
(10, 'b90ef0ea-f1a1-44ac-87a9-f3ce13ada826', NULL, 14, '2025-05-19 06:15:00.000000', '2025-05-19 06:25:00.000000', NULL, 1, NULL, 1),
(11, '642e2bc5-65da-4557-9481-f0f2ee39c980', 'no comments', 15, '2025-05-19 06:45:00.000000', '2025-05-19 08:45:00.000000', NULL, 1, NULL, 1),
(14, 'b5ec1c67-058d-44b2-b505-52e90fd48a1e', NULL, 18, '2025-05-19 07:00:00.000000', '2025-05-19 07:30:00.000000', NULL, 1, NULL, 1),
(15, 'be29f0c5-3e99-4239-a370-8611f8a50d03', NULL, 10, '2025-05-22 07:00:00.000000', '2025-05-22 09:00:00.000000', 9, 1, NULL, 1),
(16, 'ef5048c0-5683-4d2d-8c49-c271416b6596', NULL, 19, '2025-05-21 06:00:00.000000', '2025-05-21 08:00:00.000000', 10, 1, NULL, 1),
(17, '6eca2b13-a686-4cfd-802a-9a4f957883c7', NULL, 19, '2025-05-21 08:00:00.000000', '2025-05-21 08:10:00.000000', NULL, 1, NULL, 1),
(18, 'e0e4d3fa-2d63-488c-947e-0184775d49d0', NULL, 19, '2025-05-22 14:30:00.000000', '2025-05-22 14:40:00.000000', NULL, 1, NULL, 1),
(19, 'f9ef3b6e-3aa9-4d11-820e-f11bc5e20491', NULL, 20, '2025-05-22 13:45:00.000000', '2025-05-22 13:55:00.000000', NULL, 1, NULL, 1),
(20, '22db8b53-9c3c-4893-9285-c9c679ecfc46', 'will be nice', 21, '2025-05-23 06:00:00.000000', '2025-05-23 06:45:00.000000', NULL, 1, NULL, 1),
(21, 'b5578abe-a869-4816-ad0d-c4b78fbab564', 'okay', 22, '2025-05-25 09:30:00.000000', '2025-05-25 10:15:00.000000', NULL, 1, NULL, 1),
(22, 'b2b97bed-2827-4a1c-8642-40b5db22a409', 'good', 23, '2025-05-25 06:00:00.000000', '2025-05-25 06:10:00.000000', NULL, 1, NULL, 1),
(23, '61cf453f-ae06-4018-8a14-55ae5b8f417b', 'okay', 24, '2025-05-27 12:00:00.000000', '2025-05-27 12:10:00.000000', NULL, 1, NULL, 1),
(24, '596dcb53-1706-4a4b-ac37-506958dc556b', 'gg', 25, '2025-05-25 09:45:00.000000', '2025-05-25 10:15:00.000000', NULL, 1, NULL, 1),
(25, '3feea586-90a6-43a7-9c2e-3634c7c1ad03', 'kk', 26, '2025-05-25 08:30:00.000000', '2025-05-25 08:40:00.000000', NULL, 1, NULL, 1),
(26, '366d36dc-8001-4238-ad56-6141cf5b355b', '151515', 27, '2025-05-25 12:30:00.000000', '2025-05-25 14:30:00.000000', NULL, 1, NULL, 1),
(27, 'a88def22-1284-4529-ac66-916c9d49678a', 'ii', 28, '2025-05-25 08:30:00.000000', '2025-05-25 10:30:00.000000', 11, 1, NULL, 1),
(29, '92cdd616-4acd-45b4-9315-49641b5c7fcf', NULL, 30, '2025-05-24 07:15:00.000000', '2025-05-24 07:25:00.000000', NULL, 1, NULL, 1),
(30, '4893f48c-1cf0-46f2-ab34-cfb94846ea1c', NULL, 31, '2025-05-29 09:15:00.000000', '2025-05-29 09:55:00.000000', NULL, 1, NULL, 1),
(31, '0d95ba0f-56f5-46b2-9f3e-e5bf8b80af24', NULL, 32, '2025-05-29 10:15:00.000000', '2025-05-29 10:55:00.000000', NULL, 1, NULL, 1),
(32, '6f82cc00-beb3-496c-9c3b-a60b65181ea6', 'QQQKKKQQQ', 33, '2025-05-26 08:15:00.000000', '2025-05-26 09:15:00.000000', NULL, 1, NULL, 1),
(33, 'f706cd36-21dd-45b4-a211-ac94f2502c78', 'okok', 34, '2025-05-28 10:15:00.000000', '2025-05-28 10:55:00.000000', NULL, 1, NULL, 1),
(34, '95d627f9-e870-4da0-8327-9e3e65bf14cb', 'qwe', 22, '2025-05-28 12:00:00.000000', '2025-05-28 12:40:00.000000', NULL, 1, NULL, 1),
(35, '0136279c-80af-4837-bc95-e3132e2ca518', 'll', 25, '2025-05-27 12:15:00.000000', '2025-05-27 12:45:00.000000', NULL, 1, NULL, 1),
(37, 'd1da4666-09ca-44c5-9bf6-62339581e37d', 'asdsadas', 36, '2025-05-24 06:00:00.000000', '2025-05-24 06:45:00.000000', NULL, 1, NULL, 1),
(38, 'fdf8f105-89f1-41d2-897e-19b370d8268f', 'fasddas', 37, '2025-05-24 07:30:00.000000', '2025-05-24 07:40:00.000000', NULL, 1, NULL, 1),
(39, '3bd58fa4-5c82-4718-93c6-dc30706684a4', 'wweqqew', 25, '2025-05-25 12:15:00.000000', '2025-05-25 12:25:00.000000', NULL, 1, NULL, 1),
(40, '19a186fd-0103-4e8a-a47f-cad8bb5e7aee', '', 38, '2025-05-28 08:30:00.000000', '2025-05-28 09:10:00.000000', NULL, 0, NULL, 1),
(41, '5d09dccc-ae78-416f-a872-d8be20b549a5', '', 22, '2025-05-26 06:00:00.000000', '2025-05-26 06:40:00.000000', NULL, 0, NULL, 1),
(44, '5f440708-8846-42b4-ba86-41abf2ff644a', '', 22, '2025-05-26 06:00:00.000000', '2025-05-26 06:45:00.000000', NULL, 0, NULL, 1),
(45, 'b89cf16e-b81b-44a6-9e55-a805aaf904ba', '', 22, '2025-05-26 12:00:00.000000', '2025-05-26 13:00:00.000000', NULL, 0, NULL, 1),
(46, 'f7c6268a-4f53-4dab-9da1-e583ac78c6ba', '', 22, '2025-05-25 12:00:00.000000', '2025-05-25 12:10:00.000000', NULL, 0, NULL, 1),
(47, 'a4edc59f-8303-42cf-a3d6-eef6eb24c605', 'без комментариев', 22, '2025-05-29 10:45:00.000000', '2025-05-29 10:55:00.000000', NULL, 0, NULL, 1),
(49, '183c55d1-64e5-4428-92bf-b11c85e4b649', '', 25, '2025-05-29 12:00:00.000000', '2025-05-29 12:40:00.000000', NULL, 0, NULL, 1),
(50, '75b88ca2-979e-4538-8265-e9f8b7ceb3cb', '', 22, '2025-05-30 06:15:00.000000', '2025-05-30 06:55:00.000000', NULL, 0, NULL, 1),
(51, '107755d7-d0a7-436f-95c4-107df01dec6a', NULL, 40, '2025-06-05 06:00:00.000000', '2025-06-05 06:45:00.000000', NULL, 0, NULL, 1),
(52, 'e52fa14f-ef91-4d63-8cf9-90a021b95391', NULL, 41, '2025-06-05 07:00:00.000000', '2025-06-05 07:45:00.000000', NULL, 0, NULL, 1),
(53, '9c18e1e4-b608-4be1-8ff0-9afb4adea978', NULL, 42, '2025-06-05 09:00:00.000000', '2025-06-05 09:15:00.000000', NULL, 1, 1, 1),
(54, '8f70dd5a-434b-4b39-b74d-2f64331b6e5e', NULL, 43, '2025-06-05 06:00:00.000000', '2025-06-05 06:15:00.000000', NULL, 0, NULL, 1),
(55, '7251c197-1e68-4bd1-b69b-caa33680929d', NULL, 43, '2025-06-05 06:45:00.000000', '2025-06-05 07:25:00.000000', NULL, 0, NULL, 1),
(56, '2d878eb9-64e4-460e-a548-fdf68586e215', NULL, 43, '2025-06-05 07:30:00.000000', '2025-06-05 07:55:00.000000', NULL, 0, NULL, 1),
(57, '1cc8b9e0-d856-408d-87f3-d15b9d990a17', NULL, 44, '2025-06-05 10:15:00.000000', '2025-06-05 10:55:00.000000', NULL, 0, NULL, 1),
(58, '801e02f6-f4fa-4826-8fe4-0bedac983a41', NULL, 45, '2025-06-05 12:15:00.000000', '2025-06-05 13:00:00.000000', 12, 1, 1, 1),
(59, '3e66b9af-2a9f-4b27-83a1-aed4db47686b', NULL, 46, '2025-06-05 06:15:00.000000', '2025-06-05 06:55:00.000000', NULL, 0, NULL, 1),
(60, 'f50b26d3-c673-4c11-87ce-97457a8129af', NULL, 47, '2025-06-05 07:30:00.000000', '2025-06-05 08:10:00.000000', NULL, 0, NULL, 1),
(61, '5dcecb23-b46d-4f5a-9233-a0639e6f8992', NULL, 48, '2025-06-05 08:15:00.000000', '2025-06-05 08:30:00.000000', NULL, 1, NULL, 1),
(62, 'aea61066-1b9f-4a19-bfee-845975a53135', NULL, 49, '2025-06-05 12:00:00.000000', '2025-06-05 12:25:00.000000', NULL, 0, NULL, 1),
(63, '349b315b-cbb4-41be-b823-4ba37e998b5e', NULL, 50, '2025-06-05 06:45:00.000000', '2025-06-05 08:15:00.000000', NULL, 0, NULL, 1),
(67, 'e11aad73-5003-4789-8680-1b115e45bf4c', '', 25, '2025-06-05 13:45:00.000000', '2025-06-05 14:30:00.000000', NULL, 0, NULL, 1),
(69, '98336c97-4630-476a-831c-0a5e90f0eb99', '', 53, '2025-06-14 06:15:00.000000', '2025-06-14 06:40:00.000000', NULL, 0, NULL, 1),
(71, '764ff7f8-8cbb-4299-a80c-4258fc5e1cba', NULL, 54, '2025-06-18 07:15:00.000000', '2025-06-18 08:15:00.000000', NULL, 0, NULL, 1),
(72, 'd49bda5c-be9b-4ea6-aae7-6d58a17e9db6', '', 55, '2025-06-18 07:15:00.000000', '2025-06-18 08:00:00.000000', NULL, 1, NULL, 1),
(73, 'e8ff0470-5776-4415-b985-93c9e1d33cf1', NULL, 43, '2025-06-19 06:45:00.000000', '2025-06-19 07:30:00.000000', NULL, 0, NULL, 1),
(74, '72bf2b2b-7f2d-4b74-b121-b086c0b2d255', '', 56, '2025-06-20 06:00:00.000000', '2025-06-20 07:00:00.000000', NULL, 0, NULL, 1),
(75, 'b28a8bfd-9b91-421d-8078-6fc0373b23e4', '', 22, '2025-06-20 09:30:00.000000', '2025-06-20 10:15:00.000000', NULL, 0, NULL, 1),
(76, 'f8a85bef-097a-4260-b93f-7e605fb3c54d', '', 22, '2025-06-22 06:15:00.000000', '2025-06-22 07:00:00.000000', NULL, 0, NULL, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `Reviews`
--

CREATE TABLE `Reviews` (
  `Id` int(11) NOT NULL,
  `ReviewText` longtext,
  `ReviewRating` int(11) NOT NULL,
  `ClientId` int(11) NOT NULL,
  `OrderId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Структура таблицы `ServiceInOrders`
--

CREATE TABLE `ServiceInOrders` (
  `Id` int(11) NOT NULL,
  `OrderId` int(11) NOT NULL,
  `ServiceId` int(11) NOT NULL,
  `ExecutorId` int(11) NOT NULL,
  `ServiceStart` datetime(6) DEFAULT NULL,
  `ServiceEnd` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `ServiceInOrders`
--

INSERT INTO `ServiceInOrders` (`Id`, `OrderId`, `ServiceId`, `ExecutorId`, `ServiceStart`, `ServiceEnd`) VALUES
(4, 4, 4, 2, '2025-05-17 07:00:00.000000', '2025-05-17 07:30:00.000000'),
(5, 5, 6, 4, '2025-05-18 06:00:00.000000', '2025-05-18 06:10:00.000000'),
(6, 5, 5, 2, '2025-05-18 06:30:00.000000', '2025-05-18 07:10:00.000000'),
(7, 6, 5, 2, '2025-05-18 07:15:00.000000', '2025-05-18 07:55:00.000000'),
(8, 6, 7, 2, '2025-05-18 08:30:00.000000', '2025-05-18 08:55:00.000000'),
(10, 8, 4, 2, '2025-05-19 09:15:00.000000', '2025-05-19 09:45:00.000000'),
(11, 9, 6, 4, '2025-05-19 07:45:00.000000', '2025-05-19 07:55:00.000000'),
(12, 10, 6, 2, '2025-05-19 06:15:00.000000', '2025-05-19 06:25:00.000000'),
(13, 11, 9, 1, '2025-05-19 06:45:00.000000', '2025-05-19 08:45:00.000000'),
(16, 14, 4, 2, '2025-05-19 07:00:00.000000', '2025-05-19 07:30:00.000000'),
(17, 15, 9, 7, '2025-05-22 07:00:00.000000', '2025-05-22 09:00:00.000000'),
(18, 16, 9, 1, '2025-05-21 06:00:00.000000', '2025-05-21 08:00:00.000000'),
(19, 17, 6, 1, '2025-05-21 08:00:00.000000', '2025-05-21 08:10:00.000000'),
(20, 18, 6, 4, '2025-05-22 14:30:00.000000', '2025-05-22 14:40:00.000000'),
(21, 19, 6, 2, '2025-05-22 13:45:00.000000', '2025-05-22 13:55:00.000000'),
(22, 20, 1, 1, '2025-05-23 06:00:00.000000', '2025-05-23 06:45:00.000000'),
(23, 21, 1, 1, '2025-05-25 09:30:00.000000', '2025-05-25 10:15:00.000000'),
(24, 22, 6, 1, '2025-05-25 06:00:00.000000', '2025-05-25 06:10:00.000000'),
(25, 23, 6, 2, '2025-05-27 12:00:00.000000', '2025-05-27 12:10:00.000000'),
(26, 24, 4, 2, '2025-05-25 09:45:00.000000', '2025-05-25 10:15:00.000000'),
(27, 25, 6, 2, '2025-05-25 08:30:00.000000', '2025-05-25 08:40:00.000000'),
(28, 26, 9, 4, '2025-05-25 12:30:00.000000', '2025-05-25 14:30:00.000000'),
(29, 27, 9, 7, '2025-05-25 08:30:00.000000', '2025-05-25 10:30:00.000000'),
(31, 29, 6, 4, '2025-05-24 07:15:00.000000', '2025-05-24 07:25:00.000000'),
(32, 30, 5, 2, '2025-05-29 09:15:00.000000', '2025-05-29 09:55:00.000000'),
(33, 31, 5, 2, '2025-05-29 10:15:00.000000', '2025-05-29 10:55:00.000000'),
(34, 32, 2, 1, '2025-05-26 08:15:00.000000', '2025-05-26 09:15:00.000000'),
(35, 33, 5, 2, '2025-05-28 10:15:00.000000', '2025-05-28 10:55:00.000000'),
(36, 34, 5, 2, '2025-05-28 12:00:00.000000', '2025-05-28 12:40:00.000000'),
(37, 35, 4, 2, '2025-05-27 12:15:00.000000', '2025-05-27 12:45:00.000000'),
(39, 37, 1, 1, '2025-05-24 06:00:00.000000', '2025-05-24 06:45:00.000000'),
(40, 38, 6, 4, '2025-05-24 07:30:00.000000', '2025-05-24 07:40:00.000000'),
(41, 39, 6, 4, '2025-05-25 12:15:00.000000', '2025-05-25 12:25:00.000000'),
(42, 40, 5, 2, '2025-05-28 08:30:00.000000', '2025-05-28 09:10:00.000000'),
(43, 41, 5, 2, '2025-05-26 06:00:00.000000', '2025-05-26 06:40:00.000000'),
(46, 44, 1, 1, '2025-05-26 06:00:00.000000', '2025-05-26 06:45:00.000000'),
(47, 45, 2, 1, '2025-05-26 12:00:00.000000', '2025-05-26 13:00:00.000000'),
(48, 46, 8, 7, '2025-05-25 12:00:00.000000', '2025-05-25 12:10:00.000000'),
(49, 47, 6, 1, '2025-05-29 10:45:00.000000', '2025-05-29 10:55:00.000000'),
(52, 49, 5, 2, '2025-05-29 12:00:00.000000', '2025-05-29 12:40:00.000000'),
(53, 50, 5, 2, '2025-05-30 06:15:00.000000', '2025-05-30 06:55:00.000000'),
(54, 51, 1, 1, '2025-06-05 06:00:00.000000', '2025-06-05 06:45:00.000000'),
(55, 52, 1, 1, '2025-06-05 07:00:00.000000', '2025-06-05 07:45:00.000000'),
(56, 53, 6, 1, '2025-06-05 09:00:00.000000', '2025-06-05 09:15:00.000000'),
(57, 54, 6, 2, '2025-06-05 06:00:00.000000', '2025-06-05 06:15:00.000000'),
(58, 55, 5, 2, '2025-06-05 06:45:00.000000', '2025-06-05 07:25:00.000000'),
(59, 56, 7, 2, '2025-06-05 07:30:00.000000', '2025-06-05 07:55:00.000000'),
(60, 57, 5, 2, '2025-06-05 10:15:00.000000', '2025-06-05 10:55:00.000000'),
(61, 58, 8, 1, '2025-06-05 12:15:00.000000', '2025-06-05 13:00:00.000000'),
(62, 59, 5, 4, '2025-06-05 06:15:00.000000', '2025-06-05 06:55:00.000000'),
(63, 60, 5, 4, '2025-06-05 07:30:00.000000', '2025-06-05 08:10:00.000000'),
(64, 61, 6, 4, '2025-06-05 08:15:00.000000', '2025-06-05 08:30:00.000000'),
(65, 62, 7, 4, '2025-06-05 12:00:00.000000', '2025-06-05 12:25:00.000000'),
(66, 63, 9, 7, '2025-06-05 06:45:00.000000', '2025-06-05 08:15:00.000000'),
(70, 67, 1, 1, '2025-06-05 13:45:00.000000', '2025-06-05 14:30:00.000000'),
(72, 69, 7, 2, '2025-06-14 06:15:00.000000', '2025-06-14 06:40:00.000000'),
(74, 71, 2, 1, '2025-06-18 07:15:00.000000', '2025-06-18 08:15:00.000000'),
(75, 72, 1, 1, '2025-06-18 07:15:00.000000', '2025-06-18 08:00:00.000000'),
(76, 73, 1, 1, '2025-06-19 06:45:00.000000', '2025-06-19 07:30:00.000000'),
(77, 74, 2, 1, '2025-06-20 06:00:00.000000', '2025-06-20 07:00:00.000000'),
(78, 75, 1, 1, '2025-06-20 09:30:00.000000', '2025-06-20 10:15:00.000000'),
(79, 76, 1, 1, '2025-06-22 06:15:00.000000', '2025-06-22 07:00:00.000000');

-- --------------------------------------------------------

--
-- Структура таблицы `Services`
--

CREATE TABLE `Services` (
  `Id` int(11) NOT NULL,
  `PublicId` char(36) CHARACTER SET ascii NOT NULL,
  `ServiceName` longtext NOT NULL,
  `ServiceType` int(11) NOT NULL,
  `ServicePrice` int(11) DEFAULT NULL,
  `DurationMinutes` int(11) DEFAULT NULL,
  `RequiresAddress` tinyint(1) NOT NULL,
  `CompanyId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `Services`
--

INSERT INTO `Services` (`Id`, `PublicId`, `ServiceName`, `ServiceType`, `ServicePrice`, `DurationMinutes`, `RequiresAddress`, `CompanyId`) VALUES
(1, 'd619133e-2ae1-4829-912f-b1cf76422e8a', 'Женская стрижка', 1, 70, 45, 0, 1),
(2, 'cb949109-df97-4f60-8d2e-ab0a4849c691', 'Женское окрашивание волос', 3, 150, 60, 0, 1),
(4, '5931df9a-ddea-4948-82ae-2ced538d4fda', 'Мужское окрашивание волос', 3, 120, 30, 0, 1),
(5, '9c78a7bc-eb31-455e-ba4e-c7e58e281310', 'Мужская стрижка', 1, 60, 40, 0, 1),
(6, '2ad44edc-12d8-42b1-9363-8036a19e58d5', 'Консультация стилиста', 5, 20, 15, 0, 1),
(7, 'b7c71a7a-0c4b-47e1-9eb7-bc511c1712f8', 'Стрижка бороды', 1, 40, 25, 0, 1),
(8, '71fe59e2-f114-487c-8d13-38a3bdb78a16', 'Укладка', 2, 65, 45, 1, 1),
(9, '4aa159ea-7953-4ec9-a10f-f1927f5d2248', 'Маникюр', 6, 95, 90, 0, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `__EFMigrationsHistory`
--

CREATE TABLE `__EFMigrationsHistory` (
  `MigrationId` varchar(150) NOT NULL,
  `ProductVersion` varchar(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Дамп данных таблицы `__EFMigrationsHistory`
--

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`) VALUES
('20250514220919_InitialCreate', '8.0.11'),
('20250528105445_AddTelegramIdAndExecutorNotifications', '8.0.11');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `ClientAddresses`
--
ALTER TABLE `ClientAddresses`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_ClientAddresses_ClientId` (`ClientId`);

--
-- Индексы таблицы `Clients`
--
ALTER TABLE `Clients`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Clients_CompanyId` (`CompanyId`);

--
-- Индексы таблицы `Companies`
--
ALTER TABLE `Companies`
  ADD PRIMARY KEY (`Id`);

--
-- Индексы таблицы `ExecutorHasServices`
--
ALTER TABLE `ExecutorHasServices`
  ADD PRIMARY KEY (`ExecutorId`,`ServiceId`),
  ADD KEY `IX_ExecutorHasServices_ServiceId` (`ServiceId`);

--
-- Индексы таблицы `ExecutorNotifications`
--
ALTER TABLE `ExecutorNotifications`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_ExecutorNotifications_ExecutorId` (`ExecutorId`);

--
-- Индексы таблицы `Executors`
--
ALTER TABLE `Executors`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Executors_CompanyId` (`CompanyId`);

--
-- Индексы таблицы `ExecutorWorkTimes`
--
ALTER TABLE `ExecutorWorkTimes`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_ExecutorWorkTimes_ExecutorId` (`ExecutorId`);

--
-- Индексы таблицы `Orders`
--
ALTER TABLE `Orders`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Orders_ClientAddressId` (`ClientAddressId`),
  ADD KEY `IX_Orders_ClientId` (`ClientId`),
  ADD KEY `IX_Orders_CompanyId` (`CompanyId`);

--
-- Индексы таблицы `Reviews`
--
ALTER TABLE `Reviews`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Reviews_ClientId` (`ClientId`),
  ADD KEY `IX_Reviews_OrderId` (`OrderId`);

--
-- Индексы таблицы `ServiceInOrders`
--
ALTER TABLE `ServiceInOrders`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_ServiceInOrders_ExecutorId` (`ExecutorId`),
  ADD KEY `IX_ServiceInOrders_OrderId` (`OrderId`),
  ADD KEY `IX_ServiceInOrders_ServiceId` (`ServiceId`);

--
-- Индексы таблицы `Services`
--
ALTER TABLE `Services`
  ADD PRIMARY KEY (`Id`),
  ADD KEY `IX_Services_CompanyId` (`CompanyId`);

--
-- Индексы таблицы `__EFMigrationsHistory`
--
ALTER TABLE `__EFMigrationsHistory`
  ADD PRIMARY KEY (`MigrationId`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `ClientAddresses`
--
ALTER TABLE `ClientAddresses`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT для таблицы `Clients`
--
ALTER TABLE `Clients`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT для таблицы `Companies`
--
ALTER TABLE `Companies`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `ExecutorNotifications`
--
ALTER TABLE `ExecutorNotifications`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `Executors`
--
ALTER TABLE `Executors`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT для таблицы `ExecutorWorkTimes`
--
ALTER TABLE `ExecutorWorkTimes`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT для таблицы `Orders`
--
ALTER TABLE `Orders`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=77;

--
-- AUTO_INCREMENT для таблицы `Reviews`
--
ALTER TABLE `Reviews`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `ServiceInOrders`
--
ALTER TABLE `ServiceInOrders`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT для таблицы `Services`
--
ALTER TABLE `Services`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `ClientAddresses`
--
ALTER TABLE `ClientAddresses`
  ADD CONSTRAINT `FK_ClientAddresses_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `Clients` (`Id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Clients`
--
ALTER TABLE `Clients`
  ADD CONSTRAINT `FK_Clients_Companies_CompanyId` FOREIGN KEY (`CompanyId`) REFERENCES `Companies` (`Id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `ExecutorHasServices`
--
ALTER TABLE `ExecutorHasServices`
  ADD CONSTRAINT `FK_ExecutorHasServices_Executors_ExecutorId` FOREIGN KEY (`ExecutorId`) REFERENCES `Executors` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_ExecutorHasServices_Services_ServiceId` FOREIGN KEY (`ServiceId`) REFERENCES `Services` (`Id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `ExecutorNotifications`
--
ALTER TABLE `ExecutorNotifications`
  ADD CONSTRAINT `FK_ExecutorNotifications_Executors_ExecutorId` FOREIGN KEY (`ExecutorId`) REFERENCES `Executors` (`Id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Executors`
--
ALTER TABLE `Executors`
  ADD CONSTRAINT `FK_Executors_Companies_CompanyId` FOREIGN KEY (`CompanyId`) REFERENCES `Companies` (`Id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `ExecutorWorkTimes`
--
ALTER TABLE `ExecutorWorkTimes`
  ADD CONSTRAINT `FK_ExecutorWorkTimes_Executors_ExecutorId` FOREIGN KEY (`ExecutorId`) REFERENCES `Executors` (`Id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Orders`
--
ALTER TABLE `Orders`
  ADD CONSTRAINT `FK_Orders_ClientAddresses_ClientAddressId` FOREIGN KEY (`ClientAddressId`) REFERENCES `ClientAddresses` (`Id`),
  ADD CONSTRAINT `FK_Orders_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `Clients` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Orders_Companies_CompanyId` FOREIGN KEY (`CompanyId`) REFERENCES `Companies` (`Id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `Reviews`
--
ALTER TABLE `Reviews`
  ADD CONSTRAINT `FK_Reviews_Clients_ClientId` FOREIGN KEY (`ClientId`) REFERENCES `Clients` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_Reviews_Orders_OrderId` FOREIGN KEY (`OrderId`) REFERENCES `Orders` (`Id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `ServiceInOrders`
--
ALTER TABLE `ServiceInOrders`
  ADD CONSTRAINT `FK_ServiceInOrders_Executors_ExecutorId` FOREIGN KEY (`ExecutorId`) REFERENCES `Executors` (`Id`),
  ADD CONSTRAINT `FK_ServiceInOrders_Orders_OrderId` FOREIGN KEY (`OrderId`) REFERENCES `Orders` (`Id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_ServiceInOrders_Services_ServiceId` FOREIGN KEY (`ServiceId`) REFERENCES `Services` (`Id`);

--
-- Ограничения внешнего ключа таблицы `Services`
--
ALTER TABLE `Services`
  ADD CONSTRAINT `FK_Services_Companies_CompanyId` FOREIGN KEY (`CompanyId`) REFERENCES `Companies` (`Id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


COMMIT;
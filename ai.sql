SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `brain` (
  `id` int(11) NOT NULL,
  `instance` text COLLATE utf8_polish_ci NOT NULL,
  `message` longtext COLLATE utf8_polish_ci NOT NULL,
  `reply` longtext COLLATE utf8_polish_ci NOT NULL,
  `info` text COLLATE utf8_polish_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

CREATE TABLE `config_learn` (
  `id` int(11) NOT NULL,
  `channel` text COLLATE utf8_polish_ci NOT NULL,
  `instance` text COLLATE utf8_polish_ci NOT NULL,
  `info` text COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

CREATE TABLE `config_talk` (
  `id` int(11) NOT NULL,
  `channel` text COLLATE utf8_polish_ci NOT NULL,
  `instance` text COLLATE utf8_polish_ci NOT NULL,
  `info` text COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

ALTER TABLE `brain`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `config_learn`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `config_talk`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `brain`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `config_learn`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `config_talk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

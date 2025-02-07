-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 07, 2025 at 05:12 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shopping`
--

-- --------------------------------------------------------

--
-- Table structure for table `sp_order`
--

CREATE TABLE `sp_order` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `fullname` text DEFAULT NULL,
  `phone` varchar(10) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `zipcode` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sp_order`
--

INSERT INTO `sp_order` (`id`, `user_id`, `fullname`, `phone`, `address`, `zipcode`) VALUES
(44, 53, 'asdsa', '000', 'asdas', '000'),
(45, 53, 'asdsa', '000', 'asdas', '000'),
(46, 53, 'asdsa', '000', 'asdas', '000'),
(47, 53, 'asdsa', '000', 'asdas', '000'),
(48, 53, 'asdsa', '000', 'asdas', '000');

-- --------------------------------------------------------

--
-- Table structure for table `sp_orders`
--

CREATE TABLE `sp_orders` (
  `order_id` int(11) NOT NULL,
  `transid` int(20) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `address` text NOT NULL,
  `zipcode` varchar(10) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sp_orders_new`
--

CREATE TABLE `sp_orders_new` (
  `order_id` int(11) NOT NULL,
  `trans_id` int(11) NOT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `zipcode` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf16 COLLATE=utf16_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sp_payment`
--

CREATE TABLE `sp_payment` (
  `id` int(11) NOT NULL,
  `transid` text NOT NULL,
  `total_amount` int(11) DEFAULT NULL,
  `Operation` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sp_payment`
--

INSERT INTO `sp_payment` (`id`, `transid`, `total_amount`, `Operation`) VALUES
(1, '1738827048089', 3444, 'WAIT');

-- --------------------------------------------------------

--
-- Table structure for table `sp_product`
--

CREATE TABLE `sp_product` (
  `id` int(11) NOT NULL,
  `name` text DEFAULT NULL,
  `img` text DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `sp_product`
--

INSERT INTO `sp_product` (`id`, `name`, `img`, `price`, `description`, `type`) VALUES
(1, 'Black-Red Vlone Hoodie', 'asdsa.png', 1500, 'vlone drrr derrere derer', 'hoodie'),
(2, 'White shirt', 'sssaaa.png', 500, 'White shirt lorem lorem', 'shirt'),
(3, 'Black pant', 'asdsadasda.jpg', 2100, 'Pant lorem lorem', 'pant');

-- --------------------------------------------------------

--
-- Table structure for table `sp_transaction`
--

CREATE TABLE `sp_transaction` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `transid` text DEFAULT NULL,
  `orderlist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`orderlist`)),
  `amount` int(11) DEFAULT NULL,
  `shipping` int(11) DEFAULT NULL,
  `vat` int(11) DEFAULT NULL,
  `netamount` int(11) DEFAULT NULL,
  `operation` text DEFAULT NULL,
  `mil` bigint(20) DEFAULT NULL,
  `updated_at` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `sp_transaction`
--

INSERT INTO `sp_transaction` (`id`, `user_id`, `transid`, `orderlist`, `amount`, `shipping`, `vat`, `netamount`, `operation`, `mil`, `updated_at`) VALUES
(24, 0, '1738827048089', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738827048089, '2025-02-06 07:30:48'),
(25, 0, '1738827071362', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738827071362, '2025-02-06 07:31:11'),
(27, 0, '1738827962172', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1},{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1}]', 2000, 2060, 144, 2204, 'PENDING', 1738827962172, '2025-02-06 07:46:02'),
(31, 0, '1738828300349', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738828300349, '2025-02-06 07:51:40'),
(32, 0, '1738828424228', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738828424228, '2025-02-06 07:53:44'),
(33, 0, '1738828631482', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738828631482, '2025-02-06 07:57:11'),
(37, 0, '1738835178207', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738835178207, '2025-02-06 09:46:18'),
(38, 0, '1738835223950', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738835223950, '2025-02-06 09:47:03'),
(39, 0, '1738835281484', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738835281484, '2025-02-06 09:48:01'),
(40, 0, '1738835380329', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738835380329, '2025-02-06 09:49:40'),
(41, 0, '1738837325469', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738837325469, '2025-02-06 10:22:05'),
(43, 0, '1738838088246', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738838088246, '2025-02-06 10:34:48'),
(44, 0, '1738838153628', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738838153628, '2025-02-06 10:35:53'),
(45, 0, '1738908875220', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738908875220, '2025-02-07 06:14:35'),
(49, 0, '1738909961155', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738909961155, '2025-02-07 06:32:41'),
(50, 0, '1738910112586', '[{\"index\":0,\"id\":3,\"name\":\"Black pant\",\"price\":2100,\"img\":\"asdsadasda.jpg\",\"count\":1},{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1},{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 4100, 4160, 291, 4451, 'PENDING', 1738910112586, '2025-02-07 06:35:12'),
(51, 0, '1738911111545', '[{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":2}]', 1000, 1060, 74, 1134, 'PENDING', 1738911111545, '2025-02-07 06:51:51'),
(52, 0, '1738911989233', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1},{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":3}]', 3000, 3060, 214, 3274, 'PENDING', 1738911989233, '2025-02-07 07:06:29'),
(53, 0, '1738912472840', '[{\"index\":0,\"id\":3,\"name\":\"Black pant\",\"price\":2100,\"img\":\"asdsadasda.jpg\",\"count\":1},{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1},{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 4100, 4160, 291, 4451, 'PENDING', 1738912472840, '2025-02-07 07:14:32'),
(54, 0, '1738912571772', '[{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":2},{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":2}]', 4000, 4060, 284, 4344, 'PENDING', 1738912571772, '2025-02-07 07:16:11'),
(55, 0, '1738912973158', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":7}]', 10500, 10560, 739, 11299, 'PENDING', 1738912973158, '2025-02-07 07:22:53'),
(56, 0, '1738913430531', '[{\"index\":0,\"id\":3,\"name\":\"Black pant\",\"price\":2100,\"img\":\"asdsadasda.jpg\",\"count\":1},{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1}]', 2600, 2660, 186, 2846, 'PENDING', 1738913430531, '2025-02-07 07:30:30'),
(57, 0, '1738913897808', '[{\"index\":0,\"id\":3,\"name\":\"Black pant\",\"price\":2100,\"img\":\"asdsadasda.jpg\",\"count\":1},{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1},{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 4100, 4160, 291, 4451, 'PENDING', 1738913897808, '2025-02-07 07:38:17'),
(58, 0, '1738913935699', '[{\"index\":0,\"id\":3,\"name\":\"Black pant\",\"price\":2100,\"img\":\"asdsadasda.jpg\",\"count\":1}]', 2100, 2160, 151, 2311, 'PENDING', 1738913935699, '2025-02-07 07:38:55'),
(59, 0, '1738914655716', '[{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":3},{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 3000, 3060, 214, 3274, 'PENDING', 1738914655716, '2025-02-07 07:50:55'),
(61, 1, '1738914673250', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":2}]', 3000, 3060, 214, 3274, 'PENDING', 1738914673250, '2025-02-07 07:51:13'),
(63, 0, '1738920857461', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738920857461, '2025-02-07 09:34:17'),
(65, 0, '1738921014591', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738921014591, '2025-02-07 09:36:54'),
(66, 0, '1738921027205', '[{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1}]', 500, 560, 39, 599, 'PENDING', 1738921027205, '2025-02-07 09:37:07'),
(68, 0, '1738921396609', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738921396609, '2025-02-07 09:43:16'),
(69, 0, '1738921440941', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738921440941, '2025-02-07 09:44:00'),
(70, 0, '1738921459592', '[{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1}]', 500, 560, 39, 599, 'PENDING', 1738921459592, '2025-02-07 09:44:19'),
(71, 0, '1738921883072', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738921883072, '2025-02-07 09:51:23'),
(72, 0, '1738921944319', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738921944319, '2025-02-07 09:52:24'),
(73, 53, '1738922244114', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738922244114, '2025-02-07 09:57:24'),
(74, 53, '1738924129326', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1},{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1}]', 2000, 2060, 144, 2204, 'CANCEL', 1738924129326, '2025-02-07 10:28:49'),
(75, 53, '1738924902948', '[{\"index\":0,\"id\":3,\"name\":\"Black pant\",\"price\":2100,\"img\":\"asdsadasda.jpg\",\"count\":2},{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1}]', 4700, 4760, 333, 5093, 'aa', 1738924902948, '2025-02-07 10:41:42'),
(78, 53, '1738925921362', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":4},{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1},{\"index\":0,\"id\":3,\"name\":\"Black pant\",\"price\":2100,\"img\":\"asdsadasda.jpg\",\"count\":1}]', 8600, 8660, 606, 9266, 'NULL', 1738925921362, '2025-02-07 10:58:41'),
(79, 53, '1738926470010', '[{\"index\":0,\"id\":3,\"name\":\"Black pant\",\"price\":2100,\"img\":\"asdsadasda.jpg\",\"count\":1}]', 2100, 2160, 151, 2311, 'FINISH', 1738926470010, '2025-02-07 11:07:50'),
(80, 53, '1738926526741', '[{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1}]', 500, 560, 39, 599, 'WAIT', 1738926526741, '2025-02-07 11:08:46'),
(81, 53, '1738926682955', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'SHIPPING', 1738926682955, '2025-02-07 11:11:22'),
(82, 53, '1738938526164', '[{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":2}]', 1000, 1060, 74, 1134, 'PENDING', 1738938526164, '2025-02-07 14:28:46'),
(83, 53, '1738940746799', '[{\"index\":0,\"id\":3,\"name\":\"Black pant\",\"price\":2100,\"img\":\"asdsadasda.jpg\",\"count\":1}]', 2100, 2160, 151, 2311, 'PENDING', 1738940746800, '2025-02-07 15:05:46'),
(85, 53, '1738941183183', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'CANCEL', 1738941183183, '2025-02-07 15:13:03'),
(86, 53, '1738941204248', '[{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1}]', 500, 560, 39, 599, 'CANCEL', 1738941204248, '2025-02-07 15:13:24'),
(87, 53, '1738941228248', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'CANCEL', 1738941228248, '2025-02-07 15:13:48'),
(88, 53, '1738941540928', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738941540928, '2025-02-07 15:19:00'),
(89, 53, '1738941566334', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738941566334, '2025-02-07 15:19:26'),
(90, 53, '1738941671918', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738941671918, '2025-02-07 15:21:11'),
(91, 53, '1738942002753', '[{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1}]', 500, 560, 39, 599, 'PENDING', 1738942002753, '2025-02-07 15:26:42'),
(92, 53, '1738943218668', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738943218668, '2025-02-07 15:46:58'),
(93, 53, '1738943289971', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'WAIT', 1738943289971, '2025-02-07 15:48:09'),
(94, 53, '1738943825423', '[{\"index\":1,\"id\":2,\"name\":\"White shirt\",\"price\":500,\"img\":\"sssaaa.png\",\"count\":1}]', 500, 560, 39, 599, 'WAIT', 1738943825424, '2025-02-07 15:57:05'),
(95, 53, '1738944162462', '[{\"index\":2,\"id\":1,\"name\":\"Black-Red Vlone Hoodie\",\"price\":1500,\"img\":\"asdsa.png\",\"count\":1}]', 1500, 1560, 109, 1669, 'PENDING', 1738944162462, '2025-02-07 16:02:42');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `created_at`) VALUES
(52, 'asd', 'asd@asd', 'asd', '2025-02-07 08:22:28'),
(53, 'aaa', 'aaa@aaa', 'aaa', '2025-02-07 08:29:02'),
(54, 'beam', 'beammer2547@gmail.com', 'beam', '2025-02-07 08:51:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sp_order`
--
ALTER TABLE `sp_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sp_orders`
--
ALTER TABLE `sp_orders`
  ADD PRIMARY KEY (`order_id`),
  ADD UNIQUE KEY `transid` (`transid`);

--
-- Indexes for table `sp_orders_new`
--
ALTER TABLE `sp_orders_new`
  ADD PRIMARY KEY (`order_id`,`trans_id`),
  ADD KEY `transid` (`trans_id`);

--
-- Indexes for table `sp_payment`
--
ALTER TABLE `sp_payment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transid` (`transid`) USING HASH;

--
-- Indexes for table `sp_product`
--
ALTER TABLE `sp_product`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sp_transaction`
--
ALTER TABLE `sp_transaction`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transid` (`transid`) USING HASH,
  ADD UNIQUE KEY `transid_2` (`transid`) USING HASH,
  ADD KEY `user_id_fk` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sp_order`
--
ALTER TABLE `sp_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `sp_orders`
--
ALTER TABLE `sp_orders`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sp_orders_new`
--
ALTER TABLE `sp_orders_new`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sp_product`
--
ALTER TABLE `sp_product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `sp_transaction`
--
ALTER TABLE `sp_transaction`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `sp_orders_new`
--
ALTER TABLE `sp_orders_new`
  ADD CONSTRAINT `transid` FOREIGN KEY (`trans_id`) REFERENCES `sp_transaction` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

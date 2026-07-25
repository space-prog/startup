<?php
error_reporting(0);
ini_set('display_errors', '0');

$name = $_POST["name"] ?? '';
$mail = $_POST["mail"] ?? '';
$subject = $_POST["subject"] ?? '';
$compname = $_POST["compname"] ?? '';
$message = $_POST["message"] ?? '';

$token = "7176990752:AAH4MkDpRdRIBGm90SCE-9s24WPM9V4Dl80";
$chat_id = 5858755336;

$text = "<b>Замовлення з сайту Startup:</b>\n" .
    "<b>Ім'я:</b> " . htmlspecialchars($name) . "\n" .
    "<b>Email:</b> " . htmlspecialchars($mail) . "\n" .
    "<b>Тема листа:</b> " . htmlspecialchars($subject) . "\n" .
    "<b>Назва компанії:</b> " . htmlspecialchars($compname) . "\n" .
    "<b>Повідомлення:</b> " . htmlspecialchars($message);

$url = "https://api.telegram.org/bot" . $token . "/sendMessage";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, [
    "chat_id" => $chat_id,
    "text" => $text,
    "parse_mode" => "HTML"
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_exec($ch);
curl_close($ch);
?>
<!DOCTYPE html>
<html lang="uk">

<head>
    <meta charset="UTF-8">
    <title>Готово</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            background: #111;
            color: #fff;
            font-family: sans-serif;
            text-align: center;
        }

        a {
            color: #c0301a;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <h1>ВСЕ СУПЕР! ВИ ПРОСТО МОЛОДЕЦЬ</h1>
    <a href="index.html">Повернутися Назад</a>
</body>

</html>
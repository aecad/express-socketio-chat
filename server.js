"use strict";

// モジュール
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const moment = require("moment");

// オブジェクト
const app = express();
const server = http.Server(app);
const io = socketIO(server);

/** 定数 */
const PORT = process.env.PORT || 3000;
const SYSTEM_NICKNAME = "**system**";

// グローバル変数
let iCountUser = 0; // ユーザー数

// 接続時の処理
io.on("connection", socket => {
  console.log("connection");

  let strNickname = ""; // コネクションごとで固有のニックネーム。イベントをまたいで使用される。

  // 切断時の処理
  socket.on("disconnect", () => {
    console.log("disconnect");

    if (strNickname) {
      // ユーザー数の更新
      iCountUser--;

      // メッセージオブジェクトに現在時刻を追加
      const strNow = moment().format("lll");

      // システムメッセージの作成
      const objMsg = {
        strNickname: SYSTEM_NICKNAME,
        strMsg:
          strNickname + " left." + " there are " + iCountUser + " participants",
        strDate: strNow
      };

      // 送信元含む全員に送信
      io.emit("spread message", objMsg);
    }
  });

  // 入室時の処理
  socket.on("join", strNickname_ => {
    console.log("joined :", strNickname_);

    // コネクションごとで固有のニックネームに設定
    strNickname = strNickname_;

    // ユーザー数の更新
    iCountUser++;

    // メッセージオブジェクトに現在時刻を追加
    const strNow = moment().format("lll");

    // システムメッセージの作成
    const objMsg = {
      strNickname: SYSTEM_NICKNAME,
      strMsg:
        strNickname + " joined." + " there are " + iCountUser + " participants",
      strDate: strNow
    };

    // 送信元含む全員に送信
    io.emit("spread message", objMsg);
  });

  // 新しいメッセージ受信時の処理
  socket.on("new message", strMsg => {
    console.log("new message", strMsg);

    // 現在時刻の文字列の作成
    const strNow = moment().format("lll");

    // メッセージオブジェクトの作成
    const objMsg = {
      strNickname: strNickname,
      strMsg: strMsg,
      strDate: strNow
    };

    // 送信元含む全員に送信
    io.emit("spread message", objMsg);
  });
});

// 公開フォルダの指定
app.use(express.static(__dirname + "/public"));

// サーバーの起動
server.listen(PORT, () => {
  console.log("server starts on port: %d", PORT);
});

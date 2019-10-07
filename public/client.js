// クライアントからサーバーへの接続要求
const socket = io.connect();

// 接続時の処理
socket.on('connect', () => {
    console.log('connect');
});

// 「Join」ボタンを押したときの処理
$('#join-form').submit(() => {
    const nickname = $('#input_nickname').val();
    console.log('#input_nickname :', nickname);

    if (nickname) {
        // サーバーに、イベント名'join' で入力テキストを送信
        socket.emit('join', nickname);

        $('#nickname').html(nickname);
        $('#join-screen').hide();
        $('#chat-screen').show();
    }

    // フォーム送信はしない
    return false;
});

// 「Send」ボタンを押したときの処理
$('form').submit(() => {
    const $inp = $('#input_message');
    const text = $inp.val();

    console.log('#input_message :', text);

    if (text.length !== 0) {
        // サーバーに、イベント名'new message' で入力テキストを送信
        socket.emit('new message', text);

        // テキストボックスを空に
        $inp.val('');
    }

    // フォーム送信はしない
    return false;
});

// サーバーからのメッセージ拡散に対する処理
socket.on('spread message', (objMsg) => {
    console.log('spread message :', objMsg);

    // メッセージの整形
    const strText = objMsg.strDate + ' - [' + objMsg.strNickname + '] ' + objMsg.strMsg;

    // 拡散されたメッセージをメッセージリストの一番上に追加
    $('#message_list').prepend($('<li>').text(strText));
});
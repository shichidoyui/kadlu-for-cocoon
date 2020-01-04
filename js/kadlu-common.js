//ここに追加したいJavaScript、jQueryを記入してください。
//このJavaScriptファイルは、親テーマのJavaScriptファイルのあとに呼び出されます。
//JavaScriptやjQueryで親テーマのjavascript.jsに加えて関数を記入したい時に使用します。


/** サブウィンドウシステム「0:最小 1:半分 2:全画面」 */
var modalLebel = Number(1);

/** サブウィンドウシステム 最小からの復帰時の座標記憶 */
var subWindowX = Number(0);
var subWindowY = Number(0);

/** スタイル変更のブレークポイント */
var breakPoint = Number(1023);

var subWindowScript = String('');

/** Safari対応 youtubeにインライン再生のパラメータ付与*/
var req_params = 'playsinline=1';

$(function () {
    barba.init({
        transitions: [{
            afterEnter() {
                // Youtubeにサブウィンドウ用のデザインを付与
                initYoutube();
                // サブウィンドウシステムのボタンにイベントを付与
                initSubWindow();
            },
            after() {
                // サイドバーのメニューを一度クリアし、本体の目次をコピー
                initToc();
                $('#content').hide().fadeIn('slow');
            }
        }]
    });
    // Youtubeにインライン再生URLを付与
    initYoutube();
    // サブウィンドウシステムのコマンド読み込み
    initSubWindowCommand();
    // 各ボタンにサブウィンドウ用のボタンを登録
    initSubWindow();
});


/**
 * モーダル制御のメソッド (一度のみ)
 */
function initSubWindowCommand() {

    /** モーダルのリサイズを可能にする */
    $('#sub-window').resizable({
        handles: 'nw, n, ne, w, e, sw, s, se'
    });

    /** モーダルのドラッグを可能にする */
    $('#sub-window').draggable({
        containment: 'parent',
        scroll: false
    });

    /** モーダル拡大 */
    $('#sub-window-up').on('click', function () {
        // モーダルレベルを一つ上げる
        modalLebel = modalLebel + 1;
        if (modalLebel >= 2) {
            // モーダルレベルが2以上のとき
            // レベルの固定(保険)
            modalLebel = Number(2);
            // 現在位置を取得する。
            subWindowX = $('#sub-window').offset().left;
            subWindowY = $('#sub-window').offset().top - $(window).scrollTop();
            // 拡大ボタンを非表示にする
            $('#sub-window-up').addClass('is-hidden');
            // 全画面へのサイズ調整
            $('#sub-window').css('height', '100vh').css('top', '0');
        }

        if (modalLebel === 1) {
            // モーダルレベルが1のとき
            // 画面へ真ん中へ位置調整
            const top = subWindowY + $(window).scrollTop();
            $('#sub-window').offset({ top: top, left: subWindowX }).css('height', '40vh');
            if ($(window).width() <= breakPoint) {
                $('#sub-window').offset({ top: top, left: subWindowX }).css('bottom', '0').css('top', 'unset');
            }
            // 縮小ボタンを表示にする
            $('#sub-window-down').removeClass('is-hidden');
            // ドラッグ可能にする
            $('#sub-window').draggable('enable');
        }
    });

    /** モーダル縮小 */
    $('#sub-window-down').on('click', function () {
        // モーダルレベルを一つ下げる
        modalLebel = modalLebel - 1;
        if (modalLebel === 1) {
            // モーダルレベルが1のとき
            // 画面へ真ん中へ位置調整
            const top = subWindowY + $(window).scrollTop();
            $('#sub-window').offset({ top: top, left: subWindowX }).css('height', '40vh');
            if ($(window).width() <= breakPoint) {
                $('#sub-window').css('bottom', '0').css('top', 'unset');
            }
            // 拡大ボタンを表示にする
            $('#sub-window-up').removeClass('is-hidden');
        }
        if (modalLebel <= 0) {
            // モーダルレベルが0以下のとき
            // レベルの固定(保険)
            modalLebel = Number(0);
            // 縮小ボタンを非表示にする
            $('#sub-window-down').addClass('is-hidden');
            // 現在位置を取得する。
            subWindowX = $('#sub-window').offset().left;
            subWindowY = $('#sub-window').offset().top - $(window).scrollTop();
            // 最小化の位置へ移動する
            const top = $(window).height() - 48 + $(window).scrollTop();
            $('#sub-window').offset({ top: top, left: 0 }).css('bottom', -$('#sub-window').height() + 48).css('top', 'unset');
            // ドラッグ不可
            $('#sub-window').draggable('disable');
        }
    });

    /** サブウィンドウ閉じるボタン */
    $('#sub-window-close').on('click', function () {
        // コンテンツを白紙にし、モーダルを隠す
        $('#sub-window-content').html('');
        $('#sub-window').addClass('is-hidden');
    });
}

/**
 * モーダルを開く処理
 */
function subWindowOpen() {

    if ($('#sub-window').hasClass('is-hidden')) {
        // 非表示状態の場合、位置をリセットして表示する
        $('#sub-window').removeClass('is-hidden').css('height', '40vh');
        const top = $(window).height() - $('#sub-window').height() + $(window).scrollTop();
        $('#sub-window').offset({ top: top, left: 0 });
        if ($(window).width() <= breakPoint) {
            $('#sub-window').css('bottom', '0').css('top', 'unset');
        }
        // 拡大・縮小ボタンを表示にする
        $('#sub-window-up,#sub-window-down').removeClass('is-hidden');
        // モーダルレベルをリセット
        modalLebel = Number(1);
    }
}

/** 
 * モーダルを開くボタンを設定する(リロードごと)
 */
function initSubWindow() {

    /** サブウィンドウ開くボタン */
    $('.sub-window-open-label').on('click', function () {
        // コンテンツをコピーし、モーダルを表示する(識別用のクラスも付与)
        $('#sub-window-content').html($(this).next().prop('outerHTML')).children().addClass('copy');
        $('#sub-window-title').html('');

        // もしyoutubeならば、インライン再生を可能にする
        if ($("#sub-window-content").children().prop("tagName") === 'IFRAME') {
            var url = $("#sub-window-content").children().attr('src');
            if (typeof url !== 'undefined') {
                if (url.indexOf('youtube') !== -1 && url.indexOf('playsinline=1') === -1) {
                    // youtubeのURLでインライン再生のパラメータがついていない場合
                    var new_path = url + `${(url.indexOf('?') === -1) ? '?' : '&'}` + req_params;
                    $("#sub-window-content").children().attr('src', '');
                    $("#sub-window-content").children().attr('src', new_path);
                }
            }
        }
        // サブウィンドウを開く
        subWindowOpen();
    });

    // 目次クリックの場合
    $('.toc,.widget_toc').on('click', function () {
        // コンテンツをコピーし、モーダルを表示する(識別用のクラスも付与)
        if ($('#sub-window').attr('class').indexOf('is-hidden') !== -1) {
            $('#sub-window-content').html('<div>' + $(this).html() + '</div>').children().addClass('copy-toc');
            $('#sub-window-title').html('目次');
            subWindowOpen();
        }
    });
}

/** youtubeならばサブウィンドウ起動用デザインに変更する*/
function initYoutube() {
    $('iframe').not('.copy').each(function () {
        var url = $(this).attr('src');
        if (typeof url !== 'undefined' && url.indexOf('youtube') !== -1) {
            // youtubeの場合、サブウィンドウを付与する
            $(this).parent().parent().after(`
                <div class="sub-window-open tag-link">
                  <div class="sub-window-open-label cat-label">
                    <i class="fa fa-window-restore" aria-hidden="true"></i>
                  </div>
                ${$(this).prop('outerHTML')}
                </div>`);
            $(this).parent().parent().remove();
        }
    });
}

/**
 * 目次遷移とスクロール(リロードごと)
 */
function initToc() {
    const hash = decodeURI(location.hash);
    if (hash) {
        $(window).scrollTop($(hash).offset().top);
    } else {
        $(window).scrollTop($('main').offset().top);
    }
    //サイドバー目次・SNSの変更 クリアして変更した画面の物をコピー
    setTimeout(() => {
        $('.copy-toc,.widget_toc').html('').html($('#toc').html());
    });
}

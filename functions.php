<?php //子テーマ用関数
if ( !defined( 'ABSPATH' ) ) exit;

//子テーマ用のビジュアルエディタースタイルを適用
add_editor_style();

//以下に子テーマ用の関数を書く

//kadlu用JSを挿入 START
//子テーマのjavascript.jsの読み込み
if ( !function_exists( 'wp_enqueue_script_theme_child_js' ) ):
    function wp_enqueue_script_theme_child_js(){
      if (is_child_theme()) {
        wp_enqueue_style( 'jqueryUiCss', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/smoothness/jquery-ui.css', array(), false, 'all' );
        wp_enqueue_script( 'jqueryUiJs', 'https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js', array( 'jquery', THEME_JS ), false, true );
        wp_enqueue_script( 'barba', 'https://unpkg.com/@barba/core', array( 'jquery', THEME_JS ), false, true );
        wp_enqueue_script( THEME_CHILD_JS, THEME_CHILD_JS_URL, array( 'jquery', THEME_JS,'jqueryUiJs','barba' ), false, true );
      }
    }
    endif;
//kadlu用JSを挿入 END
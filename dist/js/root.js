let edit_user_obj;

// rootユーザー用の編集ボタン表示
let rootFC = () => {
  console.log("root");
  root_select.className = "display-inline";
  accounting.className = "display-block";
  firebase_mk_select.map((value) => {
    let option = el('option');
    option.value = value.name;
    option.textContent = value.name;
    option.id = value.name;
    root_select.appendChild(option);
  })
  // 会計処理
  accountingFC();
}

// 会計金額の表示
let accountingFC = () => {
  let ttlMoney = number * 1500;
  accounting_text.innerHTML = `今日の合計金額:${ttlMoney}円<br>※一律1500円で計算。初回の方考慮にできていません。`
}

// 編集したいユーザーをセレクトタグから選択
root_select.addEventListener('change', (event) => {
  console.log("select");
  let eventElem = event.target;
  console.log(eventElem.value)
  firebase_mk_select.map((value) => {
    if (value.name === eventElem.value) {
      edit_user_obj = value;
    }
  })
  console.log(edit_user_obj);
  // チェックをリセットする
  Array.from(all_checkbox).map((nodelist) => {
    nodelist.checked = false;
  })
  // チェックを付ける
  if(edit_user_obj.id != undefined){
    edit_user_obj.id.map((id) => {
      let v_id = document.getElementById(id);
      v_id.checked = true; // input要素にcheck付ける
    });
    checkbox_array = edit_user_obj.id; // 登録時に使う配列にデータを初期値として0ベースで更新
  } else {
    checkbox_array = [];
  }

  root_edit_btn.className = "display-inline";
  root_remove_btn.className = "display-inline";
  root_message.className = "display-blcok supplement-message";
  add_btn.className = "display-none";
  edit_btn.className = "display-none";
  remove_btn.className = "display-none";
  user_name.readOnly = true;
  user_name.value = "※名前の編集はできません"
});

// 更新ボタン
let rootEditFC = () => {
  console.log("rootEditFC!!")
  console.log(edit_user_obj);
  console.log(firebase_db_all.not_login)
  console.log(firebase_db_all.login)
  let checkNotLoginUser;
  let checkLoginUser;

  // 編集したいユーザーが未ログインユーザーの場合
  if(firebase_db_all.not_login !== undefined){
    checkNotLoginUser = Object.keys(firebase_db_all.not_login) //ここまでで名前 ["test3", "testt2"]
    .filter(function(value) {
      console.log(value); // test3とtestt2をそれぞれ1回ずつ出力
      return firebase_db_all.not_login[value].name == edit_user_obj.name; // 該当した場合配列を返す
      // firebase_db_all.not_login.test3.nameを出力している
    });
  }
  // 編集したいユーザーがログインユーザーの場合
  if(firebase_db_all.login !== undefined){
    checkLoginUser = Object.keys(firebase_db_all.login) // uid取得
    .filter((value) => { // valueはuid
      return firebase_db_all.login[value].name == edit_user_obj.name;
    });
    // firebase_db_all.login.PjHpKypnuVYPoAIhrc3pUmwawMK2.nameを出力している
  }

  if(checkNotLoginUser !== undefined ){  
    console.log(checkNotLoginUser)
    if (checkNotLoginUser.length === 1){
      if(beforeValidateCheck()){
        db.ref(`/users/not_login/${edit_user_obj.name}/`).update({
          id:edit_user_obj.id,
          name:edit_user_obj.name
        });
      }
    }
  } 
  if (checkLoginUser !== undefined) {
    console.log(checkLoginUser[0])
    if (checkLoginUser.length === 1) {
      if(beforeValidateCheck()){
        db.ref(`/users/login/${checkLoginUser[0]}/`).update({
          id:edit_user_obj.id,
          name:edit_user_obj.name
        });
      }
    }
  }
  location.reload();
};

// 削除ボタン
let rootRemoveFC = () => {
  console.log("rootRemoveFC!!")
  db.ref(`/users/not_login/${edit_user_obj.name}/`).remove();
  location.reload();
}
let firebase_db_all;
let firebase_db_user; // ログイン中の自身のデータ
let number; // 参加者人数
// ルートユーザー [ルート]
let root_uid = ["12wYYpvChKe5vnng34x28Kgpyks1"];

// DB追加
let addFC = () => {
  if(beforeValidate()){
    console.log("validate=true")
    if(firebase.auth().currentUser != null){
      if(root_uid.indexOf(firebase.auth().currentUser.uid) !== -1 ){
        console.log("root")
        db.ref(`/users/root/${firebase.auth().currentUser.uid}/`).set({
          name:user_name.value,
          id:checkbox_array
        });
      } else {
        console.log("login")
        db.ref(`/users/login/${firebase.auth().currentUser.uid}/`).set({
          name:user_name.value,
          id:checkbox_array
        });
      };
    } else {
      console.log("not_login")
      db.ref(`/users/not_login/${user_name.value}/`).set({
        name:user_name.value,
        id:checkbox_array
      });
    };
    location.reload();
  };
}
// DB更新
let editFC = () => {
  console.log("edit")
  // checkのバリデートだけ
  if(beforeValidateCheck()){
    if(firebase.auth().currentUser != null){
      if(root_uid.indexOf(firebase.auth().currentUser.uid) !== -1 ){
        console.log("root")
        db.ref(`/users/root/${firebase.auth().currentUser.uid}/`).set({
          name:user_name.value,
          id:checkbox_array
        });
      } else {
        console.log("login")
        db.ref(`/users/login/${firebase.auth().currentUser.uid}/`).set({
          name:user_name.value,
          id:checkbox_array
        });
      };
    } else {
      console.log("not_login")
      db.ref(`/users/not_login/${user_name.value}/`).set({
        name:user_name.value,
        id:checkbox_array
      });
    };
    location.reload();
  }
}
// DB削除
let removeFC = () => {
  db.ref(`/users/${firebase.auth().currentUser.displayName}`).remove();
}
// DB取得
let databaseInitFC = () => {
  // DB取得※usersを取得。配列キーの数を参考に参加者人数算出。
  db.ref(`/users`).once('value', (data) => {
    firebase_db_all = data.val();
    console.log("全てのDBを取得,ユーザー数分実行")
    console.log(firebase_db_all)
    let not_login_number = firebase_db_all.not_login === undefined ? 0 : Object.keys(firebase_db_all.not_login).length;
    let login_number = firebase_db_all.login === undefined ? 0 : Object.keys(firebase_db_all.login).length;
    let root_number = firebase_db_all.root === undefined ? 0 : Object.keys(firebase_db_all.root).length;
    number = not_login_number + login_number + root_number;
    console.log(number);
    people_number.textContent = `参加者人数：${number}人`
    mkSheetFC();
    userDataFC();
  });
}

let userDataFC = () => {
  // DB取得※ログイン中の場合
  if (firebase.auth().currentUser != null){
    // rootの場合
    if(root_uid.indexOf(firebase.auth().currentUser.uid) !== -1 ){
      let connect_DB = db.ref(`/users/root/${firebase.auth().currentUser.uid}`);
      connect_DB.once('value', (data) => {
        firebase_db_user = data.val();
        loggedInFC();
        rootFC();
        // DB更新が発生した際の処理(リロード)
        connect_DB.on('child_changed', function(data) {
          location.reload();
        });
        // DB削除が発生した際の処理(リロード)
        connect_DB.on('child_removed', function(data) {
          location.reload();
        });
      });
    // loginの場合
    } else {
      let connect_DB = db.ref(`/users/login/${firebase.auth().currentUser.uid}`);
      connect_DB.once('value', (data) => {
        firebase_db_user = data.val();
        loggedInFC();
        // DB更新が発生した際の処理(リロード)
        connect_DB.on('child_changed', function(data) {
          location.reload();
        });
        // DB削除が発生した際の処理(リロード)
        connect_DB.on('child_removed', function(data) {
          location.reload();
        });
      });
    }
  }
}
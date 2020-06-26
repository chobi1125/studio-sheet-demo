let firebase_name_all = [];
let firebase_mk_select = [];
let firebase_db_sheet;

let mkSheetFC = () => {
  // 未ログインユーザー
  db.ref(`/users/not_login`).on('child_added', (data) => {
    console.log("mksheet_not_login")
    firebase_mk_select.push(data.val());
    mkSheetChild(data);
  });
  // ログインユーザー
  db.ref(`/users/login`).on('child_added', (data) => {
    console.log("mksheet_login");
    firebase_mk_select.push(data.val());
    mkSheetChild(data);
  });
  // ルートユーザー
  db.ref(`/users/root`).on('child_added', (data) => {
    console.log("mksheet_root")
    mkSheetChild(data);
  });
}

let mkSheetChild = (data) => {
  firebase_db_sheet = data.val();
  firebase_name_all.push(data.val());
  if (firebase_db_sheet != null) {
    if (Array.isArray(firebase_db_sheet.id) === true) {
      firebase_db_sheet.id.map((id) => {
        let sheet_elem = document.getElementById(`sheet_${id}`);
        console.log("mkText");
        let mkText = document.createElement('p');
        mkText.textContent = `・${firebase_db_sheet.name}`;
        sheet_elem.appendChild(mkText);
      });
    }
  }
}

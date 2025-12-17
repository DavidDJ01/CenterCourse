
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import {
  getFirestore, // khởi tạo kết nối đến firebase store
  collection,  // trỏ tới bảng data trong firebase
  addDoc, // add data vào bảng 
  getDocs,
  getDoc,
  setDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { getAuth, signInAnonymously } from
  "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUonuQke27COjjxE6H8i8z03WEX0NFILo",
  authDomain: "center-coursedatabase.firebaseapp.com",
  projectId: "center-coursedatabase",
  storageBucket: "center-coursedatabase.firebasestorage.app",
  messagingSenderId: "397777071978",
  appId: "1:397777071978:web:72ad3042e3b2ab6a293f13,",
  measurementId: "G-WLS27J50BF"
};

$(document).ready(async function () {


  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  var auth = getAuth(app)
  var db = getFirestore(app)

  await signInAnonymously(auth)

  const ManagerBehaviosUser = collection(db, "UserInfoLoadWeb_Db")
  var userId = getCookie("userid");

  var User = {}

  async function getData() {
    await getDocs(ManagerBehaviosUser).then((query) => {
      query.forEach(resData => {
        console.warn(resData.id)
        console.log(resData.data())
      });
    })

  }

  async function getDocId(id) {
    var docSnap = await getDoc(doc(ManagerBehaviosUser, id));
    if (docSnap.exists())
      return true;
    else
      return false;
  }

  async function addData(user) {
    const isId = await getDocId(userId);
    if (!isId) {
      await setDoc(doc(ManagerBehaviosUser, userId), user, { merge: true }).then(() => {
        console.warn("success")
      })
    } else {
      userId = userId + `_${Date.now()}`;
      await setDoc(doc(ManagerBehaviosUser, userId), user, { merge: true }).then(() => {
        console.warn("success")
      })
    }
  }

  async function UpdateData(userid, data) {
    await setDoc(doc(ManagerBehaviosUser, userid), { TimePauseKey: data.timePause, status: data.status }, { merge: true })
      .then(() => {
        console.warn("success")
      })
  }

  async function deletData(params) {
    await deleteDoc(doc(ManagerBehaviosUser, "data Test")).then(() => {
      console.warn('success')
    })
  }
  //get cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null;
  }

  // Set cookie
  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
  }
  // deletData();

  // UpdateData()

  // addData()
  // UserId  => ( SumMouseClick V), TypeDevice(v), TimePauseKey, TimeDateComeWeb(v), State(v) )

  var userAgent = navigator.userAgent;
  console.log(userAgent);
  var isDevid = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isDevid)
    User.TypeDevice = "MobiePhone";
  else {
    User.TypeDevice = "Computer"
  }

  let clickCount = 0;

  $(document).click(function (e) {
    clickCount++
  });

  var now = new Date();
  User.DateComeToWeb = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`

  if (!userId) {
    userId = "user_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
    // setCookie("userid", userId, 365);
    await addData(User)
  }
  //UpdateData()


  // check User pause on div 

  const stayTime = {};     // tổng thời gian dừng (ms)
  let enterTime = 0;
  let currentDiv = null;

  $(".listenMouse").on("mouseenter", function () {
    currentDiv = $(this).data("info");
    enterTime = Date.now();

    if (!stayTime[currentDiv]) {  // lúc này gán div vào obj và kiểm tra logic nếu data = undefine thì  mới khởi tạo| để chạy if thì phải true cho nên !undefine = true
      stayTime[currentDiv] = 0; // { div1 : 0 } nếu ko gán sẽ = undefine || {div1 : undefine}
    }
  });

  $(".listenMouse").on("mouseleave", function () {
    if (!currentDiv) return;

    const duration = Date.now() - enterTime;
    stayTime[currentDiv] += duration; // 

    currentDiv = null;
    enterTime = 0;
  });

  // Khi người dùng rời trang → tính kết quả


  function showResult() {
    let maxDiv = null;
    let maxTime = 0;

    for (let div in stayTime) {
      if (stayTime[div] > maxTime) {
        maxTime = stayTime[div];
        maxDiv = div;
      }
    }
    console.log("Div ở lâu nhất:", maxDiv);
    console.log("Thời gian (giây):", (maxTime / 1000).toFixed(2));
    return `Key lâu nhất: ${maxDiv}, Time: ${(maxTime / 1000).toFixed(2)}`
  }


  //  --------------- mai update----


  // check state
  function sendHeartbeat() {
    var strTimePauseKey = showResult();
    setDoc(doc(ManagerBehaviosUser, userId), {
      TimePauseKey : strTimePauseKey,
      SumMouseClick: clickCount,
      lastSeen: serverTimestamp()
    }, { merge: true })  // merge: true để không ghi đè toàn bộ doc
      .catch(err => console.error("Lỗi gửi heartbeat:", err));
  }
  // Bắt đầu heartbeat
  setInterval(sendHeartbeat, 20000);
  sendHeartbeat(); // gửi ngay khi load trang

  // let lastSeenCache = null;

  // onSnapshot(doc(ManagerBehaviosUser, userId), (docSnap) => {
  //   if (docSnap.exists()) {
  //     lastSeenCache = docSnap.data().lastSeen;
  //   }
  // });


  // let lastOnlineState = null; // null | true | false

  // function isUserOnline(lastSeen) {
  //   if (!lastSeen) return false;

  //   const diff = Date.now() - lastSeen.toMillis();
  //   return diff < 30000; // 30s
  // }

});

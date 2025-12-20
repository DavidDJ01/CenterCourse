
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
  onSnapshot,
  runTransaction,
  enableIndexedDbPersistence
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


  // Initialize Firebase --- Set Up-----
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  var auth = getAuth(app)
  var db = getFirestore(app)

  await signInAnonymously(auth);

  await new Promise(resolve => {
    auth.onAuthStateChanged(user => {
      if (user) resolve(user);
    });
  });

  enableIndexedDbPersistence(db).catch(() => { });

  //------ end setup--------

  const ManagerBehaviosUser = collection(db, "UserInfoLoadWeb_Db")
  // const createUserId = auth.currentUser;
  // var userId = createUserId.uid;
  var User = {}

  async function createUserWithTransaction(db, collectionRef, userData, maxRetry = 5) {
  let finalUserId = null;
  for (let i = 0; i < maxRetry; i++) {
    const userId = "user_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
    const userRef = doc(collectionRef, userId);

    try {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(userRef);  // đọc

        if (snap.exists()) {   // kiểm tra
          throw "ID_COLLISION";  
        }
        transaction.set(userRef, userData); // ghi
      });

      finalUserId = userId;
      return finalUserId; // ✅ THÀNH CÔNG
    } catch (err) {
      if (err !== "ID_COLLISION") {
        throw err; // lỗi khác thì dừng
      }
      // nếu trùng ID → vòng for chạy lại → sinh ID mới
    }
  }

  throw new Error("FAILED_TO_GENERATE_UNIQUE_ID");
}



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
      await setDoc(doc(ManagerBehaviosUser, userId + "_dup_" + Date.now()), user, { merge: true }).then(() => {
        console.warn("success")
      })
    }
  }

  async function safeSetDoc(ref, data, retry = 3) {
    try {
      await setDoc(ref, data, { merge: true });
    } catch (err) {
      console.error("Firestore write failed:", err);
      if (retry > 0) {
        setTimeout(() => safeSetDoc(ref, data, retry - 1), 1000);
      }
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


  var userAgent = navigator.userAgent;
  console.log(userAgent);
  var isDevid = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Lưu tổng thời gian user ở từng div
  const timeSpent = {};

  // Lưu thời điểm user bắt đầu xem div
  let enterTime = {};
  if (isDevid) {

    User.TypeDevice = "MobiePhone";


    $(".listenMouse").each(function () {
      const key = $(this).data("info")
      timeSpent[key] = 0;
    })

    // Tạo observer để theo dõi mỗi div
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const key = entry.target.dataset.info;
        // console.log({
        //   key: entry.target.dataset.info,
        //   isIntersecting: entry.isIntersecting,
        //   ratio: entry.intersectionRatio
        // });
        if (entry.isIntersecting) {
          // User vừa vào div
          // vào viewport
          if (!enterTime[key]) {
            enterTime[key] = Date.now();
          }
        } else {
          // User rời div
          if (enterTime[key]) {
            timeSpent[key] += Date.now() - enterTime[key];
            delete enterTime[key];
          }
        }
      });
    },
      {
        threshold: 0.2 // 60% div xuất hiện mới tính
      }


    );
    // Gán observer cho tất cả div
    $(".listenMouse").each(function () {
      observer.observe(this); // this = DOM element
    });
  }
  else {
    User.TypeDevice = "Computer"

    $(".listenMouse").on("mouseenter", function () {
      const key = this.dataset.info;
      enterTime[key] = Date.now();

      if (!timeSpent[key]) {
        timeSpent[key] = 0;
      }
    });

    $(".listenMouse").on("mouseleave", function () {
      const key = this.dataset.info;

      if (enterTime[key]) {
        timeSpent[key] += Date.now() - enterTime[key];
        delete enterTime[key];
      }
    });

  }

  // let clickCount = 0;

  // $(document).click(function (e) {
  //   clickCount++
  // });

  var now = new Date();
  User.DateComeToWeb = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`

  // if (!userId) {
  //   userId = "user_" + Date.now() + "_" + Math.floor(Math.random() * 1000);
  //   // setCookie("userid", userId, 365);
  // }
  var userId = await createUserWithTransaction(
    db,
    ManagerBehaviosUser,
    {
      ...User,
      firstSeen: serverTimestamp(),
    }
  );


  function showResult() {
    let maxDiv = null;
    let maxTime = 0;
    const now = Date.now()

    for (let key in timeSpent) {
      let total = timeSpent[key];

      if (enterTime[key]) {
        total += now - enterTime[key];
      }

      if (total > maxTime) {
        maxTime = total;
        maxDiv = key;
      }
    }
    console.log("Div ở lâu nhất:", maxDiv);
    console.log("Thời gian (giây):", (maxTime / 1000).toFixed(2));
    return `Key lâu nhất: key ${maxDiv}, Time: ${(maxTime / 1000).toFixed(2)}`
  }

  //  --------------- mai update----

  // check state
  function sendHeartbeat() {
    var strTimePauseKey = showResult();
    safeSetDoc(
      doc(ManagerBehaviosUser, userId),
      {
        TimePauseKey: strTimePauseKey,
        lastSeen: serverTimestamp()
      }
    );
  }
  // Bắt đầu heartbeat
  setInterval(sendHeartbeat, 20000);
  sendHeartbeat(); // gửi ngay khi load trang

});

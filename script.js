class Task {
  constructor(subject, question, vote, id) {
    this.id = id;
    this.subject = subject;
    this.question = question;
    this.vote = vote;
  }
  taskTemplate() {
    return `<div id="${this.id}" class="task">
                <div id="taskhead">
              <h2 id="taskSubject" onclick="responseLayout(${this.id})">${this.subject}</h2>
              <div id="extra">
              <span>${this.vote}</span>
              <button>
                <img id="up" src="./img/image.png" alt="Upvote" onclick="upVote(${this.id})"/>
              </button>
              <button>
                <img id="up" src="./img/down.png" alt="Upvote" onclick="downVote(${this.id})"/>
              </button>
              </div>
            </div>
            <div class="taskQuestion">
              <p>${this.question}</p>
            </div>
            <hr>
          </div>
          `;
  }
}
class Response {
  constructor(name, solution, id,vote,rid) {
    this.id = id;
    this.rid = rid;
    this.name = name;
    this.solution = solution;
    this.vote = vote;
  }
  addTemplate() {
    return `
        <div id="${this.rid}" class="task">
                <div id="taskhead">
              <h2 id="taskSubject" >${this.name}</h2>
              <div id="extra">
              <span>${this.vote}</span>
              <button>
                <img id="up" src="./img/image.png" alt="Upvote" onclick="upVoteR(${this.rid},${this.id})"/>
              </button>
              <button>
                <img id="up" src="./img/down.png" alt="Upvote" onclick="downVoteR(${this.rid},${this.id})"/>
              </button>
              </div>
            </div>
            <div class="taskQuestion">
              <p>${this.solution}</p>
            </div>
            <hr>
          </div>`;
  }
}

var rightContent = document.getElementById("rightPane");
var subject = document.getElementById("subject");
var questionMain = document.getElementById("question");
var questionContain = document.getElementById("questionContainer");
questionLayout();
showTask();

function showTask() {
  let tasklist;
  questionContain.innerHTML = ``;
  if (JSON.parse(localStorage.getItem("task")) !== null) {
    tasklist = JSON.parse(localStorage.getItem("task"));
  } else {
    tasklist = [];
  }
  if (tasklist.length > 0) {
    tasklist.sort((a, b) => b.vote - a.vote);
    tasklist.forEach((element, index) => {
      let task = new Task(
        element.subject,
        element.question,
        element.vote,
        element.id
      );
      questionContain.innerHTML += task.taskTemplate(index);
    });
  }
  else{
    questionContain.innerHTML = `<h1>There's nothing here</h1>`;
  }
}
function submitQ() {
  let subject = document.getElementById("subject");
  let questionMain = document.getElementById("question");
  let questionSubject = subject.value;
  let questionContent = questionMain.value;
  let id = JSON.parse(localStorage.getItem("task"))
    ? Object.keys(JSON.parse(localStorage.getItem("task"))).length
    : 0;
  let task = new Task(questionSubject, questionContent, 0, id);
  if (validate(questionContent, questionSubject)) {
    addTask(task);
  }
  subject.value = "";
  questionMain.value = "";
}
function submitAns(id) {
  let name = document.getElementById("responseName");
  let ans = document.getElementById("responseAns");
  let ansName = name.value;
  let ansAns = ans.value;
  // let rId = JSON.parse(localStorage.getItem('response')) ? Object.keys(JSON.parse(localStorage.getItem('response'))).length : 0 ;
  let rid = Date.now();
  let response = new Response(ansName, ansAns, id,0,rid);
  if (validate(ansName, ansAns)) {
    addResponse(response);
  }
  name.value = "";
  ans.value = "";
}
function validate(x, y) {
  x = x.trim();
  y = y.trim();
  if (x == "" || y == "") {
    handleError("Fields are Mandatorary");
  } else {
    return true;
  }
}
function addResponse(response) {
  // let responseElement = document.getElementById("responseList");
  // responseElement.innerHTML += response.addTemplate();
  let responseList;
  if (JSON.parse(localStorage.getItem("response")) !== null) {
    responseList = JSON.parse(localStorage.getItem("response"));
  } else {
    responseList = [];
  }
  responseList.push(response);
  localStorage.setItem("response", JSON.stringify(responseList));
  responseLayout(response.id);
}
function addTask(task) {
  let tasklist;
  if (JSON.parse(localStorage.getItem("task")) !== null) {
    tasklist = JSON.parse(localStorage.getItem("task"));
  } else {
    tasklist = [];
  }
  tasklist.push(task);
  localStorage.setItem("task", JSON.stringify(tasklist));
  showTask();
}
function responseLayout(tid) {
  let header = JSON.parse(localStorage.getItem("task"))[tid];
  let responseList;
  if (JSON.parse(localStorage.getItem("response")) !== null) {
    responseList = JSON.parse(localStorage.getItem("response"));
  } else {
    responseList = [];
  }
  const responseItem = responseList.filter((n) => n.id == `${tid}`);
  responseItem.sort((a, b) => b.vote - a.vote);
  rightContent.innerHTML = `<h2>Question</h2>
          <div class="rightPaneHeader">
          <h2>${header.subject}</h2>
          <p>${header.question}</p>
          </div>
          <button id="${tid}" class="btn submitBtn" onclick="resolved(${tid})">Resolve</button>
          <h2>Response</h2>
          <div id="responseList" class="responseList">
          </div>
          <h2>Add Response</h2>
          <input id="responseName"  type="text" placeholder="Your Name"/>
          <textarea id="responseAns"  cols="30" rows="10" placeholder="Your Response"></textarea>
          <button class="btn submitBtn" onclick="submitAns(${tid})">Submit</button>`;
  let responseAppend = document.getElementById("responseList");
  responseItem.forEach((element) => {
    let response = new Response(
      element.name,
      element.solution,
      element.id,
      element.vote,
      element.rid
    );
    responseAppend.innerHTML += response.addTemplate();
  });
}
function resolved(tid) {
  questionLayout();
  let tasklist;
  let responselist;
  if (JSON.parse(localStorage.getItem("task")) !== null) {
    tasklist = JSON.parse(localStorage.getItem("task"));
  } else {
    tasklist = [];
  }
  tasklist.splice(tid, 1);
  tasklist.forEach((e) => {
    if (e.id > tid) {
      e.id = e.id - 1;
    }
  });
  localStorage.setItem("task", JSON.stringify(tasklist));
  if (JSON.parse(localStorage.getItem("response")) !== null) {
    responselist = JSON.parse(localStorage.getItem("response"));
  } else {
    responselist = [];
  }
  let response = responselist.filter((e) => e.id !== tid);
  response.forEach((e) => {
    if (e.id > tid) {
      e.id = e.id - 1;
    }
  });
  localStorage.setItem("response", JSON.stringify(response));
  showTask();
}
function questionLayout() {
  rightContent.innerHTML = `<h1>Welcome to Discussion Portal!</h1>
        <h2>Enter a subject and question to get started.</h2>
        <input id="subject" type="text" placeholder="Subject" />
        <textarea
          id="question"
          cols="30"
          rows="10"
          placeholder="Question"
        ></textarea>
        <button id="submitQuestion" class="btn submitBtn" onclick = "submitQ()">Submit</button>`;
}
function upVoteR(index,id)
{
  let responseList = JSON.parse(localStorage.getItem("response"));
  responseList.forEach((e) => {
    if (e.rid === index) {
      e.vote += 1;
    }
  });
  localStorage.setItem("response", JSON.stringify(responseList));
  responseLayout(id);
}
function downVoteR(index, id) {
  let responseList = JSON.parse(localStorage.getItem("response"));
  responseList.forEach((e) => {
    if (e.rid === index) {
      e.vote -= 1;
    }
  });
  localStorage.setItem("response", JSON.stringify(responseList));
  responseLayout(id);
}
function upVote(index) {
  let taskQuestion = JSON.parse(localStorage.getItem("task"));
  taskQuestion[index].vote += 1;
  localStorage.setItem("task", JSON.stringify(taskQuestion));
  showTask();
  questionLayout();
}
function downVote(index) {
  let taskQuestion = JSON.parse(localStorage.getItem("task"));
  taskQuestion[index].vote -= 1;
  localStorage.setItem("task", JSON.stringify(taskQuestion));
  showTask();
  questionLayout();
}
function handleError(message) {
  alert(message);
}

let searchTxt = document.getElementById("searchText");
searchTxt.addEventListener("input", search);
function search() {
  let taskList;
  if (JSON.parse(localStorage.getItem("task")) !== null) {
    taskList = JSON.parse(localStorage.getItem("task"));
  } else {
    taskList = [];
  }
  let text = searchTxt.value;
  text = text.toLowerCase();
  if (taskList.length > 0) {
    let flag = 0;
    questionContain.innerHTML = "";
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].subject.toLowerCase().includes(text)) {
        flag = 1;
        let task = new Task(
          taskList[i].subject,
          taskList[i].question,
          taskList[i].vote,
          taskList[i].id
        );
        questionContain.innerHTML += task.taskTemplate();
      }
    }
    if (flag == 0) {
      questionContain.innerHTML = `<h1>No Matches Found</h1>`;
    }
  } else {
    questionContain.innerHTML = `<h1>You are the First One here!</h1>`;
  }
}

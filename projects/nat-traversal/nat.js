const host_button = document.getElementById("host-button");
const join_button = document.getElementById("join-button");
const code_field = document.getElementById("code-field");
const message_button = document.getElementById("message-button");
const message_field = document.getElementById("message-field");
const status_text = document.getElementById("status");
const chat_log = document.getElementById("chat-log");
const copy_button = document.getElementById("copy-button");

let peer = null;
let conn = null;

function log(msg){
    chat_log.textContent+= msg + "\n";
}

host_button.onclick = () => {
    peer = new Peer();

    peer.on("open", (id)=>{
        console.log("Id is " + id);
        status_text.textContent = id;
        log("Create room with ID: " + id);
    });

    peer.on("connection", (connection) => {
        conn = connection;
        setupConnection();
    });

    host_button.disabled = true;
    code_field.disabled = true;
    join_button.disabled = true;
    code_field.disabled = true;
    copy_button.disabled = false;
    copy_button.textContent = "COPY";
};

join_button.onclick = () => {
    if(conn!=null)
        return

    const code  = code_field.value;
    console.log("Joining on " + code);

    peer = new Peer();
    peer.on("open", () => {
        conn = peer.connect(code);
        setupConnection();
        log("Connecting to " + code);
    })
    join_button.disabled = true;
    host_button.disabled = true;
    
};

message_button.onclick = () => {
    const msg = message_field.value;
    log("You: " + msg);
    message_field.value = "";

    conn.send(msg);
}

function setupConnection(){
    conn.on("open", ()=>{
        chat_log.textContent = ""
        log("Connection Established!");
        host_button.disabled = true;
        code_field.disabled = true;
        join_button.disabled = true;
        message_button.disabled = false;
        message_field.disabled = false;
    });
    conn.on("data", (data)=>{
        log("Them: " + data);
    });
    conn.on("close", ()=>{
        log("Connection Closed");
        host_button.disabled = false;
        code_field.disabled = false;
        join_button.disabled = false;
        message_button.disabled = true;
        message_field.disabled = true;
    });
}

copy_button.onclick = () => {
    navigator.clipboard.writeText(status_text.textContent);
    copy_button.textContent = "COPIED!";
}



 









const host_button = document.getElementById("host-button");
const join_button = document.getElementById("join-button");
const code_field = document.getElementById("code-field");
const message_button = document.getElementById("message-button");
const message_field = document.getElementById("message-field");
const status_text = document.getElementById("status");
const chat_log = document.getElementById("chat-log");

let peer = null;
let conn = null;

function log(msg){
    chat_log.textContent+= msg + "\n";
}

host_button.onclick = () => {
    peer = new Peer();

    peer.on("open", (id)=>{
        console.log("Id is " + id);
        status_text.textContent = "Device ID: " + id;
        log("Create room with ID: " + id);
    });

    peer.on("connection", (connection) => {
        conn = connection;
        setupConnection();
    });

    host_button.disabled = true;
    join_button.disabled = true;
    code_field.disabled = true;
};

join_button.onclick = () => {
    const code  = code_field.value;
    console.log("Joining on " + code);

    peer = new Peer();
    peer.on("open", () => {
        conn = peer.connect(code);
        setupConnection();
        log("Connecting to " + code);
    })
    
};

message_button.onclick = () => {
    const msg = message_field.value;
    log("Sending message: " + msg);

    conn.send(msg);
}

function setupConnection(){
    conn.on("open", ()=>{
        log("Connection Established!");
        message_button.disabled = false;
        message_field.disabled = false;
    });
    conn.on("data", (data)=>{
        log("Received: " + data);
    });
    conn.on("close", ()=>{
        log("Connection Closed");
    });
}



 









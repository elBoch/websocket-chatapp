let send = document.querySelector('.send')
let nameButton = document.querySelector('.name')
let websocket = new WebSocket('ws://127.0.0.1:6789/')
let tempMessage = document.getElementById('template-message')
let tempMessageYou = document.getElementById('template-message-you')
let tempInfo = document.getElementById('template-info')
let nameSender = 'lmbo'
let uuid = null

const changeName = () => {
    nameSender = prompt("Please enter your name:", nameSender);
}

const asign_UUID = () => {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}


changeName()
uuid = asign_UUID()

nameButton.onclick = (e) => {
    changeName()
}

const handleSend = () => {
    if(document.getElementById('input').value !== '' ) {
        websocket.send(JSON.stringify({uuid: uuid, sender: nameSender, message: document.getElementById('input').value}))
        document.getElementById('input').value = ''     
    }
}

send.onclick = (e) => handleSend()


document.getElementById('input').addEventListener("keyup", (e) => {
    if(e.key === 'Enter') {
        handleSend()
    }
})

websocket.onmessage = (e) => {
    let data = JSON.parse(e.data)
    console.log('Data received:' + JSON.stringify(data))
    switch(data.type) {
        case 'message':
            let messageNode = tempMessage.content.cloneNode(true)
            if(data.uuid === uuid) {
                messageNode = tempMessageYou.content.cloneNode(true)
            }
            else {
                messageNode.querySelector('.message-name').textContent = data.sender + ''
            }
            messageNode.querySelector('.message-text').textContent = data.message + ''
            document.getElementById('chat').appendChild(messageNode)
            break;

        case 'info':
            let infoNode = tempInfo.content.cloneNode(true)
            infoNode.querySelector('.info').textContent = data.message + ''
            document.getElementById('chat').appendChild(infoNode)
            break;
        default:
            break;

    }
}
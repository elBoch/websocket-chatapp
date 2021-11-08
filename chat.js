let send = document.querySelector('.send')
let websocket = new WebSocket('ws://127.0.0.1:6789/')
let tempMessage = document.getElementById('template-message')
let tempInfo = document.getElementById('template-info')

send.onclick = (e) => {
    websocket.send(JSON.stringify({message: 'Hello'}))    
}

websocket.onmessage = (e) => {
    let data = JSON.parse(e.data)
    console.log('Data received:' + JSON.stringify(data))
    switch(data.type) {
        case 'message':
            let messageNode = tempMessage.content.cloneNode(true)
            messageNode.querySelector('.message-name').textContent = data.sender + ''
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
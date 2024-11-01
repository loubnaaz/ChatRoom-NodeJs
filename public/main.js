//making a connection to websocket server 
const socket = io()

const clientsTotal = document.getElementById('client-total')
const messageContainer = document.getElementById('message-container')
const nameInput = document.getElementById('name-input')
const messageForm = document.getElementById('message-form')
const messageInput = document.getElementById('message-input')


//add event on message form : submit is the event, e is the event itself
messageForm.addEventListener('submit',(e)=>
{
    e.preventDefault() //otherwise it will reload the page
    sendMessage ()
    
})


socket.on('clients-total', (data) => {
    clientsTotal.innerText = `Total Clients: ${data}`
  })
  
  function sendMessage (){
    if(messageInput.value==='' ) return 
   // console.log(messageInput.value)
    //creat data json object to send it to the server
    const data = {
        name : nameInput.value,
        message : messageInput.value,
        dateTime : new Date (),

}
    //to send the message
    socket.emit('message' , data)
    addMessageTouI (true , data)
     messageInput.value=''
  }

//to recieve a msg
socket.on('chat-message' , (data) =>{
    //console.log(data)
    addMessageTouI (false , data)
   
  })
  
  function addMessageTouI (isOwnMessage, data) {
    clearfeedback ()
    const element = 
        ` <li class="${isOwnMessage ? 'message-right' : 'message-left'}">
            <p class="message">
              ${data.message}
              <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
            </p>
          </li>
        `
  
    messageContainer.innerHTML += element
    scrollToBottom()
  }

  function scrollToBottom(){
    messageContainer.scrollTo(0,messageContainer.scrollHeight)
  }


// when the user is typing 
messageInput.addEventListener('focus' ,(e)=>{
    socket.emit('feedback', {
    feedback : `${nameInput.value} is typing a message`
})

  })
  messageInput.addEventListener('keypress' ,(e)=>{
    socket.emit('feedback', {
    feedback : `${nameInput.value} is typing a message`
})

  })

  messageInput.addEventListener('blur' ,(e)=>{
    socket.emit('feedback', {
    feedback : ''
})

  })

  socket.on('feedback' , (data) =>{
    clearfeedback ()
    //console.log(data)
   const element = `
    <li class="message-feedback">
            <p class="feedback" id="feedback">
                ${data.feedback}
            </p>
        </li>
        `
   messageContainer.innerHTML += element
  })
  function clearfeedback () {

    document.querySelectorAll('li.message-feedback').forEach(element => 
    {
        element.parentNode.removeChild(element)
    }
    )
}
  
  
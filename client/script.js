import bot from './assets/bot.svg'
import user from './assets/user.svg'

const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

// 文字加载函数
const loader = (element) => {
  element.textContent = ''
  // 没3毫秒加一个点 有三个点之后 重置点
  loadInterval = setInterval(() => {
    element.textContent += '.'
    if (element.textContent === '....') {
      element.textContent = ''
    }

  }, 300)
}

// 渲染的时候让文字一个个出来
const typeText = (element, text) => {
  let index = 0
  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHtml += text.charAt(index)
      index++
    } else {
      clearInterval(interval)
    }
  }, 20);
}

//生成随机id
const generateUniqueId = () => {
  const timestamp = Date.now()
  const randomNumber = Math.random()
  const hexadexcimalString = randomNumber.toString(16)
  return `id-${timestamp}=${hexadexcimalString}`
}

// 渲染聊天的条纹
const chatStripe = (isAi, value, uniqueId) => {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}" >
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}">
        </div>
        <div class="message" id="${uniqueId}">${value}</div>
      </div>
    </div>
    `
  )
}

// 提交表单发送信息
const handleSubmit = async (e) => {
  e.preventDefault(); //阻止表单的默认提交

  const data = new FormData(form)
  let message = data.get('prompt') //你输入的消息
  // console.log(data.get('prompt'));
  // 用户发送的消息
  chatContainer.innerHTML += chatStripe(false, message)
  // 重置表单
  form.reset()

  // 获取AI的唯一ID
  const uniqueId = generateUniqueId()
  // AI回复的消息
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId)
  // 将屏幕滚动到最底部
  chatContainer.scrollTop = chatContainer.scrollHeight
  // AI回复消息的DIV
  const messageDiv = document.getElementById(uniqueId)
  // 把AI的回复拦设置成加载状态
  loader(messageDiv)

  //调用openai的接口 获取chatGPT的回复
  const response = await fetch('http://localhost:3000/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: message
    })
  })
  // 关闭加载状态
  clearInterval(loadInterval)
  messageDiv.innerHTML = ''
  // console.log(response.ok);
  if (response.ok) {
    const data = await response.json()
    const parsedData = data.bot.trim()
    console.log(parsedData);
    typeText(messageDiv, parsedData)
    // messageDiv.innerHTML = parsedData
  } else {
    const err = await response.text()
    messageDiv.innerHTML = '发生了一些错误'

    alert(err);
  }

}

// 点击图标发送消息
form.addEventListener('submit', handleSubmit)

// 回车发送消息
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e)
  }
})
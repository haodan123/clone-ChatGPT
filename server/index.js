import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import {Configuration,OpenAIApi} from 'openai'

dotenv.config()
console.log(process.env.OPENAI_API_KEY);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


const app = express()
app.use(cors())
app.use(express.json())
const port = 3000

app.get('/', (req, res) => res.status(200).send('Hello World!'))

app.post('/',async(req,res)=>{
  try {
    const prompt = req.body.prompt
    // 调用 openai的接口获取数据
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`, //你想问的问题 
      temperature: 0, // 值越高意味着模型将承担更多风险。
      max_tokens: 3000, // 完成时要生成的最大令牌数。大多数模型的上下文长度为 2048 个令牌（最新模型除外，它支持 4096）。
      top_p: 1, // 温度采样的替代方法，称为细胞核采样
      frequency_penalty: 0.5, // 介于 -2.0 和 2.0 之间的数字。正值会根据新标记到目前为止在文本中的现有频率来惩罚新标记，从而降低模型逐字重复同一行的可能性。
      presence_penalty: 0, // 介于 -2.0 和 2.0 之间的数字。正值会根据新标记到目前为止是否出现在文本中来惩罚它们，从而增加模型讨论新主题的可能性。
    });
    // console.log( response.data.choices);
    // res.status(200).send()
     res.status(200).send({
      bot: response.data.choices[0].text
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({error})
  }
})
console.log('你好啊');

app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))
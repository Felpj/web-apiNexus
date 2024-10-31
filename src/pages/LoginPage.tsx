import { Form, Input, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from '../axiosConfig'
import useMessage from 'antd/es/message/useMessage'
import { useAuth } from '../hooks/useAuth'

export function LoginPage() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = useMessage()
  const { saveToken } = useAuth()

  const onFinish = (values: any) => {
    axios
      .post('/auth/login', values)
      .then(response => {
        const token = response.data.token
        if (token) {
          saveToken(token)
          messageApi.success('Login realizado com sucesso')
          navigate('/home')
        } else {
          messageApi.error('Erro ao fazer login: Token não recebido')
        }
      })
      .catch(error => {
        messageApi.error(`Erro ao fazer login: ${error.response?.data.error || error.message}`)
      })
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
      {contextHolder}
      <Form
        name="login"
        onFinish={onFinish}
        style={{ maxWidth: 300, padding: 24, backgroundColor: '#1e293b', borderRadius: 8, width: '100%' }}
      >
        <h3 style={{ color: '#fe6000', textAlign: 'center' }}>Login</h3>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Por favor, insira seu email!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
        >
          <Input.Password placeholder="Senha" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Entrar
          </Button>
          <Button type="link" onClick={() => navigate('/register')} style={{ width: '100%' }}>
            Registrar
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

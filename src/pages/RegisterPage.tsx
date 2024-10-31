import { Form, Input, Button, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from '../axiosConfig'

export function RegisterPage() {
  const navigate = useNavigate()

  const onFinish = (values: any) => {
    axios
      .post('/users/register', values)
      .then(() => {
        message.success('Registrado com sucesso')
        navigate('/')
      })
      .catch(error => {
        message.error(`Erro ao registrar: ${error.response?.data.error || error.message}`)
      })
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
      <Form
        name="register"
        onFinish={onFinish}
        style={{ maxWidth: 300, padding: 24, backgroundColor: '#1e293b', borderRadius: 8, width: '100%' }}
      >
        <h3 style={{ color: '#fe6000', textAlign: 'center' }}>Registrar</h3>
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
        >
          <Input placeholder="Nome" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Por favor, insira um email!' }]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Por favor, insira uma senha!' }]}
        >
          <Input.Password placeholder="Senha" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Registrar
          </Button>
          <Button type="link" onClick={() => navigate('/')} style={{ width: '100%' }}>
            Voltar ao Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
